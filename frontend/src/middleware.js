import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the path being requested
  const path = request.nextUrl.pathname;
  
  // Check if this is an admin route
  if (path.startsWith('/admin')) {
    // Get the auth session from cookies
    const userRoleCookie = request.cookies.get('user-role');

    // If no auth cookie or role isn't admin, redirect to login
    if (!userRoleCookie || userRoleCookie.value !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // Allow the request to continue
  return NextResponse.next();
}

// Add a matcher for the middleware to run on specific paths
export const config = {
  matcher: [
    // Apply to all admin routes
    '/admin/:path*',
  ],
}; 