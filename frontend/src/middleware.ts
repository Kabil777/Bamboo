import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = true
  const { pathname } = request.nextUrl

  if (pathname === '/login' || pathname === '/register') {
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
     '/((?!_next|login|register).*)',
  ],
}
