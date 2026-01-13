"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleCardProps {
  title: React.ReactNode | string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
  className?: string;
  chevronElement?: (open: boolean) => React.ReactNode;
}

export function CollapsibleCard({
  title,
  defaultExpanded = true,
  children,
  className,
  chevronElement = (open: boolean) => (
    <ChevronDown
      className={cn(
        "h-4 w-4 text-muted-foreground transition-transform",
        open ? "rotate-180" : "rotate-0"
      )}
    />
  ),
}: CollapsibleCardProps) {
  const [open, setOpen] = useState(defaultExpanded);

  return (
    <div
      className={cn(
        "rounded-lg border border-border overflow-hidden",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 text-left`}
        aria-expanded={open}
      >
        {typeof title === "string" ? (
          <span className="text-sm font-medium text-foreground">
            {title}
          </span>
        ) : (
          title
        )}
        {chevronElement(open)}
      </button>
      {open && <div className="p-4">{children}</div>}
    </div>
  );
}
