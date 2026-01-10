"use client"

import React from "react"
import { cn } from "@/lib/utils"

type AvatarProps = {
  src?: string | null
  name?: string
  size?: number
  className?: string
}

export default function Avatar({ src, name = "?", size = 36, className }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  const sizeStyle = { width: size, height: size }

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center overflow-hidden rounded-full bg-muted text-sm font-medium text-foreground",
        className
      )}
      style={sizeStyle}
      aria-hidden={!!src}
      title={name}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} style={sizeStyle} className="object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  )
}
