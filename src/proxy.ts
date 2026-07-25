import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // --- 1. Unauthenticated Users ---
  const protectedPaths = ["/member", "/organizer", "/admin"];
  const isProtectedPath = protectedPaths.some((p) => pathname.startsWith(p));
  
  if (!user && isProtectedPath) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // --- 2. Authenticated Users Routing ---
  if (user) {
    const userRole = (user.user_metadata?.role as string | undefined) ?? "MEMBER";
    
    // Determine user's designated root dashboard
    let userDashboard = "/member";
    if (userRole === "ADMIN") userDashboard = "/admin";
    else if (userRole === "ORGANIZER") userDashboard = "/organizer";

    // Redirect away from auth pages and the root path "/"
    const authPaths = ["/login", "/register"];
    if (authPaths.some((p) => pathname.startsWith(p)) || pathname === "/") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = userDashboard;
      return NextResponse.redirect(redirectUrl);
    }

    // Strict role enforcement
    if (pathname.startsWith("/admin") && userRole !== "ADMIN") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = userDashboard;
      return NextResponse.redirect(redirectUrl);
    }

    if (pathname.startsWith("/organizer") && userRole !== "ORGANIZER") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = userDashboard;
      return NextResponse.redirect(redirectUrl);
    }

    if (pathname.startsWith("/member") && userRole !== "MEMBER") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = userDashboard;
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"
  ],
};
