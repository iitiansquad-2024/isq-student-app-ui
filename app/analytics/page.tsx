"use client"

import { useState, useMemo } from "react"
import StreakAnalytics from "@/components/ui/analytics/StreakAnalytics"
import CoverageAnalytics from "@/components/ui/analytics/CoverageAnalytics"
import RevisionDebtAnalytics from "@/components/ui/analytics/RevisionDebtAnalytics"
import HeatmapCalendar from "@/components/analytics/HeatmapCalendar"
import CoverageStats from "@/components/analytics/CoverageStats"

function generateSampleActivityData(year: number): Record<string, number> {
  const data: Record<string, number> = {}
  const startDate = new Date(year, 0, 1)
  const endDate = new Date(year, 11, 31)
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
    if (Math.random() > 0.6) {
      data[dateKey] = Math.floor(Math.random() * 15) + 1
    }
  }
  
  return data
}

export default function AnalyticsPage() {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)
  
  const activityData = useMemo(() => generateSampleActivityData(selectedYear), [selectedYear])
  
  const yearStats = useMemo(() => {
    const values = Object.values(activityData)
    const totalAttempted = values.reduce((sum, count) => sum + count, 0)
    const daysActive = values.filter(count => count > 0).length
    const avgPerDay = daysActive > 0 ? totalAttempted / daysActive : 0
    
    return {
      totalAttempted,
      daysActive,
      avgPerDay: avgPerDay.toFixed(1),
    }
  }, [activityData])

  return (
    <section className="py-8 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="mt-1 text-base text-muted-foreground">
          Comprehensive overview of your learning metrics and progress.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StreakAnalytics current={6} goal={30} />
        <CoverageAnalytics percent={72} />
        <RevisionDebtAnalytics overdue={12} />
      </div>

      <div className="rounded-md border border-border bg-background p-4">
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-md border border-border p-3">
            <div className="text-sm text-muted-foreground mb-1">Total Attempted ({selectedYear})</div>
            <div className="text-2xl font-bold">{yearStats.totalAttempted}</div>
          </div>
          <div className="rounded-md border border-border p-3">
            <div className="text-sm text-muted-foreground mb-1">Active Days</div>
            <div className="text-2xl font-bold text-emerald-600">{yearStats.daysActive}</div>
          </div>
          <div className="rounded-md border border-border p-3">
            <div className="text-sm text-muted-foreground mb-1">Avg. Per Active Day</div>
            <div className="text-2xl font-bold text-blue-600">{yearStats.avgPerDay}</div>
          </div>
        </div>
        
        <HeatmapCalendar 
          year={selectedYear} 
          onYearChange={setSelectedYear}
          activityData={activityData}
        />
      </div>

      <div className="rounded-md border border-border bg-background p-4">
        <CoverageStats />
      </div>
    </section>
  )
}
