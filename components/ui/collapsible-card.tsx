"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface CollapsibleCardProps {
  title: string
  defaultExpanded?: boolean
  children: React.ReactNode
  className?: string
}

export function CollapsibleCard({ title, defaultExpanded = true, children, className }: CollapsibleCardProps) {
  const [open, setOpen] = useState(defaultExpanded)

  return (
    <div className={cn("rounded-lg border border-border bg-background overflow-hidden", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 text-left bg-stone-100/40 ${open ? "bg-stone-100/40 mb-2" : "bg-stone-100/20"}`}
        aria-expanded={open}
      >
        {<span className="text-sm font-medium text-foreground">{open ? "" : title}</span>}
        <ChevronDown
          className={cn("h-4 w-4 text-muted-foreground transition-transform", open ? "rotate-180" : "rotate-0")}
        />
      </button>
      {open && <div className="px-3 pb-3 sm:px-4 sm:pb-4">{children}</div>}
    </div>
  )
}
