import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { subject, category, message, email, priority, userId } = await request.json()

    if (!subject || !category || !message || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // Create support ticket
    const { data: ticket, error } = await supabase
      .from("support_tickets")
      .insert({
        user_id: userId || null,
        subject: subject.trim(),
        category,
        message: message.trim(),
        email: email.trim(),
        priority: priority || "medium",
        status: "open",
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating support ticket:", error)
      return NextResponse.json({ error: "Failed to create support ticket" }, { status: 500 })
    }

    // Send notification email (in a real app, you'd use a service like SendGrid)
    console.log(`[v0] New support ticket created: ${ticket.id}`)
    console.log(`[v0] Subject: ${subject}`)
    console.log(`[v0] Category: ${category}`)
    console.log(`[v0] Priority: ${priority}`)
    console.log(`[v0] Email: ${email}`)

    return NextResponse.json({
      success: true,
      ticketId: ticket.id,
      message: "Support ticket created successfully",
    })
  } catch (error) {
    console.error("Support API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's support tickets
    const { data: tickets, error } = await supabase
      .from("support_tickets")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching support tickets:", error)
      return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 })
    }

    return NextResponse.json({ tickets })
  } catch (error) {
    console.error("Support API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
