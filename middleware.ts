import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const REALM = "Preview"

export function middleware(req: NextRequest) {
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

  // 3) Basic Auth for everything else
  const user = process.env.PREVIEW_USER
  const pass = process.env.PREVIEW_PASS

  if (!user || !pass) {
    return new NextResponse("Preview auth not configured", { status: 500 })
  }

  const auth = headers.get("authorization") ?? ""
  const expected = "Basic " + btoa(`${user}:${pass}`)

  if (auth !== expected) {
    return new NextResponse("Auth required", {
      status: 401,
      headers: { "WWW-Authenticate": `Basic realm="${REALM}"` },
    })
  }

  return NextResponse.next()
}

export const config = { matcher: ["/(.*)"] }
