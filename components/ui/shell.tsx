"use client"

import TopNav from "./top-nav"
import Sidebar from "./sidebar"
import BottomNav from "./bottom-nav"
import Footer from "./footer"
import { BlogSheet } from "./blog-sheet"
import { useMenu } from "@/contexts/MenuContext"
import { cn } from "@/lib/utils"

export default function Shell({ children }: { children: React.ReactNode }) {

  const {showSecondRow } = useMenu()

  return (
    <div className="min-h-screen bg-background font-sans text-foreground dark:bg-black">
      <TopNav showSecondRow={showSecondRow} />
      <Sidebar />

      <div className={cn("mx-auto max-w-3xl px-4 pt-7 pb-14", showSecondRow ? "pt-28" : "")}>{children}</div>

      <Footer />

      <BottomNav />
    </div>
  )
}
