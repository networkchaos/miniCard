"use client"

import { type ReactNode, useState } from "react"
import { Sidebar } from "./sidebar"
import { TopNav } from "./top-nav"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-72">
        <TopNav onMenuClick={() => setSidebarOpen(true)} />

        <main className="px-6 py-8 lg:px-12 lg:py-10">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
