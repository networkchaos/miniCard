"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"
import { useBalance } from "./balance-context"
import { db } from "./database"
import { CELO_STABLECOINS } from "./contract-utils"

interface SendTransaction {
  id: string
  fromUserId: string
  toUserId: string
  amount: number
  tokenAddress: string
  description?: string
  status: 'pending' | 'completed' | 'failed'
  createdAt: Date
  completedAt?: Date
}

interface SendContextType {
  sendMoney: (toEmail: string, amount: number, description?: string) => Promise<void>
  searchUsers: (query: string) => Promise<any[]>
  recentTransactions: SendTransaction[]
  isLoading: boolean
}

const SendContext = createContext<SendContextType | undefined>(undefined)

export function SendProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const { contractManager, refreshBalance } = useBalance()
  const [recentTransactions, setRecentTransactions] = useState<SendTransaction[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMoney = async (toEmail: string, amount: number, description?: string) => {
    if (!contractManager || !user?.walletAddress) {
      throw new Error("Contract manager not available or user not authenticated")
    }

    setIsLoading(true)
    try {
      // Find recipient by email
      const recipient = await db.getUserByEmail(toEmail)
      if (!recipient) {
        throw new Error("Recipient not found")
      }

      // Check if user has sufficient balance
      const currentBalance = await contractManager.getBalance(user.walletAddress, CELO_STABLECOINS.USDT)
      if (parseFloat(currentBalance) < amount) {
        throw new Error("Insufficient balance")
      }

      // Create transaction record
      const transaction = await db.createTransaction({
        fromUserId: user.walletAddress,
        toUserId: recipient.walletAddress,
        amount,
        tokenAddress: CELO_STABLECOINS.USDT,
        description,
        status: 'pending',
      })

      // In a real implementation, you would:
      // 1. Transfer tokens from sender to recipient
      // 2. Update both users' balances
      // 3. Handle the transaction on-chain

      // For now, we'll simulate the transfer
      console.log(`Sending $${amount} from ${user.walletAddress} to ${recipient.walletAddress}`)

      // Update transaction status
      await db.updateTransactionStatus(transaction.id, 'completed')

      // Refresh sender's balance
      await refreshBalance()

      // Add to recent transactions
      setRecentTransactions(prev => [transaction, ...prev.slice(0, 9)])

    } catch (error) {
      console.error("Failed to send money:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const searchUsers = async (query: string): Promise<any[]> => {
    if (!query.trim()) return []

    try {
      const users = await db.searchUsers(query)
      return users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        walletAddress: user.walletAddress,
      }))
    } catch (error) {
      console.error("Failed to search users:", error)
      return []
    }
  }

  // Load recent transactions
  useEffect(() => {
    if (isAuthenticated && user?.walletAddress) {
      loadRecentTransactions()
    }
  }, [isAuthenticated, user?.walletAddress])

  const loadRecentTransactions = async () => {
    try {
      // In a real implementation, you would fetch from the database
      const mockTransactions: SendTransaction[] = [
        {
          id: '1',
          fromUserId: user?.walletAddress || '',
          toUserId: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
          amount: 100,
          tokenAddress: CELO_STABLECOINS.USDT,
          description: 'Payment for services',
          status: 'completed',
          createdAt: new Date(Date.now() - 86400000), // 1 day ago
          completedAt: new Date(Date.now() - 86400000),
        },
        {
          id: '2',
          fromUserId: user?.walletAddress || '',
          toUserId: '0x48065fbBE25f136C7fBe8d5b44E9B24096aDb6c4',
          amount: 50,
          tokenAddress: CELO_STABLECOINS.USDT,
          description: 'Split bill',
          status: 'completed',
          createdAt: new Date(Date.now() - 172800000), // 2 days ago
          completedAt: new Date(Date.now() - 172800000),
        },
      ]
      setRecentTransactions(mockTransactions)
    } catch (error) {
      console.error("Failed to load recent transactions:", error)
    }
  }

  return (
    <SendContext.Provider
      value={{
        sendMoney,
        searchUsers,
        recentTransactions,
        isLoading,
      }}
    >
      {children}
    </SendContext.Provider>
  )
}

export function useSend() {
  const context = useContext(SendContext)
  if (context === undefined) {
    throw new Error("useSend must be used within a SendProvider")
  }
  return context
}
