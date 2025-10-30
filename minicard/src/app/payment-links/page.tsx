"use client"

import { Card } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { ArrowLeft, Copy, Link2, DollarSign, Clock, Shield } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "../../../lib/auth-context"
import { usePaymentLinks } from "../../../lib/payment-links-context"
import { CELO_STABLECOINS } from "../../../lib/contract-utils"

export default function PaymentLinksPage() {
  const { isAuthenticated, user } = useAuth()
  const { createPaymentLink, paymentLinks, isLoading } = usePaymentLinks()
  const [amount, setAmount] = useState("")
  const [secret, setSecret] = useState("")
  const [expiry, setExpiry] = useState("")
  const [fiatAmount, setFiatAmount] = useState("")
  const [fiatCurrency, setFiatCurrency] = useState("USD")
  const [linkType, setLinkType] = useState<"onRamp" | "offRamp">("onRamp")
  const [createdLink, setCreatedLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleCreateLink = async () => {
    if (!amount || !secret || !expiry) {
      alert("Please fill in all required fields")
      return
    }

    try {
      const link = await createPaymentLink({
        tokenAddress: CELO_STABLECOINS.USDT,
        amount,
        secret,
        expiry: new Date(expiry),
        fiatAmount: fiatAmount ? parseFloat(fiatAmount) : undefined,
        fiatCurrency,
        onRamp: linkType === "onRamp",
        offRamp: linkType === "offRamp",
      })

      setCreatedLink(link.id)
      setAmount("")
      setSecret("")
      setExpiry("")
      setFiatAmount("")
    } catch (error) {
      console.error("Failed to create payment link:", error)
      alert("Failed to create payment link. Please try again.")
    }
  }

  const handleCopyLink = () => {
    if (createdLink) {
      const linkUrl = `${window.location.origin}/claim/${createdLink}`
      navigator.clipboard.writeText(linkUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="border-b border-border/50 backdrop-blur-md bg-background/80 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Payment Links</h1>
            <p className="text-sm text-muted-foreground mt-1">Create secure payment links for fiat and crypto</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Link</TabsTrigger>
            <TabsTrigger value="manage">Manage Links</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Create Payment Link</h3>
                  <p className="text-sm text-muted-foreground">
                    Create secure payment links that can be shared with others
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="linkType">Link Type</Label>
                      <select
                        id="linkType"
                        value={linkType}
                        onChange={(e) => setLinkType(e.target.value as "onRamp" | "offRamp")}
                        className="w-full mt-2 p-2 border border-border rounded-md bg-background"
                      >
                        <option value="onRamp">On-Ramp (Fiat to Crypto)</option>
                        <option value="offRamp">Off-Ramp (Crypto to Fiat)</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="fiatCurrency">Fiat Currency</Label>
                      <select
                        id="fiatCurrency"
                        value={fiatCurrency}
                        onChange={(e) => setFiatCurrency(e.target.value)}
                        className="w-full mt-2 p-2 border border-border rounded-md bg-background"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="KES">KES</option>
                      </select>
                    </div>
                    </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="amount">Crypto Amount (USDT)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="100.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fiatAmount">Fiat Amount</Label>
                      <Input
                        id="fiatAmount"
                        type="number"
                        placeholder="100.00"
                        value={fiatAmount}
                        onChange={(e) => setFiatAmount(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="secret">Secret Key</Label>
                    <Input
                      id="secret"
                      type="password"
                      placeholder="Enter a secret key for security"
                      value={secret}
                      onChange={(e) => setSecret(e.target.value)}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      This will be required to claim the payment link
                    </p>
                    </div>

                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      type="datetime-local"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="mt-2"
                    />
                    </div>

                    <div className="bg-accent/50 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <h4 className="font-medium text-sm">Security Features</h4>
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Secret key required to claim</li>
                      <li>Time-limited expiry</li>
                      <li>One-time use only</li>
                      <li>Encrypted transaction data</li>
                    </ul>
                    </div>

                    <Button
                    onClick={handleCreateLink}
                    disabled={!amount || !secret || !expiry || isLoading}
                      className="w-full bg-gradient-to-br from-primary to-secondary hover:opacity-90"
                    >
                    {isLoading ? "Creating..." : "Create Payment Link"}
                    </Button>

                  {createdLink && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Link2 className="h-4 w-4 text-green-500" />
                        <h4 className="font-medium text-green-500">Payment Link Created!</h4>
                    </div>
                    <div className="flex gap-2">
                        <Input
                          value={`${window.location.origin}/claim/${createdLink}`}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button onClick={handleCopyLink} variant="outline" size="icon">
                        <Copy className="h-4 w-4" />
                      </Button>
                      </div>
                      {copied && <p className="text-xs text-green-500">Link copied to clipboard!</p>}
                    </div>
                  )}
                  </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Your Payment Links</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage and track your created payment links
                  </p>
                </div>

                <div className="space-y-4">
                  {paymentLinks.length === 0 ? (
                    <div className="text-center py-8">
                      <Link2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No payment links created yet</p>
                    </div>
                  ) : (
                    paymentLinks.map((link) => (
                      <div
                        key={link.id}
                        className="border border-border rounded-xl p-4 space-y-3"
                      >
                      <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
                              <DollarSign className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {link.amount} USDT {link.fiatAmount && `(${link.fiatAmount} ${link.fiatCurrency})`}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {link.onRamp ? "On-Ramp" : "Off-Ramp"} • {link.claimed ? "Claimed" : "Active"}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              Expires: {formatExpiry(link.expiry)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {link.claimed ? `Claimed by ${link.claimedBy}` : "Not claimed"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const linkUrl = `${window.location.origin}/claim/${link.id}`
                              navigator.clipboard.writeText(linkUrl)
                            }}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Link
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              window.open(`/claim/${link.id}`, '_blank')
                            }}
                          >
                            <Link2 className="h-4 w-4 mr-2" />
                            View Link
                          </Button>
                      </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}