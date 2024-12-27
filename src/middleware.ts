// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import PocketBase from 'pocketbase';

export async function middleware(request: NextRequest) {
  console.log('⭐ Middleware running for:', request.nextUrl.pathname);

  const publicPaths = ['/logout', '/login', '/register', '/', '/api/auth'];
  if (publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // Check cookie
  const authCookie = request.cookies.get('pb_auth');
  
  // If we have a cookie, proceed
  if (authCookie?.value) {
    return NextResponse.next();
  }

  // If no cookie, redirect to login
  console.log('⛔ No valid auth, redirecting to login');
  const response = NextResponse.redirect(new URL('/login', request.url));
  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/api/:path*']
};;
