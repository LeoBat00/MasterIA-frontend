import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const url = req.nextUrl.clone();

  // rotas protegidas
  const protectedPaths = ['/organizadorHome'];

  const publicPaths = ['/login', '/registro'];

  if (publicPaths.some((path) => url.pathname.startsWith(path)) && token) {
    url.pathname = '/organizadorHome';
    return NextResponse.redirect(url);
  }

  if (protectedPaths.some((path) => url.pathname.startsWith(path)) && !token) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/organizadorHome/:path*'],
};
