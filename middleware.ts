import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const REALM = "Preview"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow Stripe to post without auth
  if (pathname.startsWith("/api/stripe/webhook")) return NextResponse.next()

  // (Optional) let static assets through to avoid extra prompts
  if (pathname.startsWith("/_next/") || pathname === "/favicon.ico" || pathname === "/robots.txt") {
    return NextResponse.next()
  }

  const user = process.env.PREVIEW_USER
  const pass = process.env.PREVIEW_PASS

  // If not configured, fail loudly so you know what's wrong
  if (!user || !pass) {
    return new NextResponse("Preview auth not configured", { status: 500 })
  }

  const auth = req.headers.get("authorization") ?? ""
  // Edge runtime supports btoa
  const expected = "Basic " + btoa(`${user}:${pass}`)

  if (auth !== expected) {
    return new NextResponse("Auth required", {
      status: 401,
      headers: { "WWW-Authenticate": `Basic realm="${REALM}"` },
    })
  }

  return NextResponse.next()
}

// Protect everything by default; we skip specific paths above.
export const config = { matcher: ["/(.*)"] }
