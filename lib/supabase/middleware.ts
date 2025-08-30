import { createClient } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const protectedRoutes = ["/dashboard", "/download", "/billing"]
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  if (
    request.nextUrl.pathname !== "/" &&
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/auth") &&
    !request.nextUrl.pathname.startsWith("/mfa-setup")
  ) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  if (user && isProtectedRoute) {
    try {
      const { data: session } = await supabase.auth.getSession()

      if (session?.session) {
        const aal = session.session.aal

        const { data: factors } = await supabase.auth.mfa.listFactors()
        const hasMFA = factors?.totp && factors.totp.length > 0

        if (!hasMFA) {
          const url = request.nextUrl.clone()
          url.pathname = "/mfa-setup"
          return NextResponse.redirect(url)
        }

        if (aal !== "aal2") {
          const url = request.nextUrl.clone()
          url.pathname = "/mfa-verify"
          return NextResponse.redirect(url)
        }
      }
    } catch (error) {
      console.error("[v0] MFA check error:", error)
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
