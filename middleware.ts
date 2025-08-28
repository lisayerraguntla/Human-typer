import { NextResponse } from "next/server"
import type { NextRequest } from "next/request"

export function middleware(req: NextRequest) {
  const url = new URL(req.url)

  if (url.pathname.startsWith("/api/stripe/webhook")) {
    return NextResponse.next()
  }

  const auth = req.headers.get("authorization") || ""
  const user = process.env.PREVIEW_USER
  const pass = process.env.PREVIEW_PASS
  const expected = "Basic " + Buffer.from(`${user ?? ""}:${pass ?? ""}`).toString("base64")

  if (auth !== expected) {
    return new NextResponse("Auth required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Preview"' },
    })
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/(.*)"],
}
