"use client"

import React from "react"
import { cn } from "@/lib/utils"

type PageHeaderProps = {
  title: React.ReactNode
  subtitle?: React.ReactNode
  className?: string
  actions?: React.ReactNode
}

export default function PageHeader({ title, subtitle, className, actions }: PageHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>

      {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
    </div>
  )
}
