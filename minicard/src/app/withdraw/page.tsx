"use client"

import { Card } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { ArrowLeft, Building2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "../../../lib/auth-context"

export default function WithdrawPage() {
  const { isAuthenticated, user } = useAuth()
  const [amount, setAmount] = useState("")
  const [selectedCurrency, setSelectedCurrency] = useState("usdt")

  // Mock balance data - in production this would come from your backend
  const balance = {
    usdt: "3,245.80",
    usdc: "3,091.40",
    total: "6,337.20"
  }
  
  const availableBalance = selectedCurrency === "usdt" ? balance.usdt : balance.usdc

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
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Withdraw Funds</h1>
            <p className="text-sm text-muted-foreground mt-1">Transfer funds to your bank or crypto wallet</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Tabs defaultValue="bank" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bank">Bank Account</TabsTrigger>
            <TabsTrigger value="crypto">Crypto Wallet</TabsTrigger>
          </TabsList>

          <TabsContent value="bank" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Withdraw to Bank</h3>
                  <p className="text-sm text-muted-foreground">Transfer funds directly to your linked bank account</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-muted rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
                          <Building2 className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">Chase Bank ****4532</p>
                          <p className="text-xs text-muted-foreground">Primary Account</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Change
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bank-amount">Amount (USD)</Label>
                    <Input
                      id="bank-amount"
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Available: $18,245.30</p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setAmount("100")}>
                      $100
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setAmount("500")}>
                      $500
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setAmount("1000")}>
                      $1,000
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setAmount("18245.30")}>
                      Max
                    </Button>
                  </div>

                  <div className="bg-accent/50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Withdrawal Amount</span>
                      <span className="font-medium">${amount || "0.00"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Processing Fee</span>
                      <span className="font-medium">$0.00</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold pt-2 border-t border-border">
                      <span>You'll Receive</span>
                      <span>${amount || "0.00"}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-blue-500/10 rounded-xl p-4">
                    <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-500 mb-1">Processing Time</p>
                      <p className="text-muted-foreground">
                        Bank withdrawals typically take 1-3 business days to arrive
                      </p>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-br from-primary to-secondary hover:opacity-90"
                    size="lg"
                    disabled={!amount || Number.parseFloat(amount) <= 0}
                  >
                    Withdraw ${amount || "0.00"}
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="crypto" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Withdraw to Crypto Wallet</h3>
                  <p className="text-sm text-muted-foreground">Send your stablecoins to an external wallet address</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currency">Select Currency</Label>
                    <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usdt">USDT (Tether)</SelectItem>
                        <SelectItem value="usdc">USDC (USD Coin)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Available: ${isAuthenticated ? availableBalance : "0.00"}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="wallet-address">Wallet Address</Label>
                    <Input id="wallet-address" placeholder="0x..." className="mt-2 font-mono text-sm" />
                  </div>

                  <div>
                    <Label htmlFor="crypto-amount">Amount</Label>
                    <Input
                      id="crypto-amount"
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setAmount("100")}>
                      $100
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setAmount("500")}>
                      $500
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setAmount("1000")}>
                      $1,000
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setAmount(isAuthenticated ? availableBalance : "0")}>
                      Max
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor="network">Network</Label>
                    <Select defaultValue="ethereum">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ethereum">Ethereum (ERC-20)</SelectItem>
                        <SelectItem value="polygon">Polygon</SelectItem>
                        <SelectItem value="bsc">Binance Smart Chain</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-accent/50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Withdrawal Amount</span>
                      <span className="font-medium">${amount || "0.00"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Network Fee</span>
                      <span className="font-medium">~$2.50</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold pt-2 border-t border-border">
                      <span>You'll Receive</span>
                      <span>${amount ? (Number.parseFloat(amount) - 2.5).toFixed(2) : "0.00"}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-amber-500/10 rounded-xl p-4">
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-amber-500 mb-1">Important</p>
                      <p className="text-muted-foreground">
                        Double-check the wallet address and network. Transactions cannot be reversed.
                      </p>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-br from-primary to-secondary hover:opacity-90"
                    size="lg"
                    disabled={!amount || Number.parseFloat(amount) <= 0}
                  >
                    Withdraw ${amount || "0.00"}
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
