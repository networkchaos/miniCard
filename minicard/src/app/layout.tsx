import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"
import { ErrorBoundary } from "../../components/error-boundary"
import { AuthProvider } from "../../lib/auth-context"
import { CardProvider } from "../../lib/card-context"
import { BalanceProvider } from "../../lib/balance-context"
import { SendProvider } from "../../lib/send-context"
import { PaymentLinksProvider } from "../../lib/payment-links-context"
import { SubscriptionProvider } from "../../lib/subscription-context"
import { WaitlistProvider } from "../../lib/waitlist-context"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "MiniCard - Crypto & Fiat Payments",
  description: "Manage your crypto and fiat balances with ease",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} ${GeistMono.variable} antialiased`}>
        <ErrorBoundary>
          <Suspense fallback={null}>
            <WaitlistProvider>
              <AuthProvider>
                <CardProvider>
                  <BalanceProvider>
                    <SendProvider>
                      <PaymentLinksProvider>
                        <SubscriptionProvider>
                          {children}
                        </SubscriptionProvider>
                      </PaymentLinksProvider>
                    </SendProvider>
                  </BalanceProvider>
                </CardProvider>
              </AuthProvider>
            </WaitlistProvider>
            <Analytics />
          </Suspense>
        </ErrorBoundary>
      </body>
    </html>
  )
}
