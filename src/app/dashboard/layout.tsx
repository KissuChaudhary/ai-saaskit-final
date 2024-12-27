'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import {
  HomeIcon,
  ChartBarIcon,
  UserCircleIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  PhotoIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline'
import Header from '@/components/dashboard/Header'
import { User } from '@supabase/supabase-js'

interface NavItem {
  name: string
  href: string
  icon: typeof HomeIcon
}

const navigation: NavItem[] = [
  { name: 'Overview', href: '/dashboard', icon: HomeIcon },
  { name: 'AI Headshot', href: '/dashboard/ai-headshot', icon: PhotoIcon },
  { name: 'Generate Images', href: '/dashboard/images', icon: PhotoIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClientComponentClient()

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }
      setUser(user)
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/auth')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Header 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className={`
          fixed md:static inset-y-16 left-0 z-40
          w-64 bg-[#111111] border-r border-white/5
          transform transition-transform duration-300 ease-in-out
          flex flex-col
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}>
          {/* Navigation */}
          <nav className="flex-1 mt-4 px-3 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-white/10 text-white' 
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Profile Section */}
          <div className="px-3 py-4 border-t border-white/5">
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-full flex items-center px-3 py-2 text-sm text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                <UserCircleIcon className="h-5 w-5 mr-3" />
                <span className="flex-1 text-left truncate">{user?.email}</span>
                <ChevronDownIcon 
                  className={`h-4 w-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isProfileOpen && (
                <div className="absolute bottom-full left-0 w-full mb-2 bg-[#111111] border border-white/5 rounded-lg shadow-lg py-1">
                  <button
                    onClick={() => router.push('/dashboard/profile')}
                    className="block w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white"
                  >
                    Profile Settings
                  </button>
                  <button
                    onClick={() => router.push('/dashboard/billing')}
                    className="block w-full text-left px-4 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white"
                  >
                    Billing & Credits
                  </button>
                  <div className="border-t border-white/5 my-1" />
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-white/5"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Backdrop */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

