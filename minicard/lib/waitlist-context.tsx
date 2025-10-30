"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface WaitlistContextType {
  joinWaitlist: (email: string, name?: string) => Promise<{ success: boolean; message: string }>
  isLoading: boolean
  isJoined: boolean
  userEmail: string | null
}

const WaitlistContext = createContext<WaitlistContextType | undefined>(undefined)

export function WaitlistProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isJoined, setIsJoined] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  const joinWaitlist = async (email: string, name?: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      })

      const data = await response.json()

      if (data.success) {
        setIsJoined(true)
        setUserEmail(email)
        return { success: true, message: data.message }
      } else {
        return { success: false, message: data.error || 'Failed to join waitlist' }
      }
    } catch (error) {
      console.error('Waitlist signup error:', error)
      return { success: false, message: 'Network error. Please try again.' }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <WaitlistContext.Provider
      value={{
        joinWaitlist,
        isLoading,
        isJoined,
        userEmail,
      }}
    >
      {children}
    </WaitlistContext.Provider>
  )
}

export function useWaitlist() {
  const context = useContext(WaitlistContext)
  if (context === undefined) {
    throw new Error("useWaitlist must be used within a WaitlistProvider")
  }
  return context
}
