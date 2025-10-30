"use client"

import { Card } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { ArrowLeft, Copy, QrCode, CreditCard, Building2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "../../../lib/auth-context"
import { useBalance } from "../../../lib/balance-context"
import { CELO_STABLECOINS, CONTRACT_ADDRESSES } from "../../../lib/contract-utils"

export default function DepositPage() {
  const { isAuthenticated, user } = useAuth()
  const { contractManager } = useBalance()
  const [amount, setAmount] = useState("")
  const [copied, setCopied] = useState(false)
  const [isDepositing, setIsDepositing] = useState(false)

  const walletAddress = user?.walletAddress || "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDeposit = async (tokenAddress: string) => {
    if (!contractManager || !amount) {
      alert("Please enter an amount and ensure wallet is connected")
      return
    }

    setIsDepositing(true)
    try {
      await contractManager.depositStable(tokenAddress, amount)
      alert("Deposit successful!")
      setAmount("")
    } catch (error) {
      console.error("Deposit failed:", error)
      alert("Deposit failed. Please try again.")
    } finally {
      setIsDepositing(false)
    }
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
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Deposit Funds</h1>
            <p className="text-sm text-muted-foreground mt-1">Add funds to your MiniCard wallet</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Tabs defaultValue="crypto" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
            <TabsTrigger value="card">Card</TabsTrigger>
            <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
          </TabsList>

          <TabsContent value="crypto" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Deposit Crypto</h3>
                  <p className="text-sm text-muted-foreground">
                    Send USDT or USDC to your MiniCard wallet address. Funds will be converted to stablecoins
                    automatically.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Your Wallet Address</Label>
                    <div className="flex gap-2 mt-2">
                      <Input value={walletAddress} readOnly className="font-mono text-sm" />
                      <Button onClick={handleCopy} variant="outline" size="icon">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    {copied && <p className="text-xs text-success mt-1">Address copied to clipboard!</p>}
                  </div>

                  <div className="flex items-center justify-center p-8 bg-muted rounded-xl">
                    <div className="text-center space-y-3">
                      <div className="flex justify-center">
                        <div className="h-48 w-48 bg-background rounded-xl flex items-center justify-center border-2 border-border">
                          <QrCode className="h-24 w-24 text-muted-foreground" />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">Scan QR code to deposit</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="crypto-amount">Amount (USDT)</Label>
                      <Input
                        id="crypto-amount"
                        type="number"
                        placeholder="100.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    
                    <Button
                      onClick={() => handleDeposit(CELO_STABLECOINS.USDT)}
                      disabled={!amount || isDepositing}
                      className="w-full bg-gradient-to-br from-primary to-secondary hover:opacity-90"
                    >
                      {isDepositing ? "Depositing..." : `Deposit ${amount || "0.00"} USDT`}
                    </Button>
                  </div>

                  <div className="bg-accent/50 rounded-xl p-4 space-y-2">
                    <h4 className="font-medium text-sm">Important Notes:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Only send USDT or USDC to this address</li>
                      <li>Minimum deposit: $10</li>
                      <li>Network: Celo</li>
                      <li>Deposits typically arrive within 5-15 minutes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="card" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Deposit with Card</h3>
                  <p className="text-sm text-muted-foreground">Add funds instantly using your debit or credit card</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="card-amount">Amount (USD)</Label>
                    <Input
                      id="card-amount"
                      type="number"
                      placeholder="100.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="card-number">Card Number</Label>
                    <div className="relative mt-2">
                      <Input id="card-number" placeholder="1234 5678 9012 3456" className="pl-10" />
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" className="mt-2" />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" type="password" maxLength={3} className="mt-2" />
                    </div>
                  </div>

                  <div className="bg-accent/50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Processing Fee (2.9%)</span>
                      <span className="font-medium">
                        ${amount ? (Number.parseFloat(amount) * 0.029).toFixed(2) : "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold pt-2 border-t border-border">
                      <span>Total</span>
                      <span>${amount ? (Number.parseFloat(amount) * 1.029).toFixed(2) : "0.00"}</span>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-br from-primary to-secondary hover:opacity-90" size="lg">
                    Deposit ${amount || "0.00"}
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="bank" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Bank Transfer</h3>
                  <p className="text-sm text-muted-foreground">Transfer funds directly from your bank account</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-muted rounded-xl p-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
                        <Building2 className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <h4 className="font-semibold">MiniCard Bank Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Bank Name:</span>
                            <span className="font-medium">Silicon Valley Bank</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Account Name:</span>
                            <span className="font-medium">MiniCard Inc.</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Account Number:</span>
                            <span className="font-mono font-medium">1234567890</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Routing Number:</span>
                            <span className="font-mono font-medium">121000248</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Reference:</span>
                            <span className="font-mono font-medium">MC-{isAuthenticated ? "WALLET" : "USER"}-001</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-accent/50 rounded-xl p-4 space-y-2">
                    <h4 className="font-medium text-sm">Important:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Include your reference number in the transfer description</li>
                      <li>Bank transfers typically take 1-3 business days</li>
                      <li>Minimum transfer: $50</li>
                      <li>No fees for bank transfers</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
