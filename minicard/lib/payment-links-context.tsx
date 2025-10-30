"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"
import { useBalance } from "./balance-context"
import { db, PaymentLink, hashSecret } from "./database"
import { CELO_STABLECOINS } from "./contract-utils"

interface PaymentLinksContextType {
  createPaymentLink: (data: {
    tokenAddress: string
    amount: string
    secret: string
    expiry: Date
    fiatAmount?: number
    fiatCurrency?: string
    onRamp?: boolean
    offRamp?: boolean
  }) => Promise<PaymentLink>
  getPaymentLink: (id: string) => Promise<PaymentLink | null>
  claimPaymentLink: (id: string, secret: string) => Promise<boolean>
  getUserPaymentLinks: () => Promise<PaymentLink[]>
  isLoading: boolean
  paymentLinks: PaymentLink[]
}

const PaymentLinksContext = createContext<PaymentLinksContextType | undefined>(undefined)

export function PaymentLinksProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const { contractManager } = useBalance()
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const createPaymentLink = async (data: {
    tokenAddress: string
    amount: string
    secret: string
    expiry: Date
    fiatAmount?: number
    fiatCurrency?: string
    onRamp?: boolean
    offRamp?: boolean
  }): Promise<PaymentLink> => {
    if (!user?.walletAddress) {
      throw new Error("User not authenticated")
    }

    setIsLoading(true)
    try {
      // Check if user has sufficient balance (for off-ramp links)
      if (data.offRamp) {
        const currentBalance = await contractManager?.getBalance(user.walletAddress, data.tokenAddress)
        if (!currentBalance || parseFloat(currentBalance) < parseFloat(data.amount)) {
          throw new Error("Insufficient balance for payment link")
        }
      }

      // Create payment link in database
      const paymentLink = await db.createPaymentLink({
        creatorId: user.walletAddress,
        tokenAddress: data.tokenAddress,
        amount: data.amount,
        secretHash: hashSecret(data.secret),
        expiry: data.expiry,
        fiatAmount: data.fiatAmount,
        fiatCurrency: data.fiatCurrency,
        onRamp: data.onRamp || false,
        offRamp: data.offRamp || false,
      })

      // If it's an off-ramp link, lock the funds in the contract
      if (data.offRamp && contractManager) {
        // In a real implementation, you would lock the funds in the vault contract
        console.log(`Locking ${data.amount} ${data.tokenAddress} for payment link ${paymentLink.id}`)
      }

      // Refresh payment links
      await getUserPaymentLinks()

      return paymentLink
    } catch (error) {
      console.error("Failed to create payment link:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const getPaymentLink = async (id: string): Promise<PaymentLink | null> => {
    try {
      return await db.getPaymentLink(id)
    } catch (error) {
      console.error("Failed to get payment link:", error)
      return null
    }
  }

  const claimPaymentLink = async (id: string, secret: string): Promise<boolean> => {
    if (!user?.walletAddress) {
      throw new Error("User not authenticated")
    }

    try {
      // Get payment link
      const paymentLink = await db.getPaymentLink(id)
      if (!paymentLink) {
        throw new Error("Payment link not found")
      }

      // Check if link is expired
      if (new Date() > paymentLink.expiry) {
        throw new Error("Payment link has expired")
      }

      // Check if link is already claimed
      if (paymentLink.claimed) {
        throw new Error("Payment link already claimed")
      }

      // Verify secret
      if (hashSecret(secret) !== paymentLink.secretHash) {
        throw new Error("Invalid secret")
      }

      // Claim the payment link
      const success = await db.claimPaymentLink(id, user.walletAddress)
      if (!success) {
        throw new Error("Failed to claim payment link")
      }

      // If it's an on-ramp link, credit the user's account
      if (paymentLink.onRamp && contractManager) {
        // In a real implementation, you would credit the user's account
        console.log(`Crediting ${paymentLink.amount} ${paymentLink.tokenAddress} to ${user.walletAddress}`)
      }

      // If it's an off-ramp link, transfer funds to the claimer
      if (paymentLink.offRamp && contractManager) {
        // In a real implementation, you would transfer funds from the locked amount
        console.log(`Transferring ${paymentLink.amount} ${paymentLink.tokenAddress} to ${user.walletAddress}`)
      }

      // Refresh payment links
      await getUserPaymentLinks()

      return true
    } catch (error) {
      console.error("Failed to claim payment link:", error)
      throw error
    }
  }

  const getUserPaymentLinks = async (): Promise<PaymentLink[]> => {
    if (!user?.walletAddress) return []

    try {
      const links = await db.getUserPaymentLinks(user.walletAddress)
      setPaymentLinks(links)
      return links
    } catch (error) {
      console.error("Failed to get user payment links:", error)
      return []
    }
  }

  // Load payment links on mount
  useEffect(() => {
    if (isAuthenticated && user?.walletAddress) {
      getUserPaymentLinks()
    }
  }, [isAuthenticated, user?.walletAddress])

  return (
    <PaymentLinksContext.Provider
      value={{
        createPaymentLink,
        getPaymentLink,
        claimPaymentLink,
        getUserPaymentLinks,
        isLoading,
        paymentLinks,
      }}
    >
      {children}
    </PaymentLinksContext.Provider>
  )
}

export function usePaymentLinks() {
  const context = useContext(PaymentLinksContext)
  if (context === undefined) {
    throw new Error("usePaymentLinks must be used within a PaymentLinksProvider")
  }
  return context
}
