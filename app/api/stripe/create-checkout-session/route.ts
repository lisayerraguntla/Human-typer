import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { getBaseUrl } from "@/lib/baseUrl"

export async function POST(request: NextRequest) {
  try {
    const { userId, email } = await request.json()

    if (!userId || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!process.env.STRIPE_PRICE_ID) {
      console.error("[v0] Missing STRIPE_PRICE_ID environment variable")
      return NextResponse.json({ error: "Stripe configuration error" }, { status: 500 })
    }

    // Verify user exists in our database
    const supabase = await createClient()
    const { data: user, error: userError } = await supabase.auth.getUser()

    if (userError || !user.user || user.user.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user already has an active subscription
    const { data: existingSubscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .single()

    if (existingSubscription) {
      return NextResponse.json({ error: "User already has an active subscription" }, { status: 400 })
    }

    const baseUrl = getBaseUrl()
    console.log("[v0] Using base URL for Stripe:", baseUrl)
    console.log("[v0] Using Stripe Price ID:", process.env.STRIPE_PRICE_ID)

    const successUrl = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${baseUrl}/cancel`

    console.log("[v0] Success URL:", successUrl)
    console.log("[v0] Cancel URL:", cancelUrl)

    // Validate URLs are properly formatted
    try {
      new URL(successUrl.replace("{CHECKOUT_SESSION_ID}", "test"))
      new URL(cancelUrl)
    } catch (urlError) {
      console.error("[v0] Invalid URL format:", urlError)
      return NextResponse.json({ error: "Invalid URL configuration" }, { status: 500 })
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: userId,
      },
      subscription_data: {
        metadata: {
          userId: userId,
        },
      },
    })

    console.log("[v0] Stripe session created successfully:", session.id)
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("[v0] Error creating checkout session:", error)
    if (error instanceof Error) {
      console.error("[v0] Error message:", error.message)
      console.error("[v0] Error stack:", error.stack)
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
