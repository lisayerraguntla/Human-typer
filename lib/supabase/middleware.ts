import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  })

  console.log("[v0] Middleware processing:", request.nextUrl.pathname)

  // Mock authentication check - in production this would check real auth
  const protectedRoutes = ["/dashboard", "/download", "/billing"]
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  // For now, allow access to all routes to test the UI
  // In production, implement proper authentication checks
  if (isProtectedRoute && false) {
    // Disabled for testing
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
