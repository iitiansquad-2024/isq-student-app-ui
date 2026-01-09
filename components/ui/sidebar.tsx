"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export function Sidebar({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
          />

          <motion.aside
            className={cn(
              "fixed left-0 top-0 z-50 h-full w-[84%] max-w-[320px] bg-background shadow-xl ring-1 ring-border/60"
            )}
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <div className="text-lg font-semibold">IITian Squad</div>
              <button aria-label="Close" onClick={() => onOpenChange(false)} className="-mr-2 rounded-md p-2">
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex h-full flex-col gap-2 p-4">
              <a className="block rounded-md px-3 py-2 text-primary hover:bg-primary/10" href="#">
                Practice
              </a>
              <a className="block rounded-md px-3 py-2 hover:bg-primary/10" href="#">
                Analytics
              </a>
              <a className="block rounded-md px-3 py-2 hover:bg-primary/10" href="#">
                Revision
              </a>
              <a className="block rounded-md px-3 py-2 hover:bg-primary/10" href="#">
                Profile
              </a>
            </nav>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}

export default Sidebar
