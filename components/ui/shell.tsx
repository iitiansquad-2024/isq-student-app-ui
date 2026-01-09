"use client"

import { useState } from "react"
import TopNav from "./top-nav"
import Sidebar from "./sidebar"
import BottomNav from "./bottom-nav"

export default function Shell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background font-sans text-foreground dark:bg-black">
      <TopNav showSecondRow={true} open={menuOpen} onOpenChange={setMenuOpen} />
      <Sidebar open={menuOpen} onOpenChange={setMenuOpen} />

      <div className="mx-auto max-w-3xl px-4 pt-24 pb-28">{children}</div>

      <BottomNav />
    </div>
  )
}
