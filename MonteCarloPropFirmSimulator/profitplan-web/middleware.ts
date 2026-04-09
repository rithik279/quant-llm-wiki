import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const protected_prefixes = ['/simulator', '/passplan', '/pass', '/execution'];
    const isProtected = protected_prefixes.some(p => request.nextUrl.pathname.startsWith(p));

    if (isProtected) {
        const auth = request.cookies.get('simulator_auth')?.value;
        if (!auth) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/simulator/:path*', '/passplan/:path*', '/pass/:path*', '/execution/:path*'],
};
