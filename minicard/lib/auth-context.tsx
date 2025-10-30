// lib/auth-context.tsx
"use client"

import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { getWeb3Auth } from "./web3auth-client"
import type { Web3Auth } from "@web3auth/modal"
import { ethers } from "ethers"


type User = {
  email: string
  name: string
  avatar?: string
  walletAddress?: string
  // other fields from web3auth getUserInfo if desired
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  switchAccount: () => Promise<void>
  web3auth?: Web3Auth | null
  provider?: ethers.providers.Web3Provider | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const SESSION_KEY = "minicard_session" // stored in sessionStorage -> cleared when tab is closed

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null)
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)

  const isAuthenticated = !!user

  // Restore session from sessionStorage (same tab / reload)
  useEffect(() => {
    const restore = async () => {
      try {
        const raw = sessionStorage.getItem(SESSION_KEY)
        if (!raw) return

        // session contains a minimal flag that user was logged-in and walletAddress if any
        const session = JSON.parse(raw)
        const w3a = await getWeb3Auth()
        setWeb3auth(w3a)

        if (w3a.provider && session?.walletConnected) {
          const web3Provider = new ethers.providers.Web3Provider(w3a.provider as any)
          setProvider(web3Provider)
          const accounts = await web3Provider.listAccounts()
          setUser({
            email: session.user.email,
            name: session.user.name,
            avatar: session.user.avatar,
            walletAddress: accounts[0],
          })
          return
        }

        // If not connected via Web3Auth but session has user info (maybe user signed in but didn't connect wallet)
        if (session?.user) {
          setUser(session.user)
        }
      } catch (err) {
        console.warn("Failed to restore session:", err)
      }
    }
    restore()
  }, [])

  // Save session to sessionStorage whenever user changes
  useEffect(() => {
    if (user) {
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          user: { email: user.email, name: user.name, avatar: user.avatar },
          walletConnected: !!user.walletAddress,
        })
      )
    } else {
      sessionStorage.removeItem(SESSION_KEY)
    }
  }, [user])

  // signInWithGoogle -> use Web3Auth modal with Google as social provider (Web3Auth handles the OAuth)
  const signInWithGoogle = async () => {
    try {
      const w3a = await getWeb3Auth()
      setWeb3auth(w3a)

      // opens modal -> choose Google provider in modal
      const web3authProvider = await w3a.connect()
      if (!web3authProvider) {
        throw new Error("User closed the web3auth modal")
      }

      // get user info from Web3Auth (contains email, name, profileImage, etc.)
      // @ts-ignore
      const userInfo = await w3a.getUserInfo()
      const newUser: User = {
        email: userInfo?.email ?? "unknown",
        name: `${userInfo?.name ?? "User"}`,
        avatar: userInfo?.profileImage ?? "/placeholder.svg",
      }

      // at sign-in we might not have a wallet yet until they connect; still persist user
      setUser(newUser)
      // session saved via effect
    } catch (error) {
      console.error("signInWithGoogle error:", error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      // Disconnect wallet first
      if (provider) {
        // For Web3Auth, the logout will handle provider disconnection
        // For MetaMask, we just clear the local state
        setProvider(null)
      }
      
      // Sign out from Web3Auth (this will disconnect both Google and wallet)
      if (web3auth) {
        await web3auth.logout()
      }
    } catch (err) {
      console.warn("web3auth logout error:", err)
    } finally {
      // Clear all local state
      setUser(null)
      setProvider(null)
      setWeb3auth(null)
      // sessionStorage cleared by effect
    }
  }
  if (typeof window === "undefined") return

  // connectWallet -> connect wallet after user is already signed in
  const connectWallet = async () => {
    if (!user) {
      alert("Please sign in first")
      return
    }

    try {
      let web3Provider: ethers.providers.Web3Provider | null = null

      // If web3auth is already initialized and has a provider, use it
      if (web3auth && web3auth.provider) {
        web3Provider = new ethers.providers.Web3Provider(web3auth.provider as any)
        const accounts = await web3Provider.listAccounts()
        const account = accounts.length > 0 ? accounts[0] : undefined
        setProvider(web3Provider)
        setUser((u) => (u ? { ...u, walletAddress: account } : u))
        return
      }

      // If web3auth is initialized but no provider, try to connect
      if (web3auth) {
        const p = await web3auth.connect()
        if (p) {
          web3Provider = new ethers.providers.Web3Provider(p as any)
          const accounts = await web3Provider.listAccounts()
          const account = accounts.length > 0 ? accounts[0] : undefined
          setProvider(web3Provider)
          setUser((u) => (u ? { ...u, walletAddress: account } : u))
          return
        }
      }

      // Fallback: injected provider (MetaMask) - This will trigger the popup
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const injectedProvider = new ethers.providers.Web3Provider((window as any).ethereum)
        
        // This will trigger MetaMask popup for account selection
        await injectedProvider.send("eth_requestAccounts", [])
        
        // Get the selected accounts
        const accounts = await injectedProvider.listAccounts()
        
        if (accounts.length === 0) {
          throw new Error("No accounts selected")
        }
        
        setProvider(injectedProvider)
        setUser((u) => (u ? { ...u, walletAddress: accounts[0] } : u))
        return
      }

      alert("No wallet available. Install MetaMask or try refreshing the page.")
    } catch (err) {
      console.error("connectWallet error:", err)
      
      // Handle specific MetaMask errors
      if ((err as any).code === 4001) {
        alert("Please connect your wallet to continue")
      } else if ((err as any).code === -32002) {
        alert("Connection request already pending. Please check MetaMask.")
      } else {
        alert("Failed to connect wallet. Please try again.")
      }
      throw err
    }
  }

  const disconnectWallet = async () => {
    try {
      // For Web3Auth, we need to disconnect the provider
      if (web3auth && web3auth.provider) {
        // Web3Auth handles provider disconnection internally
        // We just need to clear our local state
      }
      
      // Clear wallet connection from user state
      setUser((u) => (u ? { ...u, walletAddress: undefined } : u))
      setProvider(null)
    } catch (err) {
      console.warn("disconnectWallet error:", err)
      // Still clear the state even if there's an error
      setUser((u) => (u ? { ...u, walletAddress: undefined } : u))
      setProvider(null)
    }
  }

  // Function to switch accounts - triggers MetaMask popup again
  const switchAccount = async () => {
    if (!user) {
      alert("Please sign in first")
      return
    }

    try {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        // Request account access again to show MetaMask popup
        await (window as any).ethereum.request({ method: "eth_requestAccounts" })
        
        // Get the new selected account
        const provider = new ethers.providers.Web3Provider((window as any).ethereum)
        const accounts = await provider.listAccounts()
        
        if (accounts.length > 0) {
          setProvider(provider)
          setUser((u) => (u ? { ...u, walletAddress: accounts[0] } : u))
        }
      }
    } catch (err) {
      console.error("switchAccount error:", err)
      if ((err as any).code === 4001) {
        alert("Account switch cancelled")
      } else {
        alert("Failed to switch account. Please try again.")
      }
    }
  }

  // Listen for injected provider account changes (MetaMask)
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (!accounts || accounts.length === 0) {
          disconnectWallet()
        } else {
          setUser((u) => (u ? { ...u, walletAddress: accounts[0] } : u))
        }
      }
      ;(window as any).ethereum.on?.("accountsChanged", handleAccountsChanged)
      return () => {
        ;(window as any).ethereum.removeListener?.("accountsChanged", handleAccountsChanged)
      }
    }
  }, [user])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        signInWithGoogle,
        signOut,
        connectWallet,
        disconnectWallet,
        switchAccount,
        web3auth,
        provider,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
