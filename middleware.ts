import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default withAuth(
  function middleware(request: NextRequest & { nextauth?: { token: any } }) {
    const token = request.nextauth?.token
    const pathname = request.nextUrl.pathname

    // Redirect customers trying to access farmer-only pages
    if (token?.userType === 'customer') {
      const farmerOnlyRoutes = [
        '/dashboard/fields',
        '/dashboard/ai-advisor',
        '/dashboard/profile',
        '/dashboard/marketplace/add-product'
      ]

      if (farmerOnlyRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/marketplace', request.url))
      }

      // Redirect customer from main dashboard to marketplace
      if (pathname === '/dashboard') {
        return NextResponse.redirect(new URL('/marketplace', request.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        if (
          req.nextUrl.pathname === "/" ||
          req.nextUrl.pathname.startsWith("/marketplace") ||
          req.nextUrl.pathname.startsWith("/auth/") ||
          req.nextUrl.pathname.startsWith("/api/auth/")
        ) {
          return true
        }

        // Require authentication for dashboard routes
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          return !!token
        }

        return true
      },
    },
  },
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
