'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { BookOpenIcon, ChevronDownIcon, LayoutIcon, ImageIcon, CodeIcon, Sparkles, Settings, FileText, PenToolIcon as Tool } from 'lucide-react'

export default function Header() {
  const [isToolsOpen, setIsToolsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsToolsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className="fixed top-0 w-full z-50 bg-[#0A0A0A]/80 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-white">
              Startup
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/features" className="flex items-center text-sm text-white/70 hover:text-white transition-colors">
              <Sparkles className="w-4 h-4 mr-1" />
              Features
            </Link>
            <Link href="/pricing" className="flex items-center text-sm text-white/70 hover:text-white transition-colors">
              <FileText className="w-4 h-4 mr-1" />
              Pricing
            </Link>
            <div 
              className="relative" 
              onMouseEnter={() => setIsToolsOpen(true)}
              onMouseLeave={() => setIsToolsOpen(false)}
              ref={dropdownRef}
            >
              <button
                className="flex items-center text-sm text-white/70 hover:text-white hover:bg-black/90 transition-colors focus:outline-none focus-visible:outline-none select-none"
              >
                <Tool className="w-4 h-4 mr-1" />
                Tools
                <ChevronDownIcon className="ml-1 h-4 w-4" />
              </button>
              {isToolsOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-[#1A1A1A] ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <Link href="/tools/ai-headshot" className="flex items-center px-4 py-2 text-sm text-white/70 hover:bg-[#2A2A2A] hover:text-white transition-colors">
                      <ImageIcon className="mr-3 h-5 w-5" />
                      AI Headshot
                    </Link>
                    <Link href="/tools/image-generator" className="flex items-center px-4 py-2 text-sm text-white/70 hover:bg-[#2A2A2A] hover:text-white transition-colors">
                      <LayoutIcon className="mr-3 h-5 w-5" />
                      Image Generator
                    </Link>
                    <Link href="/tools/code-generator" className="flex items-center px-4 py-2 text-sm text-white/70 hover:bg-[#2A2A2A] hover:text-white transition-colors">
                      <CodeIcon className="mr-3 h-5 w-5" />
                      Code Generator
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link href="/docs" className="flex items-center text-sm text-white/70 hover:text-white transition-colors">
              <BookOpenIcon className="w-4 h-4 mr-1" />
              <span>Docs</span>
            </Link>
           
          </nav>
          <div className="flex items-center space-x-4">
           
            <Link 
              href="/auth" 
              className="flex items-center text-sm text-white/70 hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4 mr-1" />
              Sign in
            </Link>
            <Link
              href="/auth?view=sign-up"
              className="bg-[#FFBE1A] text-black text-sm px-4 py-2 rounded-lg hover:bg-[#FFBE1A]/90 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

