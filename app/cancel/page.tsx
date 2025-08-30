import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { XCircle, ArrowLeft, CreditCard } from "lucide-react"
import Link from "next/link"

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">HT</span>
              </div>
              <span className="text-xl font-bold text-foreground">Human Typer</span>
            </div>
          </div>
        </div>
      </header>

      {/* Cancel Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <Card>
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                <XCircle className="h-8 w-8 text-orange-600" />
              </div>
              <Badge variant="secondary" className="mx-auto mb-2">
                Payment Canceled
              </Badge>
              <CardTitle className="text-3xl">No Worries!</CardTitle>
              <CardDescription className="text-lg">
                Your payment was canceled and no charge was made to your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-sm text-muted-foreground">
                <p>
                  You can try subscribing again anytime. If you experienced any issues during checkout, please don't
                  hesitate to contact our support team.
                </p>
              </div>

              <div className="space-y-3">
                <Button asChild size="lg" className="w-full">
                  <Link href="/subscribe">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Try Again
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full bg-transparent">
                  <Link href="/">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>
              </div>

              <div className="text-xs text-muted-foreground">
                <p>
                  Need help?{" "}
                  <Link href="/support" className="text-primary hover:underline">
                    Contact our support team
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
