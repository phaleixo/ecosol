import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteção da rota Admin
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('admin_token')?.value;

    if (!token || token !== process.env.ADMIN_SECRET) {
      // Redirecionamento dinâmico baseado em cookie
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

// O matcher deve ser um array e bem específico para silenciar avisos
export const config = {
  matcher: ['/admin/:path*'],
};