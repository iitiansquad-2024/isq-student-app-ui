"use client"

import React from "react"

type YearCalendarProps = {
  year: number
  visitsSet: Set<string>
  cellClass?: string
  monthWidthClass?: string
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

export default function YearCalendar({
  year,
  visitsSet,
  cellClass = "h-1 w-1 rounded-xs",
  monthWidthClass = "w-20",
}: YearCalendarProps) {
  return (
    <div className="flex flex-wrap items-start gap-3 w-full">
      {Array.from({ length: 12 }).map((_, m) => {
        const dim = daysInMonth(year, m)
        const firstWeekday = new Date(year, m, 1).getDay()
        const totalCells = firstWeekday + dim

        return (
          <div key={m} className={`${monthWidthClass} flex-shrink-0`}>
            <div className="mb-1 text-center text-[12px] font-medium">{MONTHS[m]}</div>

            <div className="grid grid-cols-7 gap-1" aria-label={`Month ${MONTHS[m]} ${year}`}>
              {Array.from({ length: totalCells }).map((__, idx) => {
                const day = idx - firstWeekday + 1
                if (day < 1) return <div key={idx} className={`bg-transparent ${cellClass}`} />

                const dt = new Date(year, m, day).toDateString()
                const visited = visitsSet.has(dt)

                return (
                  <div
                    key={idx}
                    className={`${cellClass} ${visited ? "bg-emerald-500" : "bg-border"}`}
                    title={`${MONTHS[m]} ${day}, ${year} — ${visited ? "visited" : "no visit"}`}
                    role="img"
                    aria-label={visited ? "visited" : "not visited"}
                  />
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
