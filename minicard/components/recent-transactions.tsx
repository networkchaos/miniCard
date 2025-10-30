"use client"

import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { ArrowDownLeft, ShoppingBag, Zap } from "lucide-react"

const transactions = [
  {
    id: 1,
    type: "expense",
    title: "Amazon Purchase",
    category: "Shopping",
    amount: -156.99,
    date: "Today, 2:30 PM",
    icon: ShoppingBag,
    status: "completed",
  },
  {
    id: 2,
    type: "income",
    title: "Crypto Deposit",
    category: "Deposit",
    amount: 2500.0,
    date: "Today, 10:15 AM",
    icon: ArrowDownLeft,
    status: "completed",
  },
  {
    id: 3,
    type: "expense",
    title: "Netflix Subscription",
    category: "Entertainment",
    amount: -15.99,
    date: "Yesterday, 6:00 PM",
    icon: Zap,
    status: "completed",
  },
  {
    id: 4,
    type: "expense",
    title: "Starbucks",
    category: "Food & Drink",
    amount: -8.5,
    date: "Yesterday, 8:30 AM",
    icon: ShoppingBag,
    status: "completed",
  },
  {
    id: 5,
    type: "income",
    title: "Bank Transfer",
    category: "Transfer",
    amount: 1000.0,
    date: "2 days ago",
    icon: ArrowDownLeft,
    status: "completed",
  },
]

export function RecentTransactions() {
  return (
    <Card className="border-0 shadow-lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
          <button className="text-sm text-primary hover:underline">View All</button>
        </div>

        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors duration-200 cursor-pointer"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  transaction.type === "income" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                }`}
              >
                <transaction.icon className="h-5 w-5" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{transaction.title}</p>
                <p className="text-sm text-muted-foreground">{transaction.date}</p>
              </div>

              <div className="text-right">
                <p className={`font-semibold ${transaction.type === "income" ? "text-success" : "text-foreground"}`}>
                  {transaction.type === "income" ? "+" : ""}
                  {transaction.amount.toFixed(2)} USD
                </p>
                <Badge variant="secondary" className="text-xs mt-1">
                  {transaction.category}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
