"use client"

import { motion } from "framer-motion"

export default function CoverageAnalytics({ percent = 72 }: { percent?: number }) {
  const size = 84
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const dash = (circumference * Math.min(100, percent)) / 100

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium">Coverage</h3>
        <div className="text-xs text-muted-foreground">Questions covered</div>
      </div>

      <div className="flex items-center gap-4">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
          <g transform={`translate(${size / 2},${size / 2})`}>
            <circle r={radius} fill="none" stroke="var(--border)" strokeWidth="8" opacity="0.2" />
            <motion.circle
              r={radius}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${circumference}`}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference - dash }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </g>
        </svg>

        <div>
          <div className="text-lg font-semibold">{percent}%</div>
          <div className="text-xs text-muted-foreground">Covered</div>
        </div>
      </div>
    </div>
  )
}
