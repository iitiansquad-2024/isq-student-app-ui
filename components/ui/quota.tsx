"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type QuotaState = {
  used: number
  limit: number
  lastResetISO: string
}

const STORAGE_KEY = "iit_daily_quota"

function todayISO() {
  const d = new Date()
  return d.toISOString().slice(0, 10) // YYYY-MM-DD
}

export function useQuota(defaultLimit = 20) {
  const [state, setState] = useState<QuotaState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as QuotaState
        // ensure parsed has fields
        if (parsed && typeof parsed.used === "number" && typeof parsed.limit === "number") {
          // reset if older day
          if (parsed.lastResetISO !== todayISO()) {
            const fresh: QuotaState = { used: 0, limit: parsed.limit || defaultLimit, lastResetISO: todayISO() }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh))
            return fresh
          }
          return parsed
        }
      }
    } catch (e) {
      // ignore
    }
    const initial: QuotaState = { used: 0, limit: defaultLimit, lastResetISO: todayISO() }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
    } catch {}
    return initial
  })

  // sync across tabs
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue) as QuotaState
          setState(parsed)
        } catch {}
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  // ensure daily reset happens on mount
  useEffect(() => {
    if (state.lastResetISO !== todayISO()) {
      const fresh = { ...state, used: 0, lastResetISO: todayISO() }
      setState(fresh)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh))
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const remaining = useMemo(() => Math.max(0, state.limit - state.used), [state])

  function consume(n = 1) {
    setState((s) => {
      const next = { ...s, used: Math.min(s.limit, s.used + n) }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {}
      return next
    })
  }

  function reset() {
    const fresh: QuotaState = { used: 0, limit: state.limit, lastResetISO: todayISO() }
    setState(fresh)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh))
    } catch {}
  }

  function setLimit(newLimit: number) {
    setState((s) => {
      const next = { ...s, limit: newLimit }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {}
      return next
    })
  }

  return { state, remaining, consume, reset, setLimit }
}

export default function Quota({ limit = 20 }: { limit?: number }) {
  const { state, remaining, consume, reset, setLimit } = useQuota(limit)
  const pct = Math.round((state.used / Math.max(1, state.limit)) * 100)

  const [showOptions, setShowOptions] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!panelRef.current) return
      if (e.target instanceof Node && !panelRef.current.contains(e.target)) {
        setShowOptions(false)
      }
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [])

  function handleResetToday() {
    // charge flow simulated — reset for today for 9 rupees
    reset()
    setMsg("Quota reset for today (₹9)")
    setShowOptions(false)
    window.setTimeout(() => setMsg(null), 3000)
  }

  function handleBuyMonth() {
    // simulate granting a month premium — increase limit substantially
    setLimit(state.limit + 1000)
    setMsg("Purchased 1-month premium (₹49)")
    setShowOptions(false)
    window.setTimeout(() => setMsg(null), 3000)
  }

  return (
    <div className="relative flex items-center gap-3">
      <div className="flex flex-col items-end">
        <div className="text-sm font-medium">Daily quota</div>
        <div className="text-xs text-muted-foreground">{state.used}/{state.limit} used</div>
      </div>

      <div className="h-8 w-28 overflow-hidden rounded-md border border-border bg-muted/5">
        <div
          className={cn("h-full bg-primary transition-all duration-300", pct >= 100 ? "bg-red-600" : "")}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => setShowOptions((s) => !s)}>
          Reset
        </Button>

        {showOptions ? (
          <div ref={panelRef} className="absolute right-0 top-full z-50 mt-2 w-56 rounded-md border bg-background p-3 shadow-lg">
            <div className="mb-2 text-sm font-medium">Reset options</div>
            <div className="flex flex-col gap-2">
              <Button size="sm" variant="default" onClick={handleResetToday}>
                Reset for today — ₹9
              </Button>
              <Button size="sm" variant="secondary" onClick={handleBuyMonth}>
                Buy 1-month premium — ₹49
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowOptions(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : null}

        {msg ? <div className="ml-2 text-xs text-muted-foreground">{msg}</div> : null}
      </div>
    </div>
  )
}
