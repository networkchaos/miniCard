import { VirtualCard } from "../../../components/virtual-card"
import { QuickActions } from "../../../components/quick-actions"
import { RecentTransactions } from "../../../components/recent-transactions"
import { BalanceOverview } from "../../../components/balance-overview"
import { GlobalErrorHandler } from "../error-handler"
import { DashboardLayout } from "../../../components/dashboard-layout"

export default function DashboardPage() {
  return (
    <>
      <GlobalErrorHandler />
      <DashboardLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-balance">Welcome back, Alex</h1>
            <p className="text-muted-foreground mt-2">Here's what's happening with your finances today.</p>
          </div>

          <div className="w-full">
            <VirtualCard />
          </div>

          <BalanceOverview />

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <RecentTransactions />
            </div>

            <div>
              <QuickActions />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}
