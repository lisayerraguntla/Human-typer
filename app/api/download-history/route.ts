import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    // Verify user authentication
    const supabase = await createClient()
    const { data: user, error: userError } = await supabase.auth.getUser()

    if (userError || !user.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get download history for the user
    const { data: downloads, error } = await supabase
      .from("downloads")
      .select("*")
      .eq("user_id", user.user.id)
      .order("downloaded_at", { ascending: false })
      .limit(50)

    if (error) {
      console.error("Error fetching download history:", error)
      return NextResponse.json({ error: "Failed to fetch download history" }, { status: 500 })
    }

    return NextResponse.json({ downloads })
  } catch (error) {
    console.error("Download history error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
