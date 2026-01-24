"use client"

import { createContext, useContext, useState, ReactNode, useCallback } from "react"

interface MenuContextValue {
  menuOpen: boolean
  blogOpen: boolean
  showSecondRow: boolean
  openMenu: () => void
  closeMenu: () => void
  toggleMenu: () => void
  openBlog: () => void
  closeBlog: () => void
  setBlogOpen: (open: boolean) => void
  setShowSecondRow: (show: boolean) => void
}

const MenuContext = createContext<MenuContextValue | undefined>(undefined)

export function MenuProvider({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [blogOpen, setBlogOpen] = useState(false)
  const [showSecondRow, setShowSecondRow] = useState(true)

  const openMenu = useCallback(() => setMenuOpen(true), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev)
  }, [])

  const openBlog = useCallback(() => {
    setBlogOpen(true)
    setMenuOpen(false)
  }, [])

  const closeBlog = useCallback(() => setBlogOpen(false), [])

  return (
    <MenuContext.Provider
      value={{
        menuOpen,
        blogOpen,
        showSecondRow,
        openMenu,
        closeMenu,
        toggleMenu,
        openBlog,
        closeBlog,
        setBlogOpen,
        setShowSecondRow,
      }}
    >
      {children}
    </MenuContext.Provider>
  )
}

export function useMenu() {
  const context = useContext(MenuContext)
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider")
  }
  return context
}
