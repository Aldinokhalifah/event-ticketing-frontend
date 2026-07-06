import { NextResponse, NextRequest } from 'next/server';

const adminRoutes = ['/admin'];
const publicRoutes = ['/Login', '/Register'];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('token')?.value;

    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    if (!token && !isPublicRoute) {
        return NextResponse.redirect(new URL('/Login', request.url));
    }

    if (token && isPublicRoute) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Untuk admin route — middleware tidak bisa decode JWT untuk cek role
    // (karena tidak ada library JWT di edge runtime)
    // Guard role dilakukan di AdminLayout (useEffect) seperti di atas

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};