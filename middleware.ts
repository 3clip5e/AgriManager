     // middleware.ts (version simple : Rôle via token, pas query)
     import { withAuth } from "next-auth/middleware";
     import { NextResponse } from "next/server";

     export default withAuth(
       function middleware(req) {
         const token = req.nextauth.token;
         const role = token?.role as string;
         const pathname = req.nextUrl.pathname;

         console.log("🔍 Middleware:", pathname, "Rôle=", role || "aucun");  // Debug

         // Post-login redirect : Si /dashboard et buyer → marketplace
         if (pathname === "/dashboard" && role === "buyer") {
           return NextResponse.redirect(new URL("/marketplace", req.url));
         }
         // Si /marketplace et farmer → dashboard (optionnel)
         if (pathname === "/marketplace" && role === "farmer") {
           return NextResponse.redirect(new URL("/dashboard", req.url));
         }

         // Protection
         if (pathname.startsWith("/dashboard") && role !== "farmer") {
           return NextResponse.redirect(new URL("/marketplace", req.url));
         }
         if (pathname.startsWith("/marketplace") && !token) {
           return NextResponse.redirect(new URL("/auth/login", req.url));
         }

         return NextResponse.next();
       },
       {
         callbacks: {
           authorized: ({ token }) => !!token,
         },
       }
     );

     export const config = {
       matcher: ["/dashboard/:path*", "/marketplace/:path*"],
     };
     