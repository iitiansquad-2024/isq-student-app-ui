"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ className, ...props }, ref) => {
  return (
    <input
      type="checkbox"
      ref={ref}
      className={cn(
        "h-4 w-4 rounded border border-border bg-background text-primary focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
})

Checkbox.displayName = "Checkbox"

export default Checkbox
