import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    // Refresh session if expired - required for Server Components
    const { data: { session } } = await supabase.auth.getSession()

    // If user is not signed in and trying to access protected routes, redirect to login
    if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/auth', req.url))
    }

    // If user is signed in and trying to access auth pages, redirect to dashboard
    if (session && (req.nextUrl.pathname === '/auth' || req.nextUrl.pathname === '/')) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return res
  } catch (e) {
    console.error('Middleware error:', e)
    // In case of an error, allow the request to continue
    return res
  }
}

// Simplify the matcher to cover all routes
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

