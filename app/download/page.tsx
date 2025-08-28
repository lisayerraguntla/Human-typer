import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Shield, Chrome, FileBox as Firefox, ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"
import DownloadButton from "@/components/download-button"

export default async function DownloadPage() {
  const supabase = await createClient()

  // Check authentication
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Check subscription status
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", data.user.id)
    .eq("status", "active")
    .single()

  const hasActiveSubscription = !!subscription

  // If no active subscription, redirect to subscribe page
  if (!hasActiveSubscription) {
    redirect("/subscribe")
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
            <div className="flex items-center space-x-4">
              <Badge variant="default">
                <Shield className="h-3 w-3 mr-1" />
                Active Subscription
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Download Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Download className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Download Human Typer Extension</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your subscription is active! Download the extension and start typing with human-like cadence.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Download Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Extension Download
                  </CardTitle>
                  <CardDescription>Download the latest version of Human Typer for your browser</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Chrome className="h-6 w-6 text-blue-500" />
                      <div>
                        <p className="font-medium">Chrome Extension</p>
                        <p className="text-sm text-muted-foreground">Version 1.0.0 • Compatible with Chrome 88+</p>
                      </div>
                    </div>
                    <DownloadButton userId={data.user.id} fileName="human-typer-chrome.zip" displayName="Chrome" />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Firefox className="h-6 w-6 text-orange-500" />
                      <div>
                        <p className="font-medium">Firefox Extension</p>
                        <p className="text-sm text-muted-foreground">Version 1.0.0 • Compatible with Firefox 78+</p>
                      </div>
                    </div>
                    <DownloadButton userId={data.user.id} fileName="human-typer-firefox.zip" displayName="Firefox" />
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Extensions are digitally signed and verified. Only download from this official source.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>

            {/* Installation Instructions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Installation Instructions</CardTitle>
                  <CardDescription>Follow these steps to install Human Typer in your browser</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Chrome Instructions */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Chrome className="h-4 w-4 text-blue-500" />
                      Chrome Installation
                    </h3>
                    <ol className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                          1
                        </span>
                        Download the Chrome extension file
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                          2
                        </span>
                        Open Chrome and go to chrome://extensions/
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                          3
                        </span>
                        Enable "Developer mode" in the top right
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                          4
                        </span>
                        Click "Load unpacked" and select the extracted folder
                      </li>
                    </ol>
                  </div>

                  {/* Firefox Instructions */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Firefox className="h-4 w-4 text-orange-500" />
                      Firefox Installation
                    </h3>
                    <ol className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                          1
                        </span>
                        Download the Firefox extension file
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                          2
                        </span>
                        Open Firefox and go to about:debugging
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                          3
                        </span>
                        Click "This Firefox" in the sidebar
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                          4
                        </span>
                        Click "Load Temporary Add-on" and select the manifest.json file
                      </li>
                    </ol>
                  </div>
                </CardContent>
              </Card>

              {/* Usage Guide */}
              <Card>
                <CardHeader>
                  <CardTitle>How to Use</CardTitle>
                  <CardDescription>Get started with Human Typer in seconds</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Paste Your Text</p>
                        <p className="text-xs text-muted-foreground">Copy and paste the text you want to type</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Adjust Settings</p>
                        <p className="text-xs text-muted-foreground">Set typing speed, pauses, and error frequency</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Click and Type</p>
                        <p className="text-xs text-muted-foreground">Click in any text area and press Start</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Support */}
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
                      <Link href="/support">Contact Support</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
                      <Link href="/docs">View Documentation</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-12">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Security Notice:</strong> Only download Human Typer from this official page. Never install
                extensions from unknown sources. Your download activity is logged for security purposes.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  )
}
