"use client"

import { useMemo } from "react"
import Streak from "@/components/ui/streak"
import YearCalendar from "@/components/ui/analytics/YearCalendar"

type Props = {
  current?: number
  goal?: number
  year?: number
  visits?: string[] // optional ISO date strings
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

export default function StreakAnalytics({ current = 5, goal = 30, year, visits }: Props) {
  const now = new Date()
  const displayYear = year ?? now.getFullYear()

  // derive a set of visited days (as toDateString) — use provided visits or simulate last N days
  const visitsSet = useMemo(() => {
    if (visits && visits.length > 0) {
      return new Set(visits.map((d) => new Date(d).toDateString()))
    }

    const s = new Set<string>()
    for (let i = 0; i < current; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      s.add(d.toDateString())
    }
    return s
  }, [visits, current])

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium">Streak</h3>
        <div className="text-xs text-muted-foreground">Goal {goal}d</div>
      </div>

      <div className="flex items-center gap-3">
        <Streak currentDays={current} goal={goal} size={64} showText={false} />

        <div className="flex flex-col">
          <div className="text-lg font-semibold">{current}d</div>
          <div className="text-xs text-muted-foreground">Current streak</div>
        </div>
      </div>

      {/* Year-wise month grids (wrapped) */}
      <div className="mt-4">
        <div className="text-xs text-muted-foreground mb-2">Visit history — {displayYear}</div>
        <YearCalendar year={displayYear} visitsSet={visitsSet} cellClass="h-2 w-2 rounded-[3px]" monthWidthClass="w-19" />
      </div>
    </div>
  )
}
