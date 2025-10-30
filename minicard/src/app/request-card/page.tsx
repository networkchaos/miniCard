"use client"

import type React from "react"

import { DashboardLayout } from "../../../components/dashboard-layout"
import { Card } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { ArrowLeft, CheckCircle2, CreditCard, Zap } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "../../../lib/auth-context"
import { useCard } from "../../../lib/card-context"

export default function RequestCardPage() {
  const { user } = useAuth()
  const { requestCard, isLoading } = useCard()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    country: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    try {
      await requestCard()
      setStep(3)
    } catch (error) {
      console.error("Error requesting card:", error)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {step === 1 && (
          <div className="max-w-2xl space-y-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">Get Your MiniCard</h1>
              <p className="text-lg text-muted-foreground">Your premium virtual card for crypto and fiat payments</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Zap className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold">Instant Activation</h3>
                </div>
                <p className="text-sm text-muted-foreground">Get your virtual card immediately after approval</p>
              </Card>

              <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold">Global Payments</h3>
                </div>
                <p className="text-sm text-muted-foreground">Use your card anywhere online and in-store worldwide</p>
              </Card>

              <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold">Secure & Safe</h3>
                </div>
                <p className="text-sm text-muted-foreground">Bank-level security with fraud protection</p>
              </Card>
            </div>

            <Button
              size="lg"
              onClick={() => setStep(2)}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
            >
              Continue to Application
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-2xl space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">Application Details</h1>
              <p className="text-muted-foreground">Please provide your information to complete your card request</p>
            </div>

            <Card className="p-8 border-0 shadow-lg space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name</label>
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Alex Morgan"
                    className="bg-background"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="alex@example.com"
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium mb-2 block">Phone Number</label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    className="bg-background"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Country</label>
                  <Input
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="United States"
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium mb-2 block">City</label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="San Francisco"
                    className="bg-background"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Address</label>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main St"
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                  {loading ? "Processing..." : "Submit Application"}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-2xl mx-auto">
            <Card className="p-12 border-0 shadow-lg text-center space-y-6">
              <div className="flex justify-center">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-pulse">
                  <CheckCircle2 className="h-10 w-10 text-primary-foreground" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">Application Submitted!</h2>
                <p className="text-muted-foreground text-lg">
                  Your card request has been received. We'll review it and send you an email within 24 hours.
                </p>
              </div>
              <Link href="/">
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                  Return to Dashboard
                </Button>
              </Link>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
