"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Smartphone, Key, ArrowLeft, CheckCircle, AlertTriangle, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import QRCode from "qrcode"

export default function SecurityPage() {
  const [user, setUser] = useState<any>(null)
  const [mfaEnabled, setMfaEnabled] = useState(false)
  const [showSetup2FA, setShowSetup2FA] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [showBackupCodes, setShowBackupCodes] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPasswords, setShowPasswords] = useState(false)

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

      // Check if MFA is enabled (in a real app, you'd check this from your database)
      const mfaStatus = localStorage.getItem(`mfa_enabled_${user.id}`) === "true"
      setMfaEnabled(mfaStatus)
    }
    getUser()
  }, [router, supabase.auth])

  const handleSetup2FA = async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      // Generate a secret key for TOTP
      const secret = generateSecret()
      const issuer = "Human Typer"
      const accountName = user.email

      // Create TOTP URL for QR code
      const totpUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`

      // Generate QR code
      const qrCode = await QRCode.toDataURL(totpUrl)
      setQrCodeUrl(qrCode)

      // Generate backup codes
      const codes = generateBackupCodes()
      setBackupCodes(codes)

      // Store secret temporarily (in real app, store in secure database)
      sessionStorage.setItem("temp_2fa_secret", secret)

      setShowSetup2FA(true)
    } catch (error) {
      setError("Failed to setup 2FA. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit code")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // In a real app, you'd verify the TOTP code on the server
      const secret = sessionStorage.getItem("temp_2fa_secret")
      if (!secret) {
        throw new Error("Setup session expired")
      }

      // Simulate verification (in real app, use a proper TOTP library)
      const isValid = verificationCode === "123456" || verificationCode.length === 6

      if (isValid) {
        // Enable 2FA (in real app, save to database)
        localStorage.setItem(`mfa_enabled_${user.id}`, "true")
        localStorage.setItem(`mfa_secret_${user.id}`, secret)
        localStorage.setItem(`backup_codes_${user.id}`, JSON.stringify(backupCodes))

        setMfaEnabled(true)
        setShowSetup2FA(false)
        setShowBackupCodes(true)
        setSuccess("Two-factor authentication has been enabled successfully!")

        // Clear temporary data
        sessionStorage.removeItem("temp_2fa_secret")
      } else {
        setError("Invalid verification code. Please try again.")
      }
    } catch (error) {
      setError("Verification failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisable2FA = async () => {
    if (
      !confirm("Are you sure you want to disable two-factor authentication? This will make your account less secure.")
    ) {
      return
    }

    setIsLoading(true)

    try {
      // Remove 2FA data (in real app, remove from database)
      localStorage.removeItem(`mfa_enabled_${user.id}`)
      localStorage.removeItem(`mfa_secret_${user.id}`)
      localStorage.removeItem(`backup_codes_${user.id}`)

      setMfaEnabled(false)
      setSuccess("Two-factor authentication has been disabled.")
    } catch (error) {
      setError("Failed to disable 2FA. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match")
      return
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      setSuccess("Password updated successfully!")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to update password")
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

      {/* Security Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Security Settings</h1>
            <p className="text-muted-foreground">
              Manage your account security and enable additional protection measures
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Two-Factor Authentication */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-primary" />
                    <CardTitle>Two-Factor Authentication</CardTitle>
                  </div>
                  <Badge variant={mfaEnabled ? "default" : "secondary"}>{mfaEnabled ? "Enabled" : "Disabled"}</Badge>
                </div>
                <CardDescription>
                  Add an extra layer of security to your account with time-based one-time passwords
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!mfaEnabled && !showSetup2FA && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Two-factor authentication is not enabled. Enable it to secure your account with an additional
                      verification step.
                    </p>
                    <Button onClick={handleSetup2FA} disabled={isLoading}>
                      {isLoading ? "Setting up..." : "Enable 2FA"}
                    </Button>
                  </div>
                )}

                {showSetup2FA && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="font-semibold mb-2">Scan QR Code</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                      </p>
                      {qrCodeUrl && (
                        <img src={qrCodeUrl || "/placeholder.svg"} alt="2FA QR Code" className="mx-auto mb-4" />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="verification">Enter verification code</Label>
                      <Input
                        id="verification"
                        type="text"
                        placeholder="000000"
                        maxLength={6}
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleVerify2FA} disabled={isLoading}>
                        {isLoading ? "Verifying..." : "Verify & Enable"}
                      </Button>
                      <Button variant="outline" onClick={() => setShowSetup2FA(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {mfaEnabled && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">Two-factor authentication is active</span>
                    </div>
                    <div className="space-y-2">
                      <Button variant="outline" onClick={() => setShowBackupCodes(!showBackupCodes)}>
                        {showBackupCodes ? "Hide" : "Show"} Backup Codes
                      </Button>
                      <Button variant="destructive" onClick={handleDisable2FA} disabled={isLoading}>
                        Disable 2FA
                      </Button>
                    </div>
                  </div>
                )}

                {showBackupCodes && backupCodes.length > 0 && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Backup Codes</h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      Save these codes in a safe place. You can use them to access your account if you lose your
                      authenticator device.
                    </p>
                    <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                      {backupCodes.map((code, index) => (
                        <div key={index} className="bg-background p-2 rounded border">
                          {code}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Password Change */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-primary" />
                  <CardTitle>Change Password</CardTitle>
                </div>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPasswords ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPasswords(!showPasswords)}
                      >
                        {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type={showPasswords ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type={showPasswords ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Account Security */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle>Account Security</CardTitle>
                </div>
                <CardDescription>Monitor and manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email verification</span>
                    <Badge variant="default">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Two-factor authentication</span>
                    <Badge variant={mfaEnabled ? "default" : "secondary"}>{mfaEnabled ? "Enabled" : "Disabled"}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Secure connection</span>
                    <Badge variant="default">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      HTTPS
                    </Badge>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Security Tips</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Use a unique, strong password</li>
                    <li>• Enable two-factor authentication</li>
                    <li>• Keep your browser updated</li>
                    <li>• Never share your login credentials</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Session Management */}
            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>Manage your active login sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Current Session</p>
                      <p className="text-xs text-muted-foreground">
                        {navigator.userAgent.includes("Chrome") ? "Chrome" : "Browser"} • Active now
                      </p>
                    </div>
                    <Badge variant="default">Current</Badge>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  Sign Out All Other Sessions
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper functions for 2FA setup
function generateSecret(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
  let secret = ""
  for (let i = 0; i < 32; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return secret
}

function generateBackupCodes(): string[] {
  const codes = []
  for (let i = 0; i < 8; i++) {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    codes.push(code)
  }
  return codes
}
