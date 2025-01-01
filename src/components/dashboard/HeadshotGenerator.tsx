'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ImageIcon, RefreshCw, Download } from 'lucide-react'
import Image from 'next/image'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface ImageData {
  url: string
  file: File | null
}

export default function AIHeadshotGenerator() {
  const [mainFaceImage, setMainFaceImage] = useState<ImageData | null>(null)
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [seed, setSeed] = useState<number | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const [showAlert, setShowAlert] = useState(false)
  const [remainingGenerations, setRemainingGenerations] = useState<number | null>(null)

  useEffect(() => {
    if (alertMessage) {
      setShowAlert(true)
      const timer = setTimeout(() => {
        setShowAlert(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [alertMessage])

  const handleImageChange = async (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        setMainFaceImage({ url: e.target.result as string, file })
      }
    }
    reader.readAsDataURL(file)
  }

  const handleUrlChange = (url: string) => {
    setMainFaceImage({ url, file: null })
  }

  const handleGenerate = async () => {
    if (!mainFaceImage || !prompt) return
    setIsProcessing(true)
    try {
      const response = await fetch('/api/ai/generate-headshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mainFaceImage: mainFaceImage.url,
          prompt,
          negativePrompt,
          seed,
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        if (data.isRateLimitExceeded) {
          setAlertMessage(data.error)
        } else {
          throw new Error(data.error || 'Headshot generation failed')
        }
      } else {
        setGeneratedImage(data.result)
        setRemainingGenerations(data.remainingGenerations)
      }
    } catch (error) {
      console.error('Error during headshot generation:', error)
      setAlertMessage(error instanceof Error ? error.message : 'Headshot generation failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const resetTool = () => {
    setMainFaceImage(null)
    setPrompt('')
    setNegativePrompt('')
    setSeed(null)
    setGeneratedImage(null)
    setAlertMessage(null)
    setShowAlert(false)
  }

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a')
      link.href = generatedImage
      link.download = 'generated-headshot.webp'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const ImageUploader = ({ image, onImageChange }: { image: ImageData | null, onImageChange: (file: File) => void }) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
      if (acceptedFiles[0]) {
        onImageChange(acceptedFiles[0])
      }
    }, [onImageChange])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: {
        'image/*': ['.jpeg', '.jpg', '.png', '.webp']
      },
      multiple: false
    })

    return (
      <div
        {...getRootProps()}
        className={`relative h-[200px] bg-[#111111] rounded-lg overflow-hidden ${
          isDragActive ? 'border-2 border-dashed border-[#FFBE1A]' : ''
        }`}
      >
        <input {...getInputProps()} />
        {image ? (
          <div className="relative w-full h-full">
            <Image
              src={image.url}
              alt="Main face image"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
            <ImageIcon className="w-12 h-12 text-white/60 mb-2" />
            <span className="text-sm text-white/60">
              {isDragActive ? 'Drop the image here' : 'Click or drag main face image here'}
            </span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 text-white">
      <div className="relative min-h-[600px] rounded-lg flex items-center justify-center overflow-hidden bg-[#111111]">
        {generatedImage ? (
          <div className="relative w-full h-full">
            <Image
              src={generatedImage}
              alt="Generated Headshot"
              fill
              style={{ objectFit: 'contain' }}
              className="rounded-lg"
            />
            <Button
              variant="secondary"
              className="absolute top-2 right-2 bg-[#FFBE1A] text-black hover:bg-[#FFBE1A]/90"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        ) : (
          <Image
            src="/ai-face-swap.png"
            alt="Placeholder Image"
            width={800}
            height={600}
            className="rounded-lg"
          />
        )}
      </div>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">AI Headshot Generator</h2>
        <ImageUploader
          image={mainFaceImage}
          onImageChange={handleImageChange}
        />
        <Input
          type="text"
          placeholder="Or enter an image URL"
          value={mainFaceImage?.file ? '' : mainFaceImage?.url || ''}
          onChange={(e) => handleUrlChange(e.target.value)}
          className="bg-white/5 border-white/10 text-white placeholder-white/40"
        />
        <Textarea
          placeholder="Enter your prompt here (e.g., 'portrait of a woman, neon color, cinematic')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          className="bg-white/5 border-white/10 text-white placeholder-white/40"
        />
        <Textarea
          placeholder="Enter negative prompt (optional)"
          value={negativePrompt}
          onChange={(e) => setNegativePrompt(e.target.value)}
          rows={2}
          className="bg-white/5 border-white/10 text-white placeholder-white/40"
        />
        <Input
          type="number"
          placeholder="Enter seed (optional)"
          value={seed !== null ? seed : ''}
          onChange={(e) => setSeed(e.target.value ? parseInt(e.target.value) : null)}
          className="bg-white/5 border-white/10 text-white placeholder-white/40"
        />
        <div className="space-y-6">
          {showAlert && alertMessage && (
            <Alert variant="destructive" className="mb-4 transition-opacity duration-500 ease-in-out bg-red-500/10 text-red-500">
              <AlertDescription>{alertMessage}</AlertDescription>
            </Alert>
          )}
          <div className="flex gap-4">
            <Button
              className="flex-1 bg-[#FFBE1A] text-black hover:bg-[#FFBE1A]/90"
              disabled={!mainFaceImage || !prompt || isProcessing}
              onClick={handleGenerate}
            >
              {isProcessing ? "Generating..." : "Generate Headshot"}
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-white/10 text-black"
              onClick={resetTool}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
          {remainingGenerations !== null && (
            <div className="space-y-2">
              <p className="text-sm text-white/60">Remaining generations today:</p>
              <Progress value={(remainingGenerations / 3) * 100} className="w-full" />
              <p className="text-xs text-right text-white/60">{remainingGenerations}/3</p>
            </div>
          )}
          <p className="text-xs text-center text-white/60">
            By uploading images and using this tool, you agree to our{' '}
            <a href="#" className="underline">Terms of Use</a> and{' '}
            <a href="#" className="underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  )
}

