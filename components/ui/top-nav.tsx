"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function TopNav({ showSecondRow = false }: { showSecondRow?: boolean }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="flex w-full items-center justify-between gap-4 bg-background/80 px-4 py-3 backdrop-blur-sm ring-0">
        <div className="flex items-center gap-3">
          <div className="rounded-md px-2 py-1 text-lg font-semibold">iitian</div>
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((s) => !s)}
            className="rounded-md p-2"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {showSecondRow ? (
        <div className="w-full border-b border-border bg-background/80 px-3 py-2 text-sm">
          <nav className="flex gap-3 overflow-x-auto">
            <a className="rounded-md px-3 py-1 text-sm" href="#">All</a>
            <a className="rounded-md px-3 py-1 text-sm" href="#">Math</a>
            <a className="rounded-md px-3 py-1 text-sm" href="#">Physics</a>
            <a className="rounded-md px-3 py-1 text-sm" href="#">Chemistry</a>
          </nav>
        </div>
      ) : null}

      <AnimatePresence>
        {open ? (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute inset-x-0 top-full z-40 bg-background/95 px-4 py-4 shadow-md ring-1 ring-border/60"
          >
            <nav className="flex flex-col gap-3">
              <a className="block rounded-md px-3 py-2" href="#">Practice</a>
              <a className="block rounded-md px-3 py-2" href="#">Analytics</a>
              <a className="block rounded-md px-3 py-2" href="#">Revision</a>
              <a className="block rounded-md px-3 py-2" href="#">Profile</a>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}

export default TopNav
