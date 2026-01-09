"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Play, BarChart2, BookOpen, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"

const items = [
  { key: "practice", label: "Practice", Icon: Play },
  { key: "analytics", label: "Analytics", Icon: BarChart2 },
  { key: "revision", label: "Revision", Icon: BookOpen },
  { key: "profile", label: "Profile", Icon: User },
]

export function BottomNav({ className }: { className?: string }) {
  const pathname = usePathname() || "/"
  const router = useRouter()

  const active = useMemo(() => {
    if (pathname.startsWith("/analytics")) return "analytics"
    if (pathname.startsWith("/revision")) return "revision"
    if (pathname.startsWith("/profile")) return "profile"
    // default to practice for root or /practice
    return "practice"
  }, [pathname])

  return (
    <nav
      aria-label="Bottom navigation"
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 w-full bg-background/95 border-t border-border/60 sm:hidden",
        className
      )}
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-1 px-3 py-2">
        {items.map((it) => {
          const activeItem = active === it.key
          const Icon = it.Icon
          return (
            <button
              key={it.key}
              onClick={() => router.push(`/${it.key}`)}
              className="relative z-10 flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-muted-foreground disabled:opacity-60"
              aria-current={activeItem ? "page" : undefined}
            >
              {activeItem ? (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute inset-0 m-1 rounded-lg bg-primary/20"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              ) : null}

              <div className="relative z-20 flex flex-col items-center justify-center gap-1">
                <Icon className={cn("h-5 w-5", activeItem ? "text-primary-dark" : "text-muted-foreground")} />
                <span className={cn("text-[10px]", activeItem ? "text-primary-dark" : "text-muted-foreground")}>
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
