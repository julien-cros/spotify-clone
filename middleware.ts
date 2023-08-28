import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server'
import { redirect } from 'next/navigation';

export async function middleware(req: NextRequest) {
	const token = await getToken({ req, secret: process.env.JWT_SECRET });

	const { pathname }  = req.nextUrl;
	const pathurl = req.nextUrl.clone();
	pathurl.pathname = '/login'
	
	if (pathname.includes('api/auth') || token){
		console.log('next');
		return NextResponse.next();
	}
	
	if (!token && pathname !== '/login') {
		console.log('redirecting to login');
		return NextResponse.redirect(pathurl);
	}
	return NextResponse.next();
}

export const config = {
	matcher: [
	  '/((?!api|_next/static|_next/image|favicon.ico).*)',
	],
  }