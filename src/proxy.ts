import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Hive Auth Proxy (Next.js 16 — renamed from middleware)
 *
 * Responsibilities:
 * 1. Refresh the Supabase session on every request so RSCs always have
 *    a valid, non-expired session available via cookies.
 * 2. RBAC route protection:
 *    - /member   → requires any authenticated user
 *    - /organizer → requires role ORGANIZER or ADMIN (checked via user metadata)
 *    - /admin    → requires role ADMIN
 *    - /login, /register → redirect authenticated users away to /member
 */
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // ⚠️ IMPORTANT: Do NOT remove this call.
  // It refreshes the session so Server Components see a valid user.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // ─── Authenticated users: redirect away from auth pages ──────────────────
  const authPaths = ["/login", "/register"];
  if (user && authPaths.some((p) => pathname.startsWith(p))) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/member";
    return NextResponse.redirect(redirectUrl);
  }

  // ─── Unauthenticated users: protect dashboard routes ─────────────────────
  const protectedPaths = ["/member", "/organizer", "/admin"];
  if (!user && protectedPaths.some((p) => pathname.startsWith(p))) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ─── RBAC: organizer/admin role enforcement ───────────────────────────────
  if (user) {
    const userRole =
      (user.user_metadata?.role as string | undefined) ?? "MEMBER";

    if (pathname.startsWith("/admin") && userRole !== "ADMIN") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/member";
      return NextResponse.redirect(redirectUrl);
    }

    if (
      pathname.startsWith("/organizer") &&
      userRole !== "ORGANIZER" &&
      userRole !== "ADMIN"
    ) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/member";
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
