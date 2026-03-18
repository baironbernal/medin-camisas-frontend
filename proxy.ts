import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './app/lib/session';

const protectedRoutes = ['/perfil'];
const authRoutes = ['/login', '/signup'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const { isAuthenticated } = await getSession();
  
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  if (isAuthRoute && isAuthenticated) {
    const redirectUrl = pathname === '/login' || pathname === '/signup' 
      ? '/' 
      : pathname;
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
};
