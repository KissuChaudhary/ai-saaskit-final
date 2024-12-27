'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { CreditCardIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

interface HeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

export default function Header({ isMobileMenuOpen, setIsMobileMenuOpen }: HeaderProps) {
  const [credits, setCredits] = useState<number>(0)
  const [animatedCredits, setAnimatedCredits] = useState<number>(0)
  const supabase = createClientComponentClient()

  const fetchCredits = useCallback(async (): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: creditsData, error: creditsError } = await supabase
        .from('user_credits')
        .select('credits')
        .eq('user_id', user.id)
        .single()

      if (creditsError) {
        if (creditsError.code === 'PGRST116' && user.email_confirmed_at) {
          const { data: existingCredits } = await supabase
            .from('user_credits')
            .select('credits')
            .eq('user_id', user.id)
            .single()

          if (!existingCredits) {
            const { data: newCredits, error: insertError } = await supabase
              .from('user_credits')
              .insert([{
                user_id: user.id,
                credits: 500,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }])
              .select('credits')
              .single()

            if (insertError) {
              console.error('Error creating credits record:', insertError.message)
              return
            }

            setCredits(newCredits?.credits || 0)
            return
          } else {
            setCredits(existingCredits.credits)
            return
          }
        }
        console.error('Error fetching credits:', creditsError.message)
        return
      }

      setCredits(creditsData?.credits || 0)
    } catch (error) {
      console.error('Error:', error)
    }
  }, [supabase])

  useEffect(() => {
    fetchCredits()
  }, [fetchCredits])

  useEffect(() => {
    const animateCredits = () => {
      const start = animatedCredits
      const end = credits
      const duration = 1000
      const startTime = performance.now()

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const currentCredits = Math.floor(start + (end - start) * progress)
        setAnimatedCredits(currentCredits)

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
    }

    animateCredits()
  }, [credits])

  return (
    <header className="sticky top-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/5">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white/60 hover:text-white"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
          <h1 className="text-white font-bold text-xl">Dashboard</h1>
        </div>

        <div className="flex items-center text-sm">
          <CreditCardIcon className="h-5 w-5 text-[#FFBE1A] mr-2" />
          <span className="text-white/80">{animatedCredits} Credits</span>
        </div>
      </div>
    </header>
  )
}

