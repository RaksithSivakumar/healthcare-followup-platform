import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protected routes require an active session cookie
const protectedPaths = [
  '/dashboard',
  '/doctor',
  '/doctor/',
  '/progress',
  '/reports',
  '/settings',
  '/symptom-check',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionToken = request.cookies.get('sessionToken')?.value

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup')
  const isProtected = protectedPaths.some((p) => pathname === p || pathname.startsWith(p + '/'))

  // If user is not authenticated and tries to access protected pages, redirect to login
  if (!sessionToken && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // If user is authenticated and visits login/signup, send them to dashboard
  if (sessionToken && isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/login',
    '/signup',
    '/dashboard/:path*',
    '/doctor/:path*',
    '/progress/:path*',
    '/reports/:path*',
    '/settings/:path*',
    '/symptom-check/:path*',
  ],
}


