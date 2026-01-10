"use client"

import { useMemo } from "react"
import Streak from "@/components/ui/streak"

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

      {/* Year-wise month grids */}
      <div className="mt-4">
        <div className="text-xs text-muted-foreground mb-2">Visit history — {displayYear}</div>
        <div className="-mx-1 flex gap-3 overflow-x-auto py-1">
          {Array.from({ length: 12 }).map((_, m) => {
            const dim = daysInMonth(displayYear, m)
            const firstWeekday = new Date(displayYear, m, 1).getDay() // 0..6 (Sun..Sat)
            const totalCells = firstWeekday + dim

            return (
              <div key={m} className="mx-1 w-28 flex-shrink-0">
                <div className="mb-1 text-center text-[12px] font-medium">{MONTHS[m]}</div>

                <div
                  className="grid grid-cols-7 gap-1"
                  aria-label={`Month ${MONTHS[m]} ${displayYear}`}
                >
                  {Array.from({ length: totalCells }).map((__, idx) => {
                    const day = idx - firstWeekday + 1
                    if (day < 1) {
                      return <div key={idx} className="h-3 w-3 rounded-sm bg-transparent" />
                    }

                    const dt = new Date(displayYear, m, day).toDateString()
                    const visited = visitsSet.has(dt)

                    return (
                      <div
                        key={idx}
                        className={`h-3 w-3 rounded-sm ${visited ? "bg-emerald-500" : "bg-border"}`}
                        title={`${MONTHS[m]} ${day}, ${displayYear} — ${visited ? "visited" : "no visit"}`}
                        role="img"
                        aria-label={`${visited ? "visited" : "not visited"}`} 
                      />
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
