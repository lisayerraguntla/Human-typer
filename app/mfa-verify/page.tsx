"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Shield, Smartphone } from "lucide-react"

export default function MFAVerifyPage() {
  const [verificationCode, setVerificationCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [challengeId, setChallengeId] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    initiateMFAChallenge()
  }, [])

  const initiateMFAChallenge = async () => {
    const supabase = createClient()

    try {
      const { data: factors } = await supabase.auth.mfa.listFactors()
      const totpFactor = factors?.totp?.[0]

      if (!totpFactor) {
        router.push("/mfa-setup")
        return
      }

      const { data, error } = await supabase.auth.mfa.challenge({
        factorId: totpFactor.id,
      })

      if (error) throw error

      if (data) {
        setChallengeId(data.id)
      }
    } catch (error) {
      console.error("Error initiating MFA challenge:", error)
      setError("Failed to initiate MFA challenge")
    }
  }

  const verifyMFA = async () => {
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.mfa.verify({
        factorId: challengeId,
        challengeId,
        code: verificationCode,
      })

      if (error) throw error

      if (data) {
        // Successfully verified, redirect to intended destination
        router.push("/dashboard")
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Invalid verification code")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Badge variant="secondary">Security Verification Required</Badge>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">HT</span>
              </div>
              <span className="text-xl font-bold text-foreground">Human Typer</span>
            </div>
          </div>
        </div>
      </header>

      {/* MFA Verification */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Two-Factor Authentication</CardTitle>
              <CardDescription>Enter the verification code from your authenticator app to continue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Open your authenticator app</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  className="text-center font-mono text-lg"
                  autoComplete="one-time-code"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button onClick={verifyMFA} disabled={isLoading || verificationCode.length !== 6} className="w-full">
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>

              <div className="text-center text-xs text-muted-foreground">
                <p>Can't access your authenticator app?</p>
                <Button variant="link" className="text-xs p-0 h-auto" onClick={() => router.push("/auth/login")}>
                  Sign out and try again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
