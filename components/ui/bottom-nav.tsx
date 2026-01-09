"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Play, BarChart2, BookOpen, User } from "lucide-react"
import { cn } from "@/lib/utils"

const items = [
  { key: "practice", label: "Practice", Icon: Play },
  { key: "analytics", label: "Analytics", Icon: BarChart2 },
  { key: "revision", label: "Revision", Icon: BookOpen },
  { key: "profile", label: "Profile", Icon: User },
]

export function BottomNav({ className }: { className?: string }) {
  const [active, setActive] = useState<string>("practice")

  return (
    <nav
      aria-label="Bottom navigation"
      className={cn(
        "fixed bottom-4 left-4 right-4 z-40 mx-auto w-auto max-w-3xl rounded-2xl bg-background/80 px-3 py-2 shadow-lg backdrop-blur-sm ring-1 ring-border/60 sm:hidden",
        className
      )}
    >
      <div className="relative flex items-center justify-between gap-1">
        {items.map((it) => {
          const activeItem = active === it.key
          const Icon = it.Icon
          return (
            <button
              key={it.key}
              onClick={() => setActive(it.key)}
              className="relative z-10 flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground disabled:opacity-60"
              aria-current={activeItem ? "page" : undefined}
            >
              {activeItem ? (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute inset-0 m-1 rounded-lg bg-primary/10"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              ) : null}

              <div className="relative z-20 flex flex-col items-center justify-center gap-1">
                <Icon className={cn("h-5 w-5", activeItem ? "text-primary" : "text-muted-foreground")} />
                <span className={cn("text-[10px]", activeItem ? "text-primary" : "text-muted-foreground")}>
                  {it.label}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav
