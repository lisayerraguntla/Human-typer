import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { customerId } = await request.json()

    if (!customerId) {
      return NextResponse.json({ error: "Missing customer ID" }, { status: 400 })
    }

    // Verify user is authenticated
    const supabase = await createClient()
    const { data: user, error: userError } = await supabase.auth.getUser()

    if (userError || !user.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify the customer belongs to the authenticated user
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.user.id)
      .eq("stripe_customer_id", customerId)
      .single()

    if (!subscription) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    // Create Stripe customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/billing`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Error creating portal session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
