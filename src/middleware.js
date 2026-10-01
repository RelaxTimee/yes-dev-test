import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl.clone();
  
  // ป้องกันการเข้าหน้า /admin/products ถ้ายังไม่ได้ Login
  if (url.pathname.startsWith('/admin/products')) {
    const authCookie = req.cookies.get('adminAuth');
    if (!authCookie) {
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}
