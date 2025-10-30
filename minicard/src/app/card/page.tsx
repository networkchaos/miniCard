"use client"

import { DashboardLayout } from "../../../components/dashboard-layout"
import { Card } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { ArrowLeft, Copy, Lock, Unlock, Eye, EyeOff, Settings, Download } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useCard } from "../../../lib/card-context"

export default function CardPage() {
  const { card, hasCard, freezeCard, unfreezeCard, isLoading } = useCard()
  const [showDetails, setShowDetails] = useState(false)
  const [copied, setCopied] = useState(false)
  const isFrozen = card?.status === "inactive"

  const handleCopy = () => {
    navigator.clipboard.writeText(`4532 1234 5678 ${card?.lastFour}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!hasCard) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="text-center py-12">
            <p className="text-muted-foreground">You don't have a card yet. Request one to get started.</p>
            <Link href="/request-card">
              <Button className="mt-4 bg-gradient-to-r from-primary to-secondary">Request Card</Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Your MiniCard</h1>
          <p className="text-muted-foreground">Manage your virtual card settings and details</p>
        </div>

        {/* Card Display */}
        <div className="relative aspect-[1.586/1] w-full max-w-md">
          <div
            className={`absolute inset-0 rounded-3xl bg-gradient-to-br from-primary via-accent to-secondary p-[2px] shadow-2xl transition-all duration-300 hover:scale-[1.02] ${isFrozen ? "opacity-50 grayscale" : ""}`}
          >
            <div className="h-full w-full rounded-3xl bg-gradient-to-br from-primary/95 via-accent/95 to-secondary/95 p-8 text-primary-foreground backdrop-blur-xl relative overflow-hidden">
              {/* Animated background elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary-foreground/10 rounded-full blur-3xl -mr-20 -mt-20" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary-foreground/10 rounded-full blur-3xl -ml-20 -mb-20" />

              {/* Card chip */}
              <div className="mb-8 relative z-10">
                <div className="h-12 w-14 rounded-lg bg-gradient-to-br from-yellow-300 to-yellow-600 shadow-lg" />
              </div>

              {/* Card number */}
              <div className="mb-8 relative z-10">
                <p className="text-xs font-medium mb-2 opacity-80 tracking-widest">CARD NUMBER</p>
                <p className="text-2xl font-mono tracking-widest font-bold">
                  {showDetails ? `4532 1234 5678 ${card.last4}` : `•••• •••• •••• ${card.last4}`}
                </p>
              </div>

              {/* Card details */}
              <div className="flex items-end justify-between relative z-10">
                <div>
                  <p className="text-xs font-medium mb-1 opacity-80 tracking-widest">CARDHOLDER</p>
                  <p className="text-sm font-bold">ALEX MORGAN</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium mb-1 opacity-80 tracking-widest">EXPIRES</p>
                  <p className="text-sm font-bold">
                    {showDetails ? `${card.expMonth}/${card.expYear.toString().slice(-2)}` : "••/••"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium mb-1 opacity-80 tracking-widest">CVV</p>
                  <p className="text-sm font-bold">{showDetails ? "123" : "•••"}</p>
                </div>
              </div>

              {/* Visa logo */}
              <div className="absolute top-6 right-8 z-10">
                <div className="text-2xl font-bold tracking-wider">VISA</div>
              </div>

              {/* Frozen overlay */}
              {isFrozen && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-3xl backdrop-blur-sm z-20">
                  <div className="text-center">
                    <Lock className="h-16 w-16 mx-auto mb-3 text-white" />
                    <p className="text-white font-bold text-lg">Card Frozen</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Button variant="outline" className="gap-2 bg-transparent" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showDetails ? "Hide Details" : "Show Details"}
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
            {copied ? "Copied!" : "Copy Number"}
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent" onClick={isFrozen ? unfreezeCard : freezeCard}>
            {isFrozen ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            {isFrozen ? "Unfreeze Card" : "Freeze Card"}
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Download Statement
          </Button>
        </div>

        {/* Card Settings */}
        <Card className="p-8 border-0 shadow-lg space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Card Settings</h3>
              <p className="text-sm text-muted-foreground">Manage your card preferences</p>
            </div>
            <Settings className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
              <div>
                <p className="font-medium">Online Payments</p>
                <p className="text-sm text-muted-foreground">Enable/disable online transactions</p>
              </div>
              <input type="checkbox" defaultChecked className="h-5 w-5" />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
              <div>
                <p className="font-medium">International Payments</p>
                <p className="text-sm text-muted-foreground">Allow transactions outside your country</p>
              </div>
              <input type="checkbox" defaultChecked className="h-5 w-5" />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-background/50">
              <div>
                <p className="font-medium">Contactless Payments</p>
                <p className="text-sm text-muted-foreground">Enable tap-to-pay functionality</p>
              </div>
              <input type="checkbox" defaultChecked className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
