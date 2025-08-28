"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function BillingPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [subscription, setSubscription] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }
      setUser(user)

      // Get subscription
      const { data: sub } = await supabase.from("subscriptions").select("*").eq("user_id", user.id).single()

      setSubscription(sub)
    }
    getUser()
  }, [router, supabase])

  const handleManageBilling = async () => {
    if (!subscription?.stripe_customer_id) {
      setError("No billing information found")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: subscription.stripe_customer_id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create portal session")
      }

      // Redirect to Stripe Customer Portal
      window.location.href = data.url
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm text-muted-foreground">Back to Dashboard</span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">HT</span>
              </div>
              <span className="text-xl font-bold text-foreground">Human Typer</span>
            </div>
          </div>
        </div>
      </header>

      {/* Billing Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
            <p className="text-muted-foreground">Manage your Human Typer subscription and billing information</p>
          </div>

          <div className="space-y-6">
            {/* Current Subscription */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CreditCard className="h-8 w-8 text-primary" />
                  <Badge variant={subscription?.status === "active" ? "default" : "secondary"}>
                    {subscription?.status || "No Subscription"}
                  </Badge>
                </div>
                <CardTitle>Current Subscription</CardTitle>
                <CardDescription>Your Human Typer Professional subscription details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {subscription ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Plan:</span>
                      <span className="text-sm font-medium">Professional ($5/month)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <span className="text-sm font-medium capitalize">{subscription.status}</span>
                    </div>
                    {subscription.current_period_end && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Next billing:</span>
                        <span className="text-sm font-medium">
                          {new Date(subscription.current_period_end).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-4">No active subscription found</p>
                    <Button asChild>
                      <Link href="/subscribe">Subscribe Now</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Manage Billing */}
            {subscription && (
              <Card>
                <CardHeader>
                  <CardTitle>Manage Billing</CardTitle>
                  <CardDescription>Update payment methods, view invoices, and manage your subscription</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button onClick={handleManageBilling} disabled={isLoading} className="w-full">
                    {isLoading ? "Loading..." : "Manage Billing"}
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    You'll be redirected to Stripe's secure customer portal to manage your subscription, update payment
                    methods, and view billing history.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
