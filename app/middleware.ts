import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE } from '@/app/shared/lib/auth';

export function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (!token && request.nextUrl.pathname.startsWith('/profile-fake')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile-fake/:path*'],
};
