"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

type StreakProps = {
  goal?: number
  size?: number
  variant?: "circle" | "bar"
}

function formatDateLocal(iso?: string) {
  if (!iso) return "unknown"
  try {
    const d = new Date(iso)
    return d.toLocaleDateString()
  } catch {
    return iso
  }
}

export default function Streak({ goal = 30, size = 56, variant = "circle" }: StreakProps) {
  const [days, setDays] = useState<number>(0)
  const [firstIso, setFirstIso] = useState<string | null>(null)

  useEffect(() => {
    try {
      const key = "iit_first_visit"
      const stored = localStorage.getItem(key)
      const today = new Date()
      if (!stored) {
        const iso = today.toISOString()
        localStorage.setItem(key, iso)
        setFirstIso(iso)
        setDays(1)
      } else {
        setFirstIso(stored)
        const first = new Date(stored)
        const utcToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
        const utcFirst = Date.UTC(first.getFullYear(), first.getMonth(), first.getDate())
        const diffDays = Math.floor((utcToday - utcFirst) / (24 * 60 * 60 * 1000)) + 1
        setDays(diffDays > 0 ? diffDays : 1)
      }
    } catch (e) {
      setDays(1)
    }
  }, [])

  const pct = Math.min(1, days / (goal || 1))

  const title = firstIso ? `Started on ${formatDateLocal(firstIso)} — ${days} day(s)` : `${days} day(s)`

  if (variant === "bar") {
    const pctStr = `${Math.round(pct * 100)}%`
    return (
      <div className="flex items-center gap-3" title={title} aria-label={`Streak ${pctStr}`}>
        <div className="flex flex-col">
          <div className="mb-1 flex items-baseline gap-2">
            <div className="text-sm font-semibold">{days}d</div>
            <div className="text-xs text-muted-foreground">streak</div>
          </div>
          <div className="h-2 w-40 overflow-hidden rounded-full bg-border">
            <motion.div
              className="h-2 rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${pct * 100}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
        </div>
      </div>
    )
  }

  // circle variant
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const dash = circumference * pct

  return (
    <div className="flex items-center gap-3" title={title} aria-label={`Streak ${Math.round(pct * 100)}%`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
        <g transform={`translate(${size / 2},${size / 2})`}>
          <circle r={radius} fill="none" stroke="var(--color-stone-100)" strokeWidth="6" opacity="1" />
          <motion.circle
            r={radius}
            fill="none"
            stroke="var(--secondary)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${circumference}`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - dash }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </g>
      </svg>

      <div className="flex flex-col items-start leading-tight">
        <div className="text-sm font-semibold">{days}d</div>
        <div className="text-xs text-muted-foreground">current streak</div>
      </div>
    </div>
  )
}
