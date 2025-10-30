"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"
import { useCard } from "./card-context"
import { ContractManager, CELO_STABLECOINS } from "./contract-utils"
import { ethers } from "ethers"

interface BalanceContextType {
  usdtBalance: number // Stablecoin balance (converted from wallet)
  cardBalance: number // Virtual card balance
  totalBalance: number // Combined balance
  yieldEarned: number // Yield earned on USDT
  contractManager: ContractManager | null
  refreshBalance: () => Promise<void>
  isLoading: boolean
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined)

export function BalanceProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, provider } = useAuth()
  const { card } = useCard()

  const [usdtBalance, setUsdtBalance] = useState(6337.2) // From wallet stablecoins
  const [yieldEarned, setYieldEarned] = useState(127.45) // Yield earned on USDT holdings
  const [contractManager, setContractManager] = useState<ContractManager | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const cardBalance = card?.balance || 0

  // Total balance is USDT + card balance
  const totalBalance = usdtBalance + cardBalance

  const refreshBalance = async () => {
    if (!isAuthenticated || !user?.walletAddress || !contractManager) {
      return
    }

    setIsLoading(true)
    try {
      // Fetch USDT balance from contract
      const usdtBalanceFromContract = await contractManager.getBalance(user.walletAddress, CELO_STABLECOINS.USDT)
      const usdtBalanceNumber = parseFloat(usdtBalanceFromContract)
      setUsdtBalance(usdtBalanceNumber)

      // Calculate yield earned (simplified - in production this would be more complex)
      const yieldAmount = usdtBalanceNumber * 0.02 // Assume 2% yield
      setYieldEarned(yieldAmount)
    } catch (error) {
      console.error("Failed to fetch balance from contract:", error)
      // Keep existing balance on error
    } finally {
      setIsLoading(false)
    }
  }

  // Initialize contract manager when provider is available
  useEffect(() => {
    if (provider && isAuthenticated) {
      try {
        const manager = new ContractManager(provider)
        setContractManager(manager)
      } catch (error) {
        console.error("Failed to initialize contract manager:", error)
      }
    }
  }, [provider, isAuthenticated])

  // Refresh balance when contract manager is available
  useEffect(() => {
    if (contractManager) {
      refreshBalance()
    }
  }, [contractManager])

  return (
    <BalanceContext.Provider
      value={{
        usdtBalance,
        cardBalance,
        totalBalance,
        yieldEarned,
        contractManager,
        refreshBalance,
        isLoading,
      }}
    >
      {children}
    </BalanceContext.Provider>
  )
}

export function useBalance() {
  const context = useContext(BalanceContext)
  if (context === undefined) {
    throw new Error("useBalance must be used within a BalanceProvider")
  }
  return context
}
