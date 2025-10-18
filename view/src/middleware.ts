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
    console.log('Redirecionando para organizadorHome, já autenticado');
    return NextResponse.redirect(url);
  }

  if (protectedPaths.some((path) => url.pathname.startsWith(path)) && !token) {
    url.pathname = '/login';
    console.log('Redirecionando para login, token ausente');
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/organizadorHome/:path*'],
};
