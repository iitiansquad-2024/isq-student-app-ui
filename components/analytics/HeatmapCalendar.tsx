"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type HeatmapCalendarProps = {
  year: number
  onYearChange: (year: number) => void
  activityData: Record<string, number>
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getIntensityColor(count: number): string {
  if (count === 0) return "bg-border"
  if (count <= 2) return "bg-emerald-200"
  if (count <= 5) return "bg-emerald-400"
  if (count <= 10) return "bg-emerald-600"
  return "bg-emerald-800"
}

export default function HeatmapCalendar({ year, onYearChange, activityData }: HeatmapCalendarProps) {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Activity Heatmap</h3>
        <Select value={year.toString()} onValueChange={(val) => onYearChange(parseInt(val))}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap items-start gap-3 w-full">
        {Array.from({ length: 12 }).map((_, m) => {
          const dim = daysInMonth(year, m)
          const firstWeekday = new Date(year, m, 1).getDay()
          const totalCells = firstWeekday + dim

          return (
            <div key={m} className="w-20 flex-shrink-0">
              <div className="mb-1 text-center text-[12px] font-medium">{MONTHS[m]}</div>

              <div className="grid grid-cols-7 gap-1" aria-label={`Month ${MONTHS[m]} ${year}`}>
                {Array.from({ length: totalCells }).map((__, idx) => {
                  const day = idx - firstWeekday + 1
                  if (day < 1) return <div key={idx} className="h-2 w-2 bg-transparent rounded-sm" />

                  const dateKey = `${year}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                  const count = activityData[dateKey] || 0
                  const color = getIntensityColor(count)

                  return (
                    <div
                      key={idx}
                      className={`h-2 w-2 rounded-sm ${color}`}
                      title={`${MONTHS[m]} ${day}, ${year} — ${count} questions`}
                      role="img"
                      aria-label={`${count} questions attempted`}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="h-3 w-3 rounded-sm bg-border" />
          <div className="h-3 w-3 rounded-sm bg-emerald-200" />
          <div className="h-3 w-3 rounded-sm bg-emerald-400" />
          <div className="h-3 w-3 rounded-sm bg-emerald-600" />
          <div className="h-3 w-3 rounded-sm bg-emerald-800" />
        </div>
        <span>More</span>
      </div>
    </div>
  )
}
