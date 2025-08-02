import { NextRequest, NextResponse } from 'next/server'
import { jwtDecode } from 'jwt-decode'

const isValidToken = (token: string | undefined): boolean => {
  if (!token) {
    return false
  }

  try {
    const decoded: { exp: number } = jwtDecode(token)
    return decoded.exp > Date.now() / 1000
  } catch (error) {
    console.error('Erro ao decodificar o token JWT:', error)
    return false
  }
}

export async function middleware(
  req: NextRequest,
): Promise<NextResponse> {
  const token = req.cookies.get('token')?.value

  if (!isValidToken(token)) {
    return NextResponse.redirect(new URL('/login', req.url))
  }


  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/area_logada/:path*'],
}