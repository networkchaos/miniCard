"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface WalletContextType {
  address: string | null
  isConnected: boolean
  balance: {
    usdt: string
    usdc: string
    total: string
  }
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState({
    usdt: "0.00",
    usdc: "0.00",
    total: "0.00",
  })

  const isConnected = !!address

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })

        if (accounts.length > 0) {
          setAddress(accounts[0])
          // In production, this would fetch actual USDT/USDC balances from the blockchain
          setBalance({
            usdt: "3,245.80",
            usdc: "3,091.40",
            total: "6,337.20",
          })
        }
      } else {
        alert("Please install MetaMask or another Web3 wallet to connect")
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  const disconnectWallet = () => {
    setAddress(null)
    setBalance({
      usdt: "0.00",
      usdc: "0.00",
      total: "0.00",
    })
  }

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } else if (accounts[0] !== address) {
          setAddress(accounts[0])
        }
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      }
    }
  }, [address])

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected,
        balance,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

declare global {
  interface Window {
    ethereum?: any
  }
}
