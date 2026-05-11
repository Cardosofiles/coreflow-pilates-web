import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ROLE_REDIRECT: Record<string, string> = {
  ADMIN: '/admin/dashboard',
  ALUNO: '/aluno/dashboard',
  INSTRUTOR: '/instrutor/dashboard',
}

const ROLE_GUARDED_PREFIXES: Record<string, string> = {
  '/admin': 'ADMIN',
  '/aluno': 'ALUNO',
  '/instrutor': 'INSTRUTOR',
  '/aparelhos': 'ADMIN',
  '/alertas': 'ADMIN',
  '/planos': 'ADMIN',
  '/usuarios': 'ADMIN',
   '/agenda': 'ADMIN',   // ← adiciona essa linha
}

const PUBLIC_PATHS = ['/sign-in', '/sign-up']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('access_token')?.value
  const papel = request.cookies.get('usuario_papel')?.value

  const isPublic = PUBLIC_PATHS.some(p => pathname.startsWith(p))

  if (isPublic) {
    if (token && papel) {
      return NextResponse.redirect(new URL(ROLE_REDIRECT[papel] ?? '/dashboard', request.url))
    }
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  for (const [prefix, requiredRole] of Object.entries(ROLE_GUARDED_PREFIXES)) {
    if (pathname.startsWith(prefix)) {
      if (papel !== requiredRole) {
        return NextResponse.redirect(new URL(ROLE_REDIRECT[papel ?? ''] ?? '/sign-in', request.url))
      }
      break
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/aluno/:path*',
    '/instrutor/:path*',
    '/aparelhos/:path*',
    '/alertas/:path*',
    '/usuarios/:path*',
    '/matricula/:path*',
    '/planos/:path*',

    '/agenda/:path*',
    '/sign-in',
    '/sign-up',
  ],
}
