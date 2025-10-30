"use client"

import { Card } from "../components/ui/card"
import { Wallet, CreditCard, TrendingUp } from "lucide-react"
import { useBalance } from "../lib/balance-context"
import { useAuth } from "../lib/auth-context"

export function BalanceOverview() {
  const { usdtBalance, cardBalance, yieldEarned } = useBalance()
  const { user } = useAuth()

  const balances = [
    {
      title: "USDT Balance",
      subtitle: "Fiat Balance (Stablecoins)",
      amount: `$${usdtBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: "Earning Yield",
      icon: Wallet,
      gradient: "from-primary to-accent",
    },
    {
      title: "Card Balance",
      subtitle: "Available on Virtual Card",
      amount: `$${cardBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: user?.walletAddress ? "Connected" : "Not Connected",
      icon: CreditCard,
      gradient: "from-accent to-secondary",
    },
    {
      title: "Yield Earned",
      subtitle: "Total Earnings",
      amount: `$${yieldEarned.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: "+8.2% APY",
      icon: TrendingUp,
      gradient: "from-secondary to-primary",
    },
  ]

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {balances.map((balance) => (
        <Card
          key={balance.title}
          className="border-0 shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
        >
          <div className="p-4 sm:p-6">
            <div className="flex items-start justify-between mb-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${balance.gradient} transition-transform duration-300 group-hover:scale-110`}
              >
                <balance.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="text-right">
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">{balance.change}</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">{balance.title}</p>
            <p className="text-xs text-muted-foreground/70 mb-2">{balance.subtitle}</p>
            <p className="text-2xl sm:text-3xl font-semibold tracking-tight">{balance.amount}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
