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
    .filter(s => s.length > 0)
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  const sizeStyle = { 
    width: size, 
    height: size,
    fontSize: Math.max(size * 0.3, 12)
  }

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-black text-sm font-semibold border-2 border-border shadow-md",
        className
      )}
      style={sizeStyle}
      title={name}
    >
      {src && src.trim() !== "" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img 
          src={src} 
          alt={name} 
          style={sizeStyle} 
          className="object-cover"
          onError={(e) => {
            // Fallback to initials if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const span = target.parentElement?.querySelector('span') as HTMLSpanElement;
            if (span) span.style.display = 'flex';
          }}
        />
      ) : null}
      <span style={{ display: (src && src.trim() !== "") ? 'none' : 'flex' }}>
        {initials || "?"}
      </span>
    </div>
  )
}
