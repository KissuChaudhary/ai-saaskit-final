import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import axios from 'axios'

async function imageUrlToBase64(imageUrl: string): Promise<string> {
  const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  return Buffer.from(response.data, 'binary').toString('base64');
}

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { prompt, mainFaceImage, negativePrompt, seed } = await req.json()

    if (!prompt || !mainFaceImage) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user has enough credits
    const { data: credits, error: creditsError } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('user_id', user.id)
      .single()

    if (creditsError) {
      console.error('Error fetching credits:', creditsError)
      return NextResponse.json(
        { error: 'Error checking credits' },
        { status: 500 }
      )
    }

    if (!credits || credits.credits < 1) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 402 }
      )
    }

    const apiKey = process.env.SEGMIND_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const url = "https://api.segmind.com/v1/flux-pulid"

    let mainFaceImageBase64: string;
    if (mainFaceImage.startsWith('data:image')) {
      mainFaceImageBase64 = mainFaceImage.split(',')[1];
    } else {
      try {
        mainFaceImageBase64 = await imageUrlToBase64(mainFaceImage);
      } catch (error) {
        console.error('Error fetching image:', error);
        return NextResponse.json({ error: 'Failed to fetch image from URL' }, { status: 400 });
      }
    }

    const data = {
      seed: seed || Math.floor(Math.random() * 1000000),
      width: 896,
      height: 1152,
      prompt,
      main_face_image: mainFaceImageBase64,
      true_cfg: 1,
      id_weight: 1.05,
      num_steps: 20,
      start_step: 0,
      num_outputs: 1,
      output_format: "webp",
      guidance_scale: 4,
      output_quality: 80,
      negative_prompt: negativePrompt || "bad quality, worst quality, text, signature, watermark, extra limbs, low resolution, partially rendered objects, deformed or partially rendered eyes, deformed, deformed eyeballs, cross-eyed, blurry",
      max_sequence_length: 128
    }

    const response = await axios.post(url, data, { 
      headers: { 
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      responseType: 'arraybuffer'
    })
    
    const base64Image = Buffer.from(response.data, 'binary').toString('base64')

    // Deduct credits
    const { error: updateError } = await supabase
      .from('user_credits')
      .update({
        credits: credits.credits - 1,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)

    if (updateError) {
      console.error('Error updating credits:', updateError)
      // Continue anyway since we've already made the API call
    }
    
    return NextResponse.json({ 
      result: `data:image/webp;base64,${base64Image}`,
      remainingGenerations: credits.credits - 1
    })
  } catch (error) {
    console.error('Error:', error)
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.toString() || error.message
      : 'An unknown error occurred'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

