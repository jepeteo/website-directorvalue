import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  
  // Get the token from the request
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  })

  // Debug logging
  console.log(`Middleware - Path: ${pathname}, Token: ${token ? 'EXISTS' : 'NULL'}`)
  if (token) {
    console.log(`Middleware - User: ${token.email}, Role: ${token.role}`)
  }

  // Allow access to public routes
  if (
    pathname === '/' ||
    pathname.startsWith('/search') ||
    pathname.startsWith('/c/') ||
    pathname.startsWith('/l/') ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/pricing') ||
    pathname.startsWith('/terms') ||
    pathname.startsWith('/privacy') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/auth/verify-request') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  // If user is trying to access auth pages and is already logged in
  if (pathname.startsWith('/auth/') && token) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // For auth pages, allow if not logged in
  if (pathname.startsWith('/auth/') && !token) {
    return NextResponse.next()
  }

  // Check if user has required role for protected routes
  if (pathname.startsWith('/admin') && token && 'role' in token && token.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // For dashboard routes, ensure user is logged in
  if (pathname.startsWith('/dashboard') && !token) {
    const url = new URL('/auth/signin', req.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
