"use client"

import { cn } from "../lib/utils"
import { Button } from "./ui/button"
import { CreditCard, Home, ArrowLeftRight, Repeat, Settings, X, Link2, Plus } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "My Card", href: "/card", icon: CreditCard },
  { name: "Transfers", href: "/transfers", icon: ArrowLeftRight },
  { name: "Subscriptions", href: "/subscriptions", icon: Repeat },
  { name: "Payment Links", href: "/payment-links", icon: Link2 },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile backdrop */}
      {open && <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform border-r border-border bg-card transition-transform duration-300 ease-in-out lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-border">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
                <CreditCard className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                MiniCard
              </span>
            </Link>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 transition-all duration-200",
                      isActive && "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-medium",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4 space-y-3">
            <Link href="/request-card" className="block">
              <Button size="sm" className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 gap-2">
                <Plus className="h-4 w-4" />
                Get Card
              </Button>
            </Link>
            <div className="rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
              <p className="text-sm font-medium mb-1">Upgrade to Pro</p>
              <p className="text-xs text-muted-foreground mb-3">Unlock premium features and higher limits</p>
              <Button size="sm" className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
