"use client"

import { Menu, Bell, LogOut, Wallet } from "lucide-react"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { useAuth } from "../lib/auth-context"
import { useBalance } from "../lib/balance-context"
import { useState } from "react"

interface TopNavProps {
  onMenuClick: () => void
}

const notifications = [
  {
    id: 1,
    title: "Payment Received",
    message: "$250.00 from John Doe",
    time: "2 min ago",
    unread: true,
  },
  {
    id: 2,
    title: "Card Top-up Successful",
    message: "Your card has been topped up with $500",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    title: "Subscription Payment",
    message: "Netflix subscription paid - $15.99",
    time: "3 hours ago",
    unread: true,
  },
]

export function TopNav({ onMenuClick }: TopNavProps) {
  const { user, isAuthenticated, signInWithGoogle, signOut, connectWallet, disconnectWallet, switchAccount } = useAuth()
  const { totalBalance } = useBalance()
  const [unreadCount, setUnreadCount] = useState(3)
  const [isConnecting, setIsConnecting] = useState(false)

  const handleMarkAllRead = () => {
    setUnreadCount(0)
  }

  const handleConnectWallet = async () => {
    setIsConnecting(true)
    try {
      await connectWallet()
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnectWallet = async () => {
    try {
      await disconnectWallet()
    } catch (error) {
      console.error("Failed to disconnect wallet:", error)
    }
  }

  const handleSwitchAccount = async () => {
    setIsConnecting(true)
    try {
      await switchAccount()
    } catch (error) {
      console.error("Failed to switch account:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>

          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-primary to-secondary px-4 py-2">
                <span className="text-sm font-medium text-primary-foreground">Total Balance</span>
                <span className="text-lg font-semibold text-primary-foreground">
                  ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            ) : (
              <Button
                onClick={signInWithGoogle}
                className="bg-gradient-to-br from-primary to-secondary hover:opacity-90 transition-opacity"
              >
                Sign in with Google
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-destructive text-destructive-foreground text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold">Notifications</h3>
                <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
                  Mark all read
                </Button>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b hover:bg-muted/50 cursor-pointer transition-colors ${
                      notification.unread ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                      </div>
                      {notification.unread && <div className="h-2 w-2 rounded-full bg-primary mt-1" />}
                    </div>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <div className="flex items-center gap-3 pl-3 border-l border-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-3 px-2">
                  <div className="hidden md:block text-right">
                    {isAuthenticated ? (
                      <>
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-medium">Guest</p>
                        <p className="text-xs text-muted-foreground">Sign in to continue</p>
                      </>
                    )}
                  </div>
                  <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                      {user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "G"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAuthenticated ? (
                  <>
                    {user?.walletAddress ? (
                      <>
                        <DropdownMenuItem className="flex flex-col items-start">
                          <span className="text-xs text-muted-foreground">Wallet Connected</span>
                          <span className="font-mono text-xs">
                            {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={handleSwitchAccount}
                          disabled={isConnecting}
                        >
                          <Wallet className="mr-2 h-4 w-4" />
                          {isConnecting ? "Switching..." : "Switch Account"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDisconnectWallet}>
                          <Wallet className="mr-2 h-4 w-4" />
                          Disconnect Wallet
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <DropdownMenuItem 
                        onClick={handleConnectWallet}
                        disabled={isConnecting}
                      >
                        <Wallet className="mr-2 h-4 w-4" />
                        {isConnecting ? "Connecting..." : "Connect Wallet"}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={signInWithGoogle}>Sign in with Google</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
