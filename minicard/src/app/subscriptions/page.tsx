"use client"

import { DashboardLayout } from "../../../components/dashboard-layout"
import { Card } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Badge } from "../../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { ArrowLeft, Plus, Calendar, DollarSign, Repeat, Trash2, Pause, Play } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useSubscription } from "../../../lib/subscription-context"

export default function SubscriptionsPage() {
  const { subscriptions, createSubscription, cancelSubscription, isLoading } = useSubscription()
  const [showNewSubscription, setShowNewSubscription] = useState(false)

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Subscriptions</h1>
              <p className="text-muted-foreground mt-1">Manage your recurring payments</p>
            </div>
          </div>
          <Button
            className="bg-gradient-to-br from-primary to-secondary hover:opacity-90"
            onClick={() => setShowNewSubscription(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Subscription
          </Button>
        </div>

        {showNewSubscription && (
          <Card className="border-0 shadow-lg">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Create New Subscription</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowNewSubscription(false)}>
                  Cancel
                </Button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sub-name">Subscription Name</Label>
                  <Input id="sub-name" placeholder="e.g., Netflix, Spotify" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sub-amount">Amount (USD)</Label>
                  <Input id="sub-amount" type="number" placeholder="0.00" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sub-frequency">Payment Frequency</Label>
                  <Select defaultValue="monthly">
                    <SelectTrigger id="sub-frequency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sub-start">Start Date</Label>
                  <Input id="sub-start" type="date" />
                </div>
              </div>

              <div className="bg-accent/50 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Repeat className="h-4 w-4" />
                  <span>Auto-pay will be enabled for this subscription</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Payments will be automatically deducted from your MiniCard balance on the scheduled date.
                </p>
              </div>

              <Button className="w-full bg-gradient-to-br from-primary to-secondary hover:opacity-90" size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Create Subscription
              </Button>
            </div>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/10 to-secondary/10">
            <div className="p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
                <DollarSign className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Total</p>
                <p className="text-2xl font-semibold">$87.97</p>
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-accent/10 to-secondary/10">
            <div className="p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-secondary">
                <Repeat className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                <p className="text-2xl font-semibold">3</p>
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-secondary/10 to-primary/10">
            <div className="p-6 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-secondary to-primary">
                <Calendar className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Next Payment</p>
                <p className="text-2xl font-semibold">Jan 10</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Your Subscriptions</h3>
          <div className="space-y-3">
            {subscriptions.map((sub) => (
              <Card key={sub.id} className="border-0 shadow-lg">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
                        <Repeat className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{sub.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          ${sub.amount} • {sub.frequency}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right mr-4">
                        <p className="text-sm text-muted-foreground">Next payment</p>
                        <p className="text-sm font-medium">{sub.nextPayment}</p>
                      </div>
                      <Badge variant={sub.status === "active" ? "default" : "secondary"}>{sub.status}</Badge>
                      <Button variant="ghost" size="icon">
                        {sub.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
