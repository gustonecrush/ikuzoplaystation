import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('token')

  if (!token) {
    const protectedPaths = [
      '/admin/dashboard/contents',
      '/admin/dashboard/dates',
      '/admin/dashboard/reservations',
      '/admin/dashboard/times',
    ]

    if (protectedPaths.includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
}
