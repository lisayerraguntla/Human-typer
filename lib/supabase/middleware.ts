import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  })

  console.log("[v0] Middleware processing:", request.nextUrl.pathname)

  const protectedRoutes = ["/dashboard", "/download", "/billing"]
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  if (isProtectedRoute) {
    const authToken = request.cookies.get("auth-token")
    console.log("[v0] All cookies:", request.cookies.getAll())
    console.log("[v0] Auth token cookie:", authToken)
    console.log("[v0] Auth token value:", authToken?.value)

    if (!authToken || authToken.value !== "authenticated") {
      console.log("[v0] Redirecting to login - no valid auth token")
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      return NextResponse.redirect(url)
    }

    console.log("[v0] User authenticated, allowing access to:", request.nextUrl.pathname)
  }

  return supabaseResponse
}
