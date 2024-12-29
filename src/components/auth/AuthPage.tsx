'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import AuthForm from './AuthForm'
import Link from 'next/link'
import Image from 'next/image'

function AuthContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [view, setView] = useState('sign-in')
  const [mounted, setMounted] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    setMounted(true)
    const viewParam = searchParams.get('view')
    if (viewParam) {
      setView(viewParam)
    }

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/dashboard')
      }
    }

    checkUser()
  }, [router, searchParams, supabase.auth])

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#000000]">


      {/* Main Content */}
      <div className="flex min-h-screen flex-col items-center justify-center">
        <AuthForm view={view} />
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <AuthContent />
    </Suspense>
  )
} 