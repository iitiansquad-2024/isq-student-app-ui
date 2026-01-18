"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export function Sidebar({ 
  open, 
  onOpenChange,
  onBlogOpen 
}: { 
  open: boolean
  onOpenChange: (v: boolean) => void
  onBlogOpen?: () => void
}) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
          />

          <motion.aside
            className={cn(
              "fixed left-0 top-0 z-[70] h-full w-[84%] max-w-[320px] bg-background shadow-xl ring-1 ring-border/60"
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
              <Link 
                href="/practice"
                className="block rounded-md px-3 py-2 text-primary hover:bg-primary/10" 
                onClick={() => onOpenChange(false)}
              >
                Practice
              </Link>
              <Link 
                href="/analytics"
                className="block rounded-md px-3 py-2 hover:bg-primary/10" 
                onClick={() => onOpenChange(false)}
              >
                Analytics
              </Link>
              <Link 
                href="/revision"
                className="block rounded-md px-3 py-2 hover:bg-primary/10" 
                onClick={() => onOpenChange(false)}
              >
                Revision
              </Link>
              <Link 
                href="/profile"
                className="block rounded-md px-3 py-2 hover:bg-primary/10" 
                onClick={() => onOpenChange(false)}
              >
                Profile
              </Link>
              <Link 
                href="/blog"
                className="block rounded-md px-3 py-2 hover:bg-primary/10 text-left w-full" 
                onClick={() => onOpenChange(false)}
              >
                Blog
              </Link>
            </nav>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}

export default Sidebar
