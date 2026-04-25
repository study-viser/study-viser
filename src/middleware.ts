export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/student-dashboard/:path*',
    '/instructor-dashboard/:path*',
    '/ta-dashboard/:path*',
  ],
};