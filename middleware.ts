// middleware.ts (Version Étendue : + Rôle Admin pour /dashboard/admin/*)
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const role = token?.role as string;
    const pathname = req.nextUrl.pathname;

    console.log("🔍 Middleware:", pathname, "Rôle=", role || "aucun");  // Debug conservé

    // Post-login redirects (étendu pour admin)
    if (pathname === "/dashboard") {
      if (role === "buyer") {
        return NextResponse.redirect(new URL("/marketplace", req.url));
      }
      if (role === "farmer") {
        return NextResponse.next();  // Farmer reste sur /dashboard (marketplace add-product)
      }
      if (role === "admin") {
        return NextResponse.redirect(new URL("/dashboard/admin", req.url));  // ← NOUVEAU : Admin → dashboard admin
      }
    }

    // Marketplace : Ouvert à tous (auth ou non), mais redirect farmer vers dashboard
    if (pathname === "/marketplace" && role === "farmer") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    if (pathname.startsWith("/marketplace") && !token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));  // Protège sous-pages si besoin
    }

    // Protection Dashboard Générique (farmer only, sauf admin)
    if (pathname.startsWith("/dashboard") && !pathname.startsWith("/dashboard/admin")) {
      if (role !== "farmer" && role !== "admin") {  // ← FIX : Admin peut accéder dashboard farmer si besoin
        return NextResponse.redirect(new URL("/marketplace", req.url));
      }
    }

    // ← NOUVEAU : Protection Spécifique Admin (/dashboard/admin/*)
    if (pathname.startsWith("/dashboard/admin")) {
      if (role !== "admin") {
        console.log("🚫 Accès admin refusé pour rôle:", role);  // Debug
        return NextResponse.redirect(new URL("/unauthorized", req.url));  // Ou "/marketplace"
      }
      return NextResponse.next();  // Admin OK
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,  // Auth basique (token requis pour matcher)
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/marketplace/:path*"],  // Couvre /dashboard/admin/:path* automatiquement
};
