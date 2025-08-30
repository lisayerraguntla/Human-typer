import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Download, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function SuccessPage() {
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

      {/* Success Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <Card>
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <Badge variant="default" className="mx-auto mb-2 bg-green-600">
                Payment Successful
              </Badge>
              <CardTitle className="text-3xl">Welcome to Human Typer!</CardTitle>
              <CardDescription className="text-lg">
                Your subscription is now active and you have full access to the Human Typer extension.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Subscription activated</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>License key generated</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Extension ready for download</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button asChild size="lg" className="w-full">
                  <Link href="/dashboard">
                    <Download className="h-4 w-4 mr-2" />
                    Go to Dashboard & Download Extension
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full bg-transparent">
                  <Link href="/billing">
                    Manage Subscription
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>

              <div className="text-xs text-muted-foreground">
                <p>You'll receive a confirmation email shortly with your receipt and account details.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
