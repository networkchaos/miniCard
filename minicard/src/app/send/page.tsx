"use client"

import { Card } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { ArrowLeft, Search, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "../../../lib/auth-context"
import { useSend } from "../../../lib/send-context"

const recentContacts = [
  { name: "Sarah Johnson", email: "sarah@example.com", avatar: "/avatar-1.png", initials: "SJ" },
  { name: "Michael Chen", email: "michael@example.com", avatar: "/avatar-2.png", initials: "MC" },
  { name: "Emma Davis", email: "emma@example.com", avatar: "/avatar-3.png", initials: "ED" },
  { name: "James Wilson", email: "james@example.com", avatar: "/avatar-4.png", initials: "JW" },
]

export default function SendPage() {
  const { isAuthenticated, user } = useAuth()
  const { sendMoney, searchUsers, recentTransactions, isLoading } = useSend()
  const [amount, setAmount] = useState("")
  const [recipient, setRecipient] = useState("")
  const [selectedContact, setSelectedContact] = useState<string | null>(null)
  const [note, setNote] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Mock balance data - in production this would come from your backend
  const balance = {
    total: "6,337.20"
  }

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const results = await searchUsers(query)
      setSearchResults(results)
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSend = async () => {
    if (!amount || !recipient) {
      alert("Please enter amount and recipient")
      return
    }

    try {
      await sendMoney(recipient, parseFloat(amount), note)
      alert("Money sent successfully!")
      setAmount("")
      setRecipient("")
      setNote("")
    } catch (error) {
      console.error("Send failed:", error)
      alert("Failed to send money. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="border-b border-border/50 backdrop-blur-md bg-background/80 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Send Money</h1>
            <p className="text-sm text-muted-foreground mt-1">Send funds to other MiniCard users instantly</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg">
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Send To</h3>
                  <p className="text-sm text-muted-foreground">Enter email, username, or wallet address</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="recipient">Recipient</Label>
                    <div className="relative mt-2">
                      <Input
                        id="recipient"
                        placeholder="email@example.com or @username"
                        value={recipient}
                        onChange={(e) => {
                          setRecipient(e.target.value)
                          handleSearch(e.target.value)
                        }}
                        className="pl-10"
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                    
                    {/* Search Results */}
                    {searchResults.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {searchResults.map((user) => (
                          <button
                            key={user.id}
                            onClick={() => {
                              setRecipient(user.email)
                              setSearchResults([])
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-accent flex items-center gap-3"
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-xs">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="amount">Amount (USD)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="mt-2 text-2xl font-semibold h-16"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Available: ${balance.total}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setAmount("10")}>
                      $10
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setAmount("50")}>
                      $50
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setAmount("100")}>
                      $100
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setAmount("500")}>
                      $500
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor="note">Note (Optional)</Label>
                    <Input
                      id="note"
                      placeholder="What's this for?"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div className="bg-accent/50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Send Amount</span>
                      <span className="font-medium">${amount || "0.00"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Transaction Fee</span>
                      <span className="font-medium text-success">Free</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold pt-2 border-t border-border">
                      <span>Total</span>
                      <span>${amount || "0.00"}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleSend}
                    className="w-full bg-gradient-to-br from-primary to-secondary hover:opacity-90"
                    size="lg"
                    disabled={!amount || !recipient || Number.parseFloat(amount) <= 0 || isLoading}
                  >
                    {isLoading ? "Sending..." : `Send $${amount || "0.00"}`}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Recent Contacts</h3>
                <div className="space-y-3">
                  {recentContacts.map((contact) => (
                    <button
                      key={contact.email}
                      onClick={() => {
                        setRecipient(contact.email)
                        setSelectedContact(contact.email)
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-accent ${
                        selectedContact === contact.email ? "bg-accent" : ""
                      }`}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-sm">
                          {contact.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-sm">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">{contact.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/10 to-secondary/10">
              <div className="p-6 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
                  <User className="h-5 w-5 text-primary-foreground" />
                </div>
                <h4 className="font-semibold">Instant Transfers</h4>
                <p className="text-sm text-muted-foreground">
                  Send money to other MiniCard users instantly with zero fees. Funds arrive in seconds.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
