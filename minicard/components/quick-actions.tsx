"use client"

import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { ArrowDownToLine, ArrowUpFromLine, Send, Plus, Link2 } from "lucide-react"
import Link from "next/link"

const actions = [
  {
    name: "Deposit",
    icon: ArrowDownToLine,
    description: "Add funds to your wallet",
    gradient: "from-primary to-accent",
    href: "/deposit",
  },
  {
    name: "Withdraw",
    icon: ArrowUpFromLine,
    description: "Transfer to bank account",
    gradient: "from-accent to-secondary",
    href: "/withdraw",
  },
  {
    name: "Send",
    icon: Send,
    description: "Send to another user",
    gradient: "from-secondary to-primary",
    href: "/send",
  },
  {
    name: "Top-up",
    icon: Plus,
    description: "Add to card balance",
    gradient: "from-primary to-secondary",
    href: "/top-up",
  },
  {
    name: "Payment Links",
    icon: Link2,
    description: "Create claimable links",
    gradient: "from-accent to-primary",
    href: "/payment-links",
  },
]

export function QuickActions() {
  return (
    <Card className="border-0 shadow-lg">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
        <div className="space-y-3">
          {actions.map((action) => (
            <Link key={action.name} href={action.href}>
              <Button
                variant="outline"
                className="w-full justify-start gap-4 h-auto p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-md group bg-transparent"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient} transition-transform duration-200 group-hover:scale-110`}
                >
                  <action.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">{action.name}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </Card>
  )
}
