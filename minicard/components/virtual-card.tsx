"use client"

import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Eye, EyeOff, Copy, Lock, Unlock, CreditCard, ArrowRight, Zap } from "lucide-react"
import { useState } from "react"
import { useCard } from "../lib/card-context"
import Link from "next/link"

export function VirtualCard() {
  const [showDetails, setShowDetails] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { card, hasCard, freezeCard, unfreezeCard, isLoading } = useCard()
  const isFrozen = card?.status === "inactive"

  if (!hasCard) {
    return (
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="p-6 sm:p-8">
          <div className="text-center max-w-md mx-auto space-y-6">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <CreditCard className="h-10 w-10 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Get Your MiniCard</h2>
              <p className="text-muted-foreground">
                Request your virtual card to start making payments online and locally with your crypto and fiat balance.
              </p>
            </div>
            <Link href="/request-card">
              <Button
                size="lg"
                className="bg-gradient-to-br from-primary to-secondary hover:opacity-90 transition-opacity w-full gap-2"
              >
                Request Card Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Your MiniCard</h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showDetails ? "Hide" : "Show"}
          </Button>
          <Link href="/card">
            <Button variant="ghost" size="sm">
              Manage
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      <div
        className="relative w-full max-w-2xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Card Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />

        {/* Card */}
        <div
          className={`relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-500 ${isHovered ? "scale-105 shadow-2xl" : ""}`}
        >
          {/* Card Header */}
          <div className="flex justify-between items-start mb-12">
            <div>
              <p className="text-slate-400 text-sm mb-1">MINICARD</p>
              <p className="text-white font-semibold">Virtual Card</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
              <Zap className="h-6 w-6 text-white" />
            </div>
          </div>

          {/* Card Number */}
          <div className="mb-8">
            <p className="text-slate-400 text-xs mb-2">CARD NUMBER</p>
            <p className="text-white text-2xl font-mono tracking-widest">
              {showDetails ? `4532 1234 5678 ${card.lastFour}` : `•••• •••• •••• ${card.lastFour}`}
            </p>
          </div>

          {/* Card Footer */}
          <div className="flex justify-between items-end">
            <div>
              <p className="text-slate-400 text-xs mb-1">CARDHOLDER</p>
              <p className="text-white font-semibold">ALEX MORGAN</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-1">EXPIRES</p>
              <p className="text-white font-mono">
                {showDetails ? `${card.expiryMonth.toString().padStart(2, '0')}/${card.expiryYear.toString().slice(-2)}` : "••/••"}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-1">CVV</p>
              <p className="text-white font-mono">{showDetails ? "123" : "•••"}</p>
            </div>
          </div>

          {/* Visa logo */}
          <div className="absolute top-6 sm:top-8 right-6 sm:right-8 z-10">
            <div className="text-lg sm:text-xl font-bold tracking-wider text-white">VISA</div>
          </div>

          {/* Animated Border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/50 via-secondary/50 to-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Frozen overlay */}
          {isFrozen && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-3xl backdrop-blur-sm z-20">
              <div className="text-center">
                <Lock className="h-12 w-12 mx-auto mb-2 text-white" />
                <p className="text-white font-semibold">Card Frozen</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" className="flex-1 gap-2 bg-transparent">
          <Copy className="h-4 w-4" />
          Copy Number
        </Button>
        <Button
          variant="outline"
          className="flex-1 gap-2 bg-transparent"
          onClick={isFrozen ? unfreezeCard : freezeCard}
        >
          {isFrozen ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
          {isFrozen ? "Unfreeze" : "Freeze"} Card
        </Button>
      </div>
    </div>
  )
}
