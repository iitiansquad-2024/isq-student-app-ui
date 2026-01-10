"use client"

import Streak from "@/components/ui/streak"

export default function StreakAnalytics({ current = 5, goal = 30 }: { current?: number; goal?: number }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium">Streak</h3>
        <div className="text-xs text-muted-foreground">Goal {goal}d</div>
      </div>

      <div className="flex items-center gap-3">
        <Streak currentDays={current} goal={goal} size={64} />

        {/* <div className="flex flex-col">
          <div className="text-lg font-semibold">{current}d</div>
          <div className="text-xs text-muted-foreground">Current streak</div>
        </div> */}
      </div>
    </div>
  )
}
