"use client"

import { useEffect } from "react"

export function GlobalErrorHandler() {
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason
      const errorMessage = error?.message || String(error)

      // Suppress MetaMask and wallet-related errors from external sources
      if (
        errorMessage.includes("MetaMask") ||
        errorMessage.includes("wallet") ||
        errorMessage.includes("ethereum") ||
        errorMessage.includes("web3")
      ) {
        console.warn("[v0] External wallet error suppressed:", errorMessage)
        event.preventDefault()
        return
      }

      console.error("[v0] Unhandled promise rejection:", error)
    }

    // Handle global errors
    const handleError = (event: ErrorEvent) => {
      const errorMessage = event.message || String(event.error)

      // Suppress MetaMask and wallet-related errors
      if (
        errorMessage.includes("MetaMask") ||
        errorMessage.includes("wallet") ||
        errorMessage.includes("ethereum") ||
        errorMessage.includes("web3")
      ) {
        console.warn("[v0] External wallet error suppressed:", errorMessage)
        event.preventDefault()
        return
      }

      console.error("[v0] Global error:", event.error)
    }

    window.addEventListener("unhandledrejection", handleUnhandledRejection)
    window.addEventListener("error", handleError)

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
      window.removeEventListener("error", handleError)
    }
  }, [])

  return null
}
