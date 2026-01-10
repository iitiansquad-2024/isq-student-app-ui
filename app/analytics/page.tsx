import StreakAnalytics from "@/components/ui/analytics/StreakAnalytics"
import CoverageAnalytics from "@/components/ui/analytics/CoverageAnalytics"
import RevisionDebtAnalytics from "@/components/ui/analytics/RevisionDebtAnalytics"

export default function AnalyticsPage() {
  return (
    <section className="py-8">
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <p className="mt-3 text-base text-muted-foreground">Overview of your learning metrics.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StreakAnalytics current={6} goal={30} />
        <CoverageAnalytics percent={72} />
        <RevisionDebtAnalytics overdue={12} />
      </div>
    </section>
  )
}
