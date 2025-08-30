import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Human Typer - Accessible Auto-Typing Extension for Professionals",
  description:
    "Professional auto-typing tool with human-like cadence. Perfect for accessibility, productivity, and seamless document creation. Supports Google Docs, Word Online, and any textarea. $5/month with instant access.",
  keywords: [
    "auto typing",
    "accessibility",
    "typing assistant",
    "productivity tool",
    "browser extension",
    "human-like typing",
    "document automation",
    "RSI relief",
    "motor disability support",
    "professional typing",
  ],
  authors: [{ name: "Human Typer Team" }],
  creator: "Human Typer",
  publisher: "Human Typer",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://humantyper.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Human Typer - Accessible Auto-Typing Extension",
    description:
      "Professional auto-typing tool with human-like cadence. Perfect for accessibility, productivity, and seamless document creation.",
    url: "/",
    siteName: "Human Typer",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Human Typer - Accessible Auto-Typing Extension",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Human Typer - Accessible Auto-Typing Extension",
    description:
      "Professional auto-typing tool with human-like cadence. Perfect for accessibility, productivity, and seamless document creation.",
    images: ["/og-image.png"],
    creator: "@humantyper",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Human Typer",
              description:
                "Professional auto-typing tool with human-like cadence. Perfect for accessibility, productivity, and seamless document creation.",
              url: process.env.NEXT_PUBLIC_BASE_URL || "https://humantyper.com",
              applicationCategory: "ProductivityApplication",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "5.00",
                priceCurrency: "USD",
                priceValidUntil: "2025-12-31",
                availability: "https://schema.org/InStock",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "127",
              },
              author: {
                "@type": "Organization",
                name: "Human Typer Team",
              },
            }),
          }}
        />
      </head>
      <body className={`font-sans ${inter.variable}`}>{children}</body>
    </html>
  )
}
