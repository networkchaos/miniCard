"use client"

import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { ArrowRight, Zap, Shield, Globe, TrendingUp, Lock, Smartphone } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import Image from "next/image"
import { WaitlistModal } from "../../components/waitlist-modal"

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState(false)
  const [showWaitlist, setShowWaitlist] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 backdrop-blur-md bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
              <Smartphone className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              MiniCard
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setShowWaitlist(true)}>
              Get Demo
            </Button>
            <Link href="/request-card">
              <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-balance">
                  The Future of{" "}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Crypto & Fiat
                  </span>{" "}
                  Payments
                </h1>
                <p className="text-xl text-muted-foreground text-balance">
                  Bridge the gap between cryptocurrency and traditional finance. Manage your crypto, earn yield, and
                  spend with a virtual card—all in one place.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/request-card">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 gap-2 w-full sm:w-auto"
                  >
                    Get Your Card <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto bg-transparent"
                  onClick={() => setShowWaitlist(true)}
                >
                  Join Waitlist
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div>
                  <p className="text-2xl font-bold">50K+</p>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">$500M+</p>
                  <p className="text-sm text-muted-foreground">Volume Processed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">24/7</p>
                  <p className="text-sm text-muted-foreground">Support</p>
                </div>
              </div>
            </div>

            {/* Right - Sample Card */}
            <div className="flex items-center justify-center">
              <div
                className="relative w-full max-w-sm"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {/* Card Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />

                {/* Card */}
                <div
                  className={`relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl transition-all duration-500 ${isHovered ? "scale-105 shadow-2xl" : ""}`}
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
                    <p className="text-white text-2xl font-mono tracking-widest">4532 •••• •••• 8901</p>
                  </div>

                  {/* Card Footer */}
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-slate-400 text-xs mb-1">CARDHOLDER</p>
                      <p className="text-white font-semibold">ALEX JOHNSON</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs mb-1">EXPIRES</p>
                      <p className="text-white font-mono">12/26</p>
                    </div>
                  </div>

                  {/* Animated Border */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/50 via-secondary/50 to-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>

                {/* Balance Display */}
                <div className="mt-8 text-center space-y-2">
                  <p className="text-muted-foreground text-sm">Available Balance</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    $18,245.30
                  </p>
                  <p className="text-sm text-muted-foreground">USDT + USDC Stablecoins</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-primary/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose MiniCard?</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to manage crypto and fiat in one platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Instant Transfers",
                description: "Send money to other MiniCard users instantly with zero fees",
              },
              {
                icon: TrendingUp,
                title: "Earn Yield",
                description: "Your stablecoins earn yield automatically while you hold them",
              },
              {
                icon: Shield,
                title: "Bank-Grade Security",
                description: "Military-grade encryption and multi-signature wallets protect your funds",
              },
              {
                icon: Globe,
                title: "Global Payments",
                description: "Use your virtual card anywhere in the world, online and offline",
              },
              {
                icon: Lock,
                title: "Full Control",
                description: "Connect your wallet and maintain complete control of your assets",
              },
              {
                icon: Smartphone,
                title: "Mobile First",
                description: "Manage everything from your phone with our intuitive mobile app",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card/50 backdrop-blur"
              >
                <div className="p-6 space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur">
            <div className="p-12 text-center space-y-6">
              <h2 className="text-4xl font-bold">Ready to Get Started?</h2>
              <p className="text-xl text-muted-foreground">
                Join thousands of users managing crypto and fiat seamlessly
              </p>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 gap-2"
                onClick={() => setShowWaitlist(true)}
              >
                Join Waitlist Now <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto text-center text-muted-foreground">
    <p>&copy; 2025 MiniCard. All rights reserved. Bridging Crypto and Fiat.</p>
  </div>

  <div className="max-w-7xl mx-auto mt-4 flex justify-center">
    <a
      href="https://t.me/miniCardCommunity"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-x-2 text-muted-foreground hover:underline"
    >
      <Image
        src="/telegram.png"
        alt="Telegram"
        width={20}
        height={20}
      />
      Join our Telegram Community
    </a>
  </div>
</footer>

      {/* Waitlist Modal */}
      <WaitlistModal 
        isOpen={showWaitlist} 
        onClose={() => setShowWaitlist(false)} 
      />
    </div>
  )
}
