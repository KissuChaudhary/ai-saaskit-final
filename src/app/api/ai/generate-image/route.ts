import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { prompt, negative_prompt, width, height, seed } = await req.json()

    if (!prompt) {
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

    const prediction = await replicate.predictions.create({
      version: "88312dcb9eaa543d7f8721e092053e8bb901a45a5d3c63c84e0a5aa7c247df33",
      input: {
        prompt,
        negative_prompt: negative_prompt || "",
        width,
        height,
        num_inference_steps: 18,
        guidance_scale: 5,
        pag_guidance_scale: 2,
        seed,
      }
    })

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
      predictionId: prediction.id,
      remainingCredits: credits.credits - 1
    })
  } catch (error) {
    console.error('Error generating image:', error)
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const predictionId = searchParams.get('id')

  if (!predictionId) {
    return NextResponse.json({ error: 'No prediction ID provided' }, { status: 400 })
  }

  try {
    const prediction = await replicate.predictions.get(predictionId)
    
    if (prediction.status === 'succeeded') {
      const imageUrl = prediction.output[0]
      const response = await fetch(imageUrl)
      
      if (!response.ok) {
        throw new Error('Failed to fetch the image')
      }

      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Generate a filename based on the current timestamp
      const filename = `generated-image-${Date.now()}.png`

      // Set headers for file download
      const headers = new Headers()
      headers.set('Content-Disposition', `attachment; filename="${filename}"`)
      headers.set('Content-Type', 'image/png')

      return new NextResponse(buffer, {
        status: 200,
        headers,
      })
    } else if (prediction.status === 'failed') {
      return NextResponse.json({ error: 'Image generation failed' }, { status: 500 })
    } else {
      return NextResponse.json({ status: prediction.status })
    }
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to get prediction status or download image' }, { status: 500 })
  }
}

