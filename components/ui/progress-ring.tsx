"use client"

import React from "react"
import { motion } from "framer-motion"

type ProgressRingProps = {
  pct: number
  size?: number
  strokeColor?: string
  strokeWidth?: number
  className?: string
}

export default function ProgressRing({
  pct,
  size = 28,
  strokeColor = "var(--color-emerald-500)",
  strokeWidth = 3,
  className,
}: ProgressRingProps) {
  const radius = (size - 6) / 2
  const circumference = 2 * Math.PI * radius
  const dash = (circumference * pct) / 100

  return (
    <div className={className}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
        <g transform={`translate(${size / 2},${size / 2})`}>
          <circle r={radius} fill="none" stroke="var(--border)" strokeWidth={strokeWidth} opacity="0.18" />
          <motion.circle
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circumference}`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - dash }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </g>
      </svg>
    </div>
  )
}
