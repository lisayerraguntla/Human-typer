import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Terms of Service - Human Typer",
  description: "Read the terms of service for Human Typer, including usage guidelines and user responsibilities.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm text-muted-foreground">Back to Home</span>
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

      {/* Terms Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: December 2024</p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  By accessing and using Human Typer, you accept and agree to be bound by the terms and provision of
                  this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Human Typer is a browser extension that provides automated typing functionality with human-like
                  cadence. The service is designed for accessibility, productivity, and legitimate professional use
                  cases.
                </p>
                <div>
                  <h3 className="font-semibold mb-2">Intended Use Cases</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Accessibility assistance for users with disabilities</li>
                    <li>• RSI and repetitive strain injury relief</li>
                    <li>• Professional document creation and workflows</li>
                    <li>• Customer service response templates</li>
                    <li>• Educational demonstrations and coding tutorials</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Responsible Use Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Permitted Uses</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Personal productivity and accessibility assistance</li>
                    <li>• Professional document creation and workflows</li>
                    <li>• Educational and training purposes</li>
                    <li>• Content creation for legitimate business purposes</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Prohibited Uses</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Academic dishonesty or cheating on exams/assignments</li>
                    <li>• Circumventing platform anti-automation measures</li>
                    <li>• Creating spam or fraudulent content</li>
                    <li>• Violating terms of service of third-party platforms</li>
                    <li>• Any illegal or unethical activities</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subscription and Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Billing</h3>
                  <p className="text-sm text-muted-foreground">
                    Human Typer is offered as a monthly subscription service for $5/month. Payments are processed
                    securely through Stripe. Subscriptions automatically renew unless cancelled.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Cancellation</h3>
                  <p className="text-sm text-muted-foreground">
                    You may cancel your subscription at any time through your billing dashboard. Access to the service
                    continues until the end of your current billing period.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Refunds</h3>
                  <p className="text-sm text-muted-foreground">
                    Refunds are available within 7 days of initial purchase. Contact support for refund requests.
                    Refunds are not available for partial months or after the 7-day period.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Responsibilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Use the service in compliance with all applicable laws and regulations</li>
                  <li>• Respect the terms of service of platforms where you use Human Typer</li>
                  <li>• Maintain the security of your account credentials</li>
                  <li>• Report any security vulnerabilities or misuse to our support team</li>
                  <li>• Use two-factor authentication for enhanced account security</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Human Typer is provided "as is" without warranty of any kind. We are not liable for any damages
                  arising from the use or inability to use the service, including but not limited to account suspensions
                  on third-party platforms, data loss, or business interruption.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacy and Data Protection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your privacy is important to us. Please review our{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>{" "}
                  to understand how we collect, use, and protect your information. The extension processes all text
                  locally and does not transmit your content to our servers.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Modifications to Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We reserve the right to modify these terms at any time. Users will be notified of significant changes
                  via email or through the service. Continued use of the service after changes constitutes acceptance of
                  the new terms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  For questions about these Terms of Service, please contact us:
                </p>
                <div className="mt-4 space-y-1 text-sm">
                  <p>Email: legal@humantyper.com</p>
                  <p>
                    Support:{" "}
                    <Link href="/support" className="text-primary hover:underline">
                      Contact Form
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
