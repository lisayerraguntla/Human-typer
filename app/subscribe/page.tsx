"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, CreditCard, ArrowLeft, Shield, Download, Zap } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SubscribePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [supabaseError, setSupabaseError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client")
        const supabase = createClient()

        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/auth/login")
          return
        }
        setUser(user)
      } catch (err) {
        console.error("[v0] Supabase client error:", err)
        setSupabaseError("Authentication service unavailable. Please try again later.")
      }
    }
    getUser()
  }, [router])

  const handleSubscribe = async () => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session")
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (supabaseError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>{supabaseError}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
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

      {/* Subscribe Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              Professional Subscription
            </Badge>
            <h1 className="text-4xl font-bold mb-4">Unlock Human Typer Extension</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get instant access to the professional auto-typing extension with human-like cadence and accessibility
              features.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Features */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4">What's Included</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Human-Like Typing</h3>
                    <p className="text-sm text-muted-foreground">
                      Adjustable speed up to 100 WPM with natural pauses and realistic jitter
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Universal Compatibility</h3>
                    <p className="text-sm text-muted-foreground">
                      Works with Google Docs, Word Online, and any web textarea
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Accessibility First</h3>
                    <p className="text-sm text-muted-foreground">
                      Designed specifically for users who cannot easily type documents
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Simple Controls</h3>
                    <p className="text-sm text-muted-foreground">
                      Start, Pause, Resume, and Stop functionality with progress tracking
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Enterprise Security</h3>
                    <p className="text-sm text-muted-foreground">
                      Local processing, no data collection, and two-factor authentication
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="lg:sticky lg:top-8">
              <Card className="border-primary shadow-lg">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Professional Plan</CardTitle>
                  <div className="text-4xl font-bold">
                    $5<span className="text-lg font-normal text-muted-foreground">/month</span>
                  </div>
                  <CardDescription>Everything you need for professional document creation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-primary" />
                      <span className="text-sm">Instant extension download</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      <span className="text-sm">Unlimited typing sessions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <span className="text-sm">Priority support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Regular updates</span>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button className="w-full" size="lg" onClick={handleSubscribe} disabled={isLoading}>
                    {isLoading ? "Processing..." : "Subscribe Now"}
                  </Button>

                  <div className="text-center space-y-2">
                    <p className="text-xs text-muted-foreground">Secure payment powered by Stripe</p>
                    <p className="text-xs text-muted-foreground">Cancel anytime • No setup fees • Instant access</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
