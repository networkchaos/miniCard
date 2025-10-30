"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card } from "./ui/card"
import { X, Mail, CheckCircle, Loader2, Zap } from "lucide-react"
import { useWaitlist } from "../lib/waitlist-context"

interface WaitlistModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const { joinWaitlist, isLoading, isJoined } = useWaitlist()
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("Email is required")
      return
    }

    const result = await joinWaitlist(email, name)
    
    if (result.success) {
      // Success is handled by the context
    } else {
      setError(result.message)
    }
  }

  const handleClose = () => {
    setEmail("")
    setName("")
    setError("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Join the Waitlist</h2>
                <p className="text-sm text-muted-foreground">Get early access to MiniCard</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {isJoined ? (
            /* Success State */
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-600">Welcome to the Waitlist!</h3>
                <p className="text-muted-foreground">
                  Check your email for confirmation and updates about MiniCard's launch.
                </p>
              </div>
              <div className="bg-accent/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  <strong>What's next?</strong><br />
                  • Early access to MiniCard<br />
                  • Exclusive updates and features<br />
                  • Priority support when we launch
                </p>
              </div>
              <Button onClick={handleClose} className="w-full">
                Close
              </Button>
            </div>
          ) : (
            /* Signup Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name (Optional)</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || !email}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Joining Waitlist...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Join Waitlist
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By joining, you agree to receive updates about MiniCard's launch.
              </p>
            </form>
          )}
        </div>
      </Card>
    </div>
  )
}
