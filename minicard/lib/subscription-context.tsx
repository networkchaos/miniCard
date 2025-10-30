"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"
import { useBalance } from "./balance-context"

interface Subscription {
  id: number
  subscriber: string
  merchant: string
  stable: string
  amount: string
  period: number
  nextDue: number
  active: boolean
}

interface SubscriptionContextType {
  subscriptions: Subscription[]
  isLoading: boolean
  createSubscription: (merchant: string, token: string, amount: string, period: number) => Promise<void>
  cancelSubscription: (id: number) => Promise<void>
  refreshSubscriptions: () => Promise<void>
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const { contractManager } = useBalance()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const createSubscription = async (merchant: string, token: string, amount: string, period: number) => {
    if (!contractManager || !user?.walletAddress) {
      throw new Error("Contract manager not available")
    }

    try {
      await contractManager.createSubscription(merchant, token, amount, period)
      await refreshSubscriptions()
    } catch (error) {
      console.error("Failed to create subscription:", error)
      throw error
    }
  }

  const cancelSubscription = async (id: number) => {
    if (!contractManager) {
      throw new Error("Contract manager not available")
    }

    try {
      await contractManager.cancelSubscription(id)
      await refreshSubscriptions()
    } catch (error) {
      console.error("Failed to cancel subscription:", error)
      throw error
    }
  }

  const refreshSubscriptions = async () => {
    if (!isAuthenticated || !user?.walletAddress) {
      setSubscriptions([])
      return
    }

    setIsLoading(true)
    try {
      // In a real implementation, you would fetch from the contract
      // For now, we'll use mock data
      const mockSubscriptions: Subscription[] = [
        {
          id: 1,
          subscriber: user.walletAddress,
          merchant: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
          stable: "0xcebA9300F2b948710d2653dD7B07f33A8B32118C",
          amount: "100.00",
          period: 2592000, // 30 days
          nextDue: Math.floor(Date.now() / 1000) + 2592000,
          active: true,
        },
        {
          id: 2,
          subscriber: user.walletAddress,
          merchant: "0x48065fbBE25f136C7fBe8d5b44E9B24096aDb6c4",
          stable: "0x48065fbBE25f136C7fBe8d5b44E9B24096aDb6c4",
          amount: "50.00",
          period: 604800, // 7 days
          nextDue: Math.floor(Date.now() / 1000) + 604800,
          active: true,
        },
      ]
      setSubscriptions(mockSubscriptions)
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      refreshSubscriptions()
    }
  }, [isAuthenticated, user?.walletAddress])

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions,
        isLoading,
        createSubscription,
        cancelSubscription,
        refreshSubscriptions,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider")
  }
  return context
}
