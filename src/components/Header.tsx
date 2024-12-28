import Link from 'next/link'
import { BookOpenIcon } from '@heroicons/react/24/outline'

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#0A0A0A]/80 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-white">
              Startup
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/features" className="text-sm text-white/70 hover:text-white">
              Features
            </Link>
            <Link href="/pricing" className="text-sm text-white/70 hover:text-white">
              Pricing
            </Link>
            <Link href="/docs" className="text-sm text-white/70 hover:text-white flex items-center space-x-1">
              <BookOpenIcon className="w-4 h-4" />
              <span>Docs</span>
            </Link>
            <Link href="/blog" className="text-sm text-white/70 hover:text-white">
              Blog
            </Link>
          </div>
          <div className="flex items-center space-x-4">
          
            <Link 
              href="/auth" 
              className="text-sm text-white/70 hover:text-white"
            >
              Sign in
            </Link>
            <Link
              href="/auth?view=sign-up"
              className="bg-[#FFBE1A] text-black text-sm px-4 py-2 rounded-lg hover:bg-[#FFBE1A]/90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
