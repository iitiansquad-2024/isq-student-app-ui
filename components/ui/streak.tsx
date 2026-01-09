"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

type StreakProps = {
  goal?: number
  size?: number
}

export default function Streak({ goal = 30, size = 56 }: StreakProps) {
  const [days, setDays] = useState<number>(0)

  useEffect(() => {
    try {
      const key = "iit_first_visit"
      const stored = localStorage.getItem(key)
      const today = new Date()
      if (!stored) {
        localStorage.setItem(key, today.toISOString())
        setDays(1)
      } else {
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
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const dash = circumference * pct

  return (
    <div className="flex items-center gap-3">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
        <g transform={`translate(${size / 2},${size / 2})`}>
          <circle r={radius} fill="none" stroke="var(--border)" strokeWidth="6" opacity="0.12" />
          <motion.circle
            r={radius}
            fill="none"
            stroke="var(--primary)"
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
