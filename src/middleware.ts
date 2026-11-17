import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Route public không yêu cầu authentication
const PUBLIC_ROUTES = ['/', '/login', '/register', '/contact', '/products', '/projects', '/posts'];

// Route chỉ dành cho admin
const ADMIN_ROUTES = ['/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cho phép truy cập các route API và static files
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.startsWith('/static')) {
    return NextResponse.next();
  }

  // Đọc cookie user-role (được đặt bởi AuthContext client-side)
  const userRole = request.cookies.get('user-role')?.value;

  // Bảo vệ route admin
  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!userRole) {
      // Chưa đăng nhập → redirect về login
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (userRole !== 'admin') {
      // Có đăng nhập nhưng không phải admin → redirect về trang chủ
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Các route public: cho phép truy cập
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Các route khác: cho phép truy cập (client-side AuthContext sẽ xử lý redirect nếu cần)
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};