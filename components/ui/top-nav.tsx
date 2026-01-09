"use client"

import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"
import { AnimatePresence } from "framer-motion"

type TopNavProps = {
  showSecondRow?: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TopNav({ showSecondRow = false, open, onOpenChange }: TopNavProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-primary">
      <div className="flex w-full items-center justify-between gap-4  px-4 py-3 backdrop-blur-sm ring-0">
        <div className="flex items-center gap-3">
          <div className="rounded-md px-2 py-1 text-lg font-semibold">iitian</div>
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => onOpenChange(!open)}
            className="rounded-md p-2 text-black"
          >
            { <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {showSecondRow ? (
        <div className="w-full border-b border-border bg-background/80 px-3 py-2 text-sm">
          <nav className="flex gap-3 overflow-x-auto">
            <a className="rounded-md px-3 py-1 text-sm" href="#">
              All
            </a>
            <a className="rounded-md px-3 py-1 text-sm" href="#">
              Math
            </a>
            <a className="rounded-md px-3 py-1 text-sm" href="#">
              Physics
            </a>
            <a className="rounded-md px-3 py-1 text-sm" href="#">
              Chemistry
            </a>
          </nav>
        </div>
      ) : null}

      <AnimatePresence>{/* placeholder for compatibility if needed */}</AnimatePresence>
    </header>
  )
}

export default TopNav
