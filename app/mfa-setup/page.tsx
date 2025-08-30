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
import { Shield, Smartphone, Copy, Check } from "lucide-react"

export default function MFASetupPage() {
  const [qrCode, setQrCode] = useState<string>("")
  const [secret, setSecret] = useState<string>("")
  const [verificationCode, setVerificationCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [copied, setCopied] = useState(false)
  const [factorId, setFactorId] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    checkMFAStatus()
  }, [])

  const checkMFAStatus = async () => {
    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      // Check if user already has MFA enabled
      const { data: factors } = await supabase.auth.mfa.listFactors()
      if (factors?.totp && factors.totp.length > 0) {
        // User already has MFA set up, redirect to dashboard
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Error checking MFA status:", error)
    }
  }

  const enrollMFA = async () => {
    const supabase = createClient()
    setIsEnrolling(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "Human Typer TOTP",
      })

      if (error) throw error

      if (data) {
        setQrCode(data.totp.qr_code)
        setSecret(data.totp.secret)
        setFactorId(data.id)
        setSuccess("Scan the QR code with your authenticator app, then enter the verification code below.")
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to enroll MFA")
    } finally {
      setIsEnrolling(false)
    }
  }

  const verifyMFA = async () => {
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code: verificationCode,
      })

      if (error) throw error

      if (data) {
        setSuccess("MFA setup completed successfully! Redirecting to dashboard...")
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Invalid verification code")
    } finally {
      setIsLoading(false)
    }
  }

  const copySecret = async () => {
    await navigator.clipboard.writeText(secret)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Badge variant="secondary">Security Setup Required</Badge>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">HT</span>
              </div>
              <span className="text-xl font-bold text-foreground">Human Typer</span>
            </div>
          </div>
        </div>
      </header>

      {/* MFA Setup */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Enable Two-Factor Authentication</CardTitle>
              <CardDescription>
                Secure your Human Typer account with TOTP authentication. This is required for accessing premium
                features.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!qrCode ? (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Two-factor authentication adds an extra layer of security to your account. You'll need an
                    authenticator app like Google Authenticator, Authy, or 1Password.
                  </p>
                  <Button onClick={enrollMFA} disabled={isEnrolling} className="w-full">
                    {isEnrolling ? "Setting up..." : "Set Up Two-Factor Authentication"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="font-semibold mb-2">Step 1: Scan QR Code</h3>
                    <div className="bg-white p-4 rounded-lg inline-block">
                      <img src={qrCode || "/placeholder.svg"} alt="TOTP QR Code" className="w-48 h-48" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Or enter this secret manually:</Label>
                    <div className="flex items-center space-x-2">
                      <Input value={secret} readOnly className="font-mono text-sm" />
                      <Button variant="outline" size="sm" onClick={copySecret} className="shrink-0 bg-transparent">
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="code">Step 2: Enter Verification Code</Label>
                    <Input
                      id="code"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      maxLength={6}
                      className="text-center font-mono text-lg"
                    />
                  </div>

                  <Button onClick={verifyMFA} disabled={isLoading || verificationCode.length !== 6} className="w-full">
                    {isLoading ? "Verifying..." : "Verify and Complete Setup"}
                  </Button>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="text-xs text-muted-foreground text-center">
                <p>Recommended authenticator apps:</p>
                <div className="flex items-center justify-center space-x-4 mt-2">
                  <span className="flex items-center space-x-1">
                    <Smartphone className="h-3 w-3" />
                    <span>Google Authenticator</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Smartphone className="h-3 w-3" />
                    <span>Authy</span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
