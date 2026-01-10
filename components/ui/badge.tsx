"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "subtle" | "outline" | "secondary" | "primary-dark"
}

export function Badge({ className, variant = "subtle", ...props }: BadgeProps) {
  const base = "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"

  const variantClass =
    variant === "default"
      ? "bg-primary text-primary-foreground"
      : variant === "outline"
      ? "border border-border bg-transparent text-muted-foreground"
      : variant === "secondary"
      ? "bg-secondary text-secondary-foreground"
        : variant === "primary-dark"
        ? "bg-primary-dark text-white"
      : "bg-muted/10 text-muted-foreground"

  return <span className={cn(base, variantClass, className)} {...props} />
}

export default Badge
