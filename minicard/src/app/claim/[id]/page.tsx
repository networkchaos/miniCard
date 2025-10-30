"use client"

import { Card } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { ArrowLeft, Shield, Clock, DollarSign, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "../../../../lib/auth-context"
import { usePaymentLinks } from "../../../../lib/payment-links-context"

interface ClaimPageProps {
  params: {
    id: string
  }
}

export default function ClaimPage({ params }: ClaimPageProps) {
  const { isAuthenticated, user } = useAuth()
  const { getPaymentLink, claimPaymentLink, isLoading } = usePaymentLinks()
  const [paymentLink, setPaymentLink] = useState<any>(null)
  const [secret, setSecret] = useState("")
  const [isClaiming, setIsClaiming] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (params.id) {
      loadPaymentLink()
    }
  }, [params.id])

  const loadPaymentLink = async () => {
    try {
      const link = await getPaymentLink(params.id)
      if (link) {
        setPaymentLink(link)
      } else {
        setError("Payment link not found")
      }
    } catch (error) {
      console.error("Failed to load payment link:", error)
      setError("Failed to load payment link")
    }
  }

  const handleClaim = async () => {
    if (!secret) {
      setError("Please enter the secret key")
      return
    }

    setIsClaiming(true)
    setError("")

    try {
      const success = await claimPaymentLink(params.id, secret)
      if (success) {
        setSuccess(true)
      } else {
        setError("Failed to claim payment link")
      }
    } catch (error: any) {
      setError(error.message || "Failed to claim payment link")
    } finally {
      setIsClaiming(false)
    }
  }

  const formatExpiry = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const isExpired = paymentLink && new Date() > new Date(paymentLink.expiry)

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <div className="p-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <h1 className="text-xl font-semibold">Authentication Required</h1>
            <p className="text-muted-foreground">
              Please log in to claim this payment link
            </p>
            <Link href="/">
              <Button className="w-full">Go to Login</Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  if (error && !paymentLink) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <div className="p-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <h1 className="text-xl font-semibold">Payment Link Not Found</h1>
            <p className="text-muted-foreground">{error}</p>
            <Link href="/dashboard">
              <Button className="w-full">Go to Dashboard</Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <div className="p-6 text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 mx-auto">
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
            <h1 className="text-xl font-semibold">Payment Claimed Successfully!</h1>
            <p className="text-muted-foreground">
              {paymentLink?.amount} USDT has been added to your account
            </p>
            <Link href="/dashboard">
              <Button className="w-full">Go to Dashboard</Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="border-b border-border/50 backdrop-blur-md bg-background/80 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/payment-links">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Claim Payment</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter secret key to claim payment</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-0 shadow-lg">
          <div className="p-6 space-y-6">
            {paymentLink && (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary mx-auto">
                    <DollarSign className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-semibold">
                    {paymentLink.amount} USDT
                    {paymentLink.fiatAmount && (
                      <span className="text-muted-foreground ml-2">
                        ({paymentLink.fiatAmount} {paymentLink.fiatCurrency})
                      </span>
                    )}
                  </h2>
                  <p className="text-muted-foreground">
                    {paymentLink.onRamp ? "On-Ramp Payment" : "Off-Ramp Payment"}
                  </p>
                </div>

                <div className="bg-accent/50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Expires</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatExpiry(paymentLink.expiry)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Status</span>
                    </div>
                    <span className={`text-sm font-medium ${
                      isExpired ? 'text-destructive' : 
                      paymentLink.claimed ? 'text-orange-500' : 
                      'text-green-500'
                    }`}>
                      {isExpired ? 'Expired' : 
                       paymentLink.claimed ? 'Already Claimed' : 
                       'Available'}
                    </span>
                  </div>
                </div>

                {isExpired ? (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      <p className="text-sm text-destructive font-medium">
                        This payment link has expired
                      </p>
                    </div>
                  </div>
                ) : paymentLink.claimed ? (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      <p className="text-sm text-orange-500 font-medium">
                        This payment link has already been claimed
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="secret">Secret Key</Label>
                      <Input
                        id="secret"
                        type="password"
                        placeholder="Enter the secret key"
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                        className="mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Enter the secret key provided by the sender
                      </p>
                    </div>

                    {error && (
                      <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-destructive" />
                          <p className="text-sm text-destructive font-medium">{error}</p>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handleClaim}
                      disabled={!secret || isClaiming}
                      className="w-full bg-gradient-to-br from-primary to-secondary hover:opacity-90"
                    >
                      {isClaiming ? "Claiming..." : "Claim Payment"}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
