import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = ['/profile', '/analytics', '/practice', '/revision'];

// Define public routes that should redirect to home if already authenticated
const authRoutes = ['/login', '/signup', '/forgot-password'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if user has auth cookie
  const authToken = request.cookies.get('auth_token');
  const isAuthenticated = !!authToken;

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // Check if the current route is an auth route
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // If trying to access protected route without authentication
  if (isProtectedRoute && !isAuthenticated) {
    // Allow access but the page will handle showing login prompt
    // We don't redirect to maintain better UX
    return NextResponse.next();
  }

  // If trying to access auth routes while already authenticated
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
