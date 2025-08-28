import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { code, userId } = await request.json()

    if (!code || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify user authentication
    const supabase = await createClient()
    const { data: user, error: userError } = await supabase.auth.getUser()

    if (userError || !user.user || user.user.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In a real implementation, you would:
    // 1. Retrieve the user's TOTP secret from the database
    // 2. Use a proper TOTP library (like speakeasy) to verify the code
    // 3. Check if the code hasn't been used before (replay protection)

    // For demo purposes, we'll simulate verification
    const isValid = code.length === 6 && /^\d{6}$/.test(code)

    if (isValid) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 })
    }
  } catch (error) {
    console.error("2FA verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
