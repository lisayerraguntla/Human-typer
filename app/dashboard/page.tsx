"use client"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Shield, User, CreditCard, Key, Copy, CheckCircle } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Get subscription status
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", data.user.id)
    .eq("status", "active")
    .single()

  // Get license key
  const { data: license } = await supabase
    .from("licenses")
    .select("*")
    .eq("user_id", data.user.id)
    .eq("status", "active")
    .single()

  // Get recent downloads
  const { data: recentDownloads } = await supabase
    .from("downloads")
    .select("*")
    .eq("user_id", data.user.id)
    .order("downloaded_at", { ascending: false })
    .limit(3)

  const hasActiveSubscription = !!subscription

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">HT</span>
              </div>
              <span className="text-xl font-bold text-foreground">Human Typer</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Welcome, {profile?.full_name || data.user.email}</span>
              <form action="/auth/signout" method="post">
                <Button variant="outline" size="sm" type="submit">
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your Human Typer subscription and download the extension</p>
        </div>

        {!hasActiveSubscription && (
          <Alert className="mb-6">
            <AlertDescription>
              <strong>No active subscription found.</strong> Subscribe to access the Human Typer extension and all
              premium features.
              <Button asChild size="sm" className="ml-4">
                <Link href="/subscribe">Subscribe Now</Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Subscription Status */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CreditCard className="h-8 w-8 text-primary" />
                <Badge variant={hasActiveSubscription ? "default" : "secondary"}>
                  {hasActiveSubscription ? "Active" : "Inactive"}
                </Badge>
              </div>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>
                {hasActiveSubscription
                  ? "Your subscription is active and ready to use"
                  : "Subscribe to access the Human Typer extension"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasActiveSubscription ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Next billing:{" "}
                    {subscription?.current_period_end
                      ? new Date(subscription.current_period_end).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/billing">Manage Billing</Link>
                  </Button>
                </div>
              ) : (
                <Button asChild>
                  <Link href="/subscribe">Subscribe Now</Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {hasActiveSubscription && license && (
            <Card>
              <CardHeader>
                <Key className="h-8 w-8 text-primary" />
                <CardTitle>License Key</CardTitle>
                <CardDescription>Your unique license key for the extension</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <code className="text-sm font-mono break-all">{license.license_key}</code>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    onClick={() => navigator.clipboard.writeText(license.license_key)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy License Key
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Use this key to activate the extension after installation
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Download Extension */}
          <Card>
            <CardHeader>
              <Download className="h-8 w-8 text-primary" />
              <CardTitle>Extension Download</CardTitle>
              <CardDescription>Download the Human Typer browser extension</CardDescription>
            </CardHeader>
            <CardContent>
              {hasActiveSubscription ? (
                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <Link href="/download">Download Extension</Link>
                  </Button>
                  {recentDownloads && recentDownloads.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Last downloaded: {new Date(recentDownloads[0].downloaded_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Subscribe to access the extension download</p>
                  <Button variant="outline" disabled>
                    Download Locked
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Security */}
          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary" />
              <CardTitle>Account Security</CardTitle>
              <CardDescription>Manage your account security settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Two-Factor Authentication Enabled</span>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/security">Security Settings</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Profile */}
          <Card>
            <CardHeader>
              <User className="h-8 w-8 text-primary" />
              <CardTitle>Profile</CardTitle>
              <CardDescription>Update your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Email:</strong> {data.user.email}
                </p>
                <p className="text-sm">
                  <strong>Name:</strong> {profile?.full_name || "Not set"}
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/profile">Edit Profile</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {hasActiveSubscription && recentDownloads && recentDownloads.length > 0 && (
            <Card>
              <CardHeader>
                <Download className="h-8 w-8 text-primary" />
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent downloads and activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentDownloads.map((download, index) => (
                    <div key={download.id} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {download.download_url?.includes("chrome") ? "Chrome Extension" : "Firefox Extension"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(download.downloaded_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
