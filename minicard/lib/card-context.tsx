"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"
import { useBalance } from "./balance-context"
import { StripeCardManager, VirtualCard } from "./stripe-client"
import { db } from "./database"

interface CardContextType {
  card: VirtualCard | null
  hasCard: boolean
  isLoading: boolean
  requestCard: () => Promise<void>
  freezeCard: () => Promise<void>
  unfreezeCard: () => Promise<void>
  refreshCard: () => Promise<void>
  updateBalance: (amount: number) => Promise<void>
}

const CardContext = createContext<CardContextType | undefined>(undefined)

export function CardProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const { usdtBalance } = useBalance()
  const [card, setCard] = useState<VirtualCard | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [stripeManager, setStripeManager] = useState<StripeCardManager | null>(null)

  const hasCard = card !== null && card.status !== "inactive"

  // Initialize Stripe manager
  useEffect(() => {
    if (user?.walletAddress) {
      const manager = new StripeCardManager(user.walletAddress)
      setStripeManager(manager)
    }
  }, [user?.walletAddress])

  const requestCard = async () => {
    if (!stripeManager || !user?.walletAddress) {
      throw new Error("Stripe manager not available or user not authenticated")
    }

    setIsLoading(true)
    try {
      // Create virtual card with current USDT balance
      const virtualCard = await stripeManager.createVirtualCard(user.walletAddress, usdtBalance)
      
      // Save card to database
      await db.upsertUserProfile({
        walletAddress: user.walletAddress,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      })

      // Update card balance in database
      await db.updateCardBalance({
        userId: user.walletAddress,
        cardId: virtualCard.id,
        balance: usdtBalance,
        currency: 'USD',
      })

      setCard(virtualCard)
    } catch (error) {
      console.error("Failed to create card:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const freezeCard = async () => {
    if (!stripeManager || !card) return

    try {
      await stripeManager.toggleCardStatus(card.id, 'inactive')
      setCard({ ...card, status: 'inactive' })
    } catch (error) {
      console.error("Failed to freeze card:", error)
      throw error
    }
  }

  const unfreezeCard = async () => {
    if (!stripeManager || !card) return

    try {
      await stripeManager.toggleCardStatus(card.id, 'active')
      setCard({ ...card, status: 'active' })
    } catch (error) {
      console.error("Failed to unfreeze card:", error)
      throw error
    }
  }

  const updateBalance = async (amount: number) => {
    if (!stripeManager || !card || !user?.walletAddress) return

    try {
      const newBalance = card.balance + amount
      
      // Update Stripe card spending limits
      await stripeManager.updateCardBalance(card.id, newBalance)
      
      // Update database
      await db.updateCardBalance({
        userId: user.walletAddress,
        cardId: card.id,
        balance: newBalance,
        currency: 'USD',
      })

      setCard({ ...card, balance: newBalance })
    } catch (error) {
      console.error("Failed to update card balance:", error)
      throw error
    }
  }

  const refreshCard = async () => {
    if (!stripeManager || !user?.walletAddress) return

    setIsLoading(true)
    try {
      // Get user profile to find card ID
      const userProfile = await db.getUserProfile(user.walletAddress)
      if (userProfile?.virtualCardId) {
        const virtualCard = await stripeManager.getCard(userProfile.virtualCardId)
        if (virtualCard) {
          // Get current balance from database
          const cardBalance = await db.getCardBalance(user.walletAddress, userProfile.virtualCardId)
          if (cardBalance) {
            virtualCard.balance = cardBalance.balance
          }
          setCard(virtualCard)
        }
      }
    } catch (error) {
      console.error("Failed to refresh card:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Sync card balance with USDT balance
  useEffect(() => {
    if (card && usdtBalance !== card.balance) {
      updateBalance(usdtBalance - card.balance)
    }
  }, [usdtBalance])

  // Load card on mount
  useEffect(() => {
    if (isAuthenticated && user?.walletAddress) {
      refreshCard()
    }
  }, [isAuthenticated, user?.walletAddress])

  return (
    <CardContext.Provider
      value={{
        card,
        hasCard,
        isLoading,
        requestCard,
        freezeCard,
        unfreezeCard,
        refreshCard,
        updateBalance,
      }}
    >
      {children}
    </CardContext.Provider>
  )
}

export function useCard() {
  const context = useContext(CardContext)
  if (context === undefined) {
    throw new Error("useCard must be used within a CardProvider")
  }
  return context
}
