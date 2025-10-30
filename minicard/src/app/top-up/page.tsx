"use client"

import { DashboardLayout } from "../../../components/dashboard-layout"
import { Card } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group"
import { ArrowLeft, CreditCardIcon, Wallet, Zap, Smartphone } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function TopUpPage() {
  const [amount, setAmount] = useState("")
  const [source, setSource] = useState("balance")
  const [mpesaPhone, setMpesaPhone] = useState("")

  const kshToUsdtRate = 0.0077 // 1 KSH = 0.0077 USDT (approximate)
  const usdtAmount = source === "mpesa" && amount ? (Number.parseFloat(amount) * kshToUsdtRate).toFixed(2) : amount

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Top-up Card</h1>
            <p className="text-muted-foreground mt-1">Add funds to your virtual card for spending</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-br from-primary via-accent to-secondary p-6 text-primary-foreground">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Virtual Card Balance</p>
                    <p className="text-3xl font-semibold">$1,245.80</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                    <CreditCardIcon className="h-5 w-5" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm opacity-90">Card Number</p>
                  <p className="text-lg font-mono tracking-wider">•••• •••• •••• 4532</p>
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-lg">
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Top-up Amount</h3>
                  <p className="text-sm text-muted-foreground">Choose how much to add to your card</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="topup-amount">{source === "mpesa" ? "Amount (KSH)" : "Amount (USD)"}</Label>
                    <Input
                      id="topup-amount"
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="mt-2 text-2xl font-semibold h-16"
                    />
                    {source === "mpesa" && amount && (
                      <p className="text-sm text-muted-foreground mt-2">≈ {usdtAmount} USDT (earns yield)</p>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {source === "mpesa" ? (
                      <>
                        <Button variant="outline" onClick={() => setAmount("500")}>
                          500 KSH
                        </Button>
                        <Button variant="outline" onClick={() => setAmount("1000")}>
                          1K KSH
                        </Button>
                        <Button variant="outline" onClick={() => setAmount("2000")}>
                          2K KSH
                        </Button>
                        <Button variant="outline" onClick={() => setAmount("5000")}>
                          5K KSH
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" onClick={() => setAmount("25")}>
                          $25
                        </Button>
                        <Button variant="outline" onClick={() => setAmount("50")}>
                          $50
                        </Button>
                        <Button variant="outline" onClick={() => setAmount("100")}>
                          $100
                        </Button>
                        <Button variant="outline" onClick={() => setAmount("250")}>
                          $250
                        </Button>
                      </>
                    )}
                  </div>

                  <div>
                    <Label className="mb-3 block">Top-up Source</Label>
                    <RadioGroup value={source} onValueChange={setSource} className="space-y-3">
                      <div className="flex items-center space-x-3 rounded-xl border border-border p-4 hover:bg-accent transition-colors">
                        <RadioGroupItem value="balance" id="balance" />
                        <Label htmlFor="balance" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                              <Wallet className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">MiniCard Balance</p>
                              <p className="text-xs text-muted-foreground">Available: $18,245.30</p>
                            </div>
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 rounded-xl border border-border p-4 hover:bg-accent transition-colors">
                        <RadioGroupItem value="mpesa" id="mpesa" />
                        <Label htmlFor="mpesa" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600">
                              <Smartphone className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="font-medium">M-Pesa</p>
                              <p className="text-xs text-muted-foreground">KSH → USDT (earns yield)</p>
                            </div>
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 rounded-xl border border-border p-4 hover:bg-accent transition-colors">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-secondary">
                              <CreditCardIcon className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">Debit/Credit Card</p>
                              <p className="text-xs text-muted-foreground">Instant top-up with 2.9% fee</p>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {source === "mpesa" && (
                    <div className="space-y-2">
                      <Label htmlFor="mpesa-phone">M-Pesa Phone Number</Label>
                      <Input
                        id="mpesa-phone"
                        type="tel"
                        placeholder="+254 7XX XXX XXX"
                        value={mpesaPhone}
                        onChange={(e) => setMpesaPhone(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        You'll receive an STK push to complete the payment
                      </p>
                    </div>
                  )}

                  <div className="bg-accent/50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {source === "mpesa" ? "Amount (KSH)" : "Top-up Amount"}
                      </span>
                      <span className="font-medium">
                        {source === "mpesa" ? `${amount || "0.00"} KSH` : `$${amount || "0.00"}`}
                      </span>
                    </div>
                    {source === "mpesa" && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Converted to USDT</span>
                        <span className="font-medium">{usdtAmount} USDT</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Processing Fee</span>
                      <span className="font-medium">
                        {source === "card" && amount ? `$${(Number.parseFloat(amount) * 0.029).toFixed(2)}` : "$0.00"}
                      </span>
                    </div>
                    {source === "mpesa" && (
                      <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 pt-2 border-t border-border">
                        <Zap className="h-3 w-3" />
                        <span>Earns yield when converted to USDT</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-semibold pt-2 border-t border-border">
                      <span>Total</span>
                      <span>
                        {source === "card" && amount
                          ? `$${(Number.parseFloat(amount) * 1.029).toFixed(2)}`
                          : source === "mpesa"
                            ? `${amount || "0.00"} KSH`
                            : `$${amount || "0.00"}`}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-br from-primary to-secondary hover:opacity-90"
                    size="lg"
                    disabled={!amount || Number.parseFloat(amount) <= 0 || (source === "mpesa" && !mpesaPhone)}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    {source === "mpesa" ? `Pay ${amount || "0.00"} KSH via M-Pesa` : `Top-up $${amount || "0.00"}`}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Recent Top-ups</h3>
                <div className="space-y-3">
                  {[
                    { amount: "$100.00", date: "Today, 2:30 PM", source: "Balance" },
                    { amount: "1,000 KSH", date: "Yesterday, 4:15 PM", source: "M-Pesa" },
                    { amount: "$200.00", date: "Dec 8, 10:20 AM", source: "Balance" },
                  ].map((topup, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-accent/50">
                      <div>
                        <p className="font-medium">{topup.amount}</p>
                        <p className="text-xs text-muted-foreground">{topup.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{topup.source}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500/10 to-green-600/10">
              <div className="p-6 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600">
                  <Smartphone className="h-5 w-5 text-white" />
                </div>
                <h4 className="font-semibold">M-Pesa to USDT</h4>
                <p className="text-sm text-muted-foreground">
                  Top-up with M-Pesa and your KSH is automatically converted to USDT. Your balance earns yield and
                  reflects as your card balance in MiniCard.
                </p>
              </div>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/10 to-secondary/10">
              <div className="p-6 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
                  <Zap className="h-5 w-5 text-primary-foreground" />
                </div>
                <h4 className="font-semibold">Instant Top-ups</h4>
                <p className="text-sm text-muted-foreground">
                  Top-up your card instantly from your MiniCard balance with zero fees. Perfect for quick spending.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
