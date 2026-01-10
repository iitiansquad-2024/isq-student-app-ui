"use client"

import { motion } from "framer-motion"

export default function RevisionDebtAnalytics({ overdue = 12 }: { overdue?: number }) {
  const cap = Math.max(0, overdue)
  const pct = Math.min(100, Math.round((cap / Math.max(1, cap + 8)) * 100))

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium">Revision Debt</h3>
        <div className="text-xs text-muted-foreground">Outstanding items</div>
      </div>

      <div className="flex items-center gap-4">
        <div>
          <div className="text-lg font-semibold">{overdue}</div>
          <div className="text-xs text-muted-foreground">Overdue revisions</div>
        </div>

        <div className="flex-1">
          <div className="h-2 w-full overflow-hidden rounded-full bg-border">
            <motion.div
              className="h-2 rounded-full bg-secondary"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
          <div className="mt-1 text-xs text-muted-foreground">Debt level: {pct}%</div>
        </div>
      </div>
    </div>
  )
}
