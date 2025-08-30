import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Privacy Policy - Human Typer",
  description:
    "Learn how Human Typer protects your privacy and handles your data with our comprehensive privacy policy.",
}

export default function PrivacyPage() {
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

      {/* Privacy Policy Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: December 2024</p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Account Information</h3>
                  <p className="text-sm text-muted-foreground">
                    When you create an account, we collect your email address, name, and encrypted password. We use
                    Supabase for secure authentication and data storage.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Payment Information</h3>
                  <p className="text-sm text-muted-foreground">
                    Payment processing is handled by Stripe. We do not store your credit card information on our
                    servers. Stripe may collect billing address and payment method details.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Usage Data</h3>
                  <p className="text-sm text-muted-foreground">
                    We collect basic usage analytics such as login times, subscription status, and download activity. We
                    do not collect or store any text content you type using the extension.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Provide and maintain the Human Typer service</li>
                  <li>• Process payments and manage subscriptions</li>
                  <li>• Send important service updates and security notifications</li>
                  <li>• Provide customer support</li>
                  <li>• Improve our service and develop new features</li>
                  <li>• Ensure security and prevent fraud</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Protection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Local Processing</h3>
                  <p className="text-sm text-muted-foreground">
                    The Human Typer extension processes all text locally in your browser. Your typed content never
                    leaves your device and is not transmitted to our servers.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Encryption</h3>
                  <p className="text-sm text-muted-foreground">
                    All data transmission is encrypted using HTTPS. Passwords are hashed using industry-standard
                    algorithms. Two-factor authentication provides additional security.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Data Retention</h3>
                  <p className="text-sm text-muted-foreground">
                    We retain account information for as long as your account is active. You can request account
                    deletion at any time through our support system.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Third-Party Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Supabase</h3>
                  <p className="text-sm text-muted-foreground">
                    We use Supabase for authentication and database services. Supabase complies with GDPR and other
                    privacy regulations.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Stripe</h3>
                  <p className="text-sm text-muted-foreground">
                    Payment processing is handled by Stripe, which is PCI DSS compliant and follows strict security
                    standards.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Vercel</h3>
                  <p className="text-sm text-muted-foreground">
                    Our website is hosted on Vercel, which provides secure hosting and content delivery.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Rights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Access your personal data</li>
                  <li>• Correct inaccurate information</li>
                  <li>• Delete your account and data</li>
                  <li>• Export your data</li>
                  <li>• Opt out of marketing communications</li>
                  <li>• File a complaint with supervisory authorities</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-4">
                  To exercise these rights, contact us at privacy@humantyper.com or through our support system.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  If you have questions about this Privacy Policy, please contact us at:
                </p>
                <div className="mt-4 space-y-1 text-sm">
                  <p>Email: privacy@humantyper.com</p>
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
