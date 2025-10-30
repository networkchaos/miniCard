"use client"

import { DashboardLayout } from "../../../components/dashboard-layout"
import { Card } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Badge } from "../../../components/ui/badge"
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Send,
  Search,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import { useState } from "react"

const allTransactions = [
  {
    id: "1",
    type: "received",
    description: "Payment from Sarah Johnson",
    amount: "+$250.00",
    date: "Today, 2:30 PM",
    status: "completed",
    category: "received",
  },
  {
    id: "2",
    type: "sent",
    description: "Sent to Michael Chen",
    amount: "-$75.50",
    date: "Today, 11:15 AM",
    status: "completed",
    category: "sent",
  },
  {
    id: "3",
    type: "deposit",
    description: "Card Deposit",
    amount: "+$500.00",
    date: "Yesterday, 4:20 PM",
    status: "completed",
    category: "deposit",
  },
  {
    id: "4",
    type: "withdraw",
    description: "Bank Withdrawal",
    amount: "-$1,000.00",
    date: "Dec 8, 10:30 AM",
    status: "pending",
    category: "withdraw",
  },
  {
    id: "5",
    type: "topup",
    description: "Card Top-up",
    amount: "-$100.00",
    date: "Dec 7, 3:45 PM",
    status: "completed",
    category: "topup",
  },
  {
    id: "6",
    type: "received",
    description: "Payment from Emma Davis",
    amount: "+$180.00",
    date: "Dec 6, 1:20 PM",
    status: "completed",
    category: "received",
  },
  {
    id: "7",
    type: "sent",
    description: "Sent to James Wilson",
    amount: "-$45.00",
    date: "Dec 5, 9:10 AM",
    status: "completed",
    category: "sent",
  },
  {
    id: "8",
    type: "deposit",
    description: "Crypto Deposit (USDT)",
    amount: "+$2,500.00",
    date: "Dec 4, 5:30 PM",
    status: "completed",
    category: "deposit",
  },
]

export default function TransfersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredTransactions = allTransactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === "all" || transaction.category === activeTab
    return matchesSearch && matchesTab
  })

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "received":
        return <ArrowDownToLine className="h-5 w-5 text-success" />
      case "sent":
        return <Send className="h-5 w-5 text-muted-foreground" />
      case "deposit":
        return <TrendingUp className="h-5 w-5 text-success" />
      case "withdraw":
        return <TrendingDown className="h-5 w-5 text-destructive" />
      case "topup":
        return <ArrowUpFromLine className="h-5 w-5 text-primary" />
      default:
        return <ArrowDownToLine className="h-5 w-5" />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Transfers</h1>
            <p className="text-muted-foreground mt-1">View and manage all your transactions</p>
          </div>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-0 shadow-lg">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-success/20 to-success/10">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <p className="text-sm text-muted-foreground">Total Received</p>
              </div>
              <p className="text-2xl font-semibold">$3,430.00</p>
              <p className="text-xs text-success mt-1">+12.5% from last month</p>
            </div>
          </Card>

          <Card className="border-0 shadow-lg">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-destructive/20 to-destructive/10">
                  <TrendingDown className="h-5 w-5 text-destructive" />
                </div>
                <p className="text-sm text-muted-foreground">Total Sent</p>
              </div>
              <p className="text-2xl font-semibold">$1,220.50</p>
              <p className="text-xs text-muted-foreground mt-1">8 transactions</p>
            </div>
          </Card>

          <Card className="border-0 shadow-lg">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
                  <ArrowDownToLine className="h-5 w-5 text-primary-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Net Balance</p>
              </div>
              <p className="text-2xl font-semibold">+$2,209.50</p>
              <p className="text-xs text-success mt-1">Positive flow</p>
            </div>
          </Card>
        </div>

        <Card className="border-0 shadow-lg">
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="received">Received</TabsTrigger>
                <TabsTrigger value="sent">Sent</TabsTrigger>
                <TabsTrigger value="deposit">Deposits</TabsTrigger>
                <TabsTrigger value="withdraw">Withdrawals</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-3 mt-6">
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No transactions found</p>
                  </div>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-semibold ${
                            transaction.amount.startsWith("+") ? "text-success" : "text-foreground"
                          }`}
                        >
                          {transaction.amount}
                        </p>
                        <Badge variant={transaction.status === "completed" ? "default" : "secondary"} className="mt-1">
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
