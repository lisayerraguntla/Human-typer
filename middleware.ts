import { updateSession } from "@/lib/supabase/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const REALM = "Preview"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const headers = req.headers
  const hasStripeSig = headers.has("stripe-signature")

  // 1) Always allow Stripe webhook calls (by path OR header)
  if (
    hasStripeSig ||
    pathname === "/api/stripe/webhook" ||
    pathname.startsWith("/api/stripe/webhook?") // safety if query params ever appear
  ) {
    return NextResponse.next()
  }

  // 2) Let static/assets through (optional)
  if (pathname.startsWith("/_next/") || pathname === "/favicon.ico" || pathname === "/robots.txt") {
    return NextResponse.next()
  }

  const supabaseResponse = await updateSession(req)

  // If Supabase middleware returned a redirect, use that
  if (supabaseResponse.status === 307 || supabaseResponse.status === 302) {
    return supabaseResponse
  }

  const user = process.env.PREVIEW_USER
  const pass = process.env.PREVIEW_PASS
  const isPreviewMode = process.env.VERCEL_ENV === "preview" || process.env.NODE_ENV === "development"

  // Only require auth if both credentials are set AND we're in preview mode
  if (user && pass && isPreviewMode) {
    const auth = headers.get("authorization") ?? ""
    const expected = "Basic " + btoa(`${user}:${pass}`)

    if (auth !== expected) {
      return new NextResponse("Auth required", {
        status: 401,
        headers: { "WWW-Authenticate": `Basic realm="${REALM}"` },
      })
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
