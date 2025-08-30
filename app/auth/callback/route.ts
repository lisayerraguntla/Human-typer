import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")
  const error_description = requestUrl.searchParams.get("error_description")

  if (error) {
    console.error("[v0] Auth callback error:", error, error_description)
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/login?error=${encodeURIComponent(error_description || error)}`,
    )
  }

  if (code) {
    const supabase = await createClient()

    try {
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        console.error("[v0] Error exchanging code for session:", exchangeError)
        return NextResponse.redirect(
          `${requestUrl.origin}/auth/login?error=${encodeURIComponent("Authentication failed")}`,
        )
      }

      if (data.session) {
        console.log("[v0] Successfully authenticated user:", data.user?.email)

        const { data: factors } = await supabase.auth.mfa.listFactors()
        const hasMFA = factors?.totp && factors.totp.length > 0

        if (!hasMFA) {
          // Redirect to MFA setup if not configured
          return NextResponse.redirect(`${requestUrl.origin}/mfa-setup`)
        } else {
          // Redirect to dashboard if MFA is already set up
          return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
        }
      }
    } catch (error) {
      console.error("[v0] Auth callback exception:", error)
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=${encodeURIComponent("Authentication error")}`,
      )
    }
  }

  // Fallback redirect
  return NextResponse.redirect(`${requestUrl.origin}/auth/login`)
}
