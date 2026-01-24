"use client"

import TopNav from "./top-nav"
import Sidebar from "./sidebar"
import BottomNav from "./bottom-nav"
import Footer from "./footer"
import { BlogSheet } from "./blog-sheet"
import { useMenu } from "@/contexts/MenuContext"

export default function Shell({ children }: { children: React.ReactNode }) {
  const { blogOpen, setBlogOpen } = useMenu()

  return (
    <div className="min-h-screen bg-background font-sans text-foreground dark:bg-black">
      <TopNav showSecondRow={true} />
      <Sidebar />

      <BlogSheet open={blogOpen} onOpenChange={setBlogOpen} />

      <div className="mx-auto max-w-3xl px-4 pt-24 pb-28">{children}</div>


      <Footer />

      <BottomNav />
    </div>
  )
}
