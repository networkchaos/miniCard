"use client"

import { Component, type ReactNode } from "react"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { AlertCircle } from "lucide-react"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    if (error.message?.includes("MetaMask") || error.message?.includes("wallet")) {
      console.warn("[v0] External wallet error suppressed:", error.message)
      return { hasError: false }
    }
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    if (error.message?.includes("MetaMask") || error.message?.includes("wallet")) {
      console.warn("[v0] External wallet error caught and suppressed:", error.message)
      return
    }
    console.error("[v0] Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="max-w-md w-full p-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            <div className="text-sm text-muted-foreground mb-4 text-left">
              <p className="mb-2">If this persists, please check:</p>
              <ul className="space-y-1">
                <li>• Your internet connection</li>
                <li>• Browser console for errors</li>
                <li>• Environment variables are set</li>
                <li>• Database connection is working</li>
              </ul>
            </div>
            <div className="space-y-2">
              <Button onClick={() => this.setState({ hasError: false })} className="w-full">
                Try Again
              </Button>
              <Button 
                onClick={() => window.location.href = '/'} 
                variant="outline" 
                className="w-full"
              >
                Go Home
              </Button>
            </div>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="text-left text-xs text-muted-foreground mt-4">
                <summary className="cursor-pointer">Error Details (Development)</summary>
                <pre className="mt-2 p-2 bg-muted rounded overflow-auto max-h-32">
                  {this.state.error.message}
                  {this.state.error.stack && (
                    <>
                      {'\n\nStack Trace:\n'}
                      {this.state.error.stack}
                    </>
                  )}
                </pre>
              </details>
            )}
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
