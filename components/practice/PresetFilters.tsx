"use client"

import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface PresetFiltersProps {
  presetFilters: string[]
  selectedPresets: string[]
  onTogglePreset: (filter: string) => void
}

export default function PresetFilters({
  presetFilters,
  selectedPresets,
  onTogglePreset,
}: PresetFiltersProps) {
  const [showAll, setShowAll] = useState(false)

  return (
    <div className="mb-4">
      <div
        className={cn(
          "relative rounded-md bg-stone-50 p-3",
          showAll ? "max-h-none" : "max-h-12 overflow-hidden"
        )}
      >
        <div className="flex flex-wrap gap-2">
          {[...presetFilters].map((filter) => {
            const isSelected = selectedPresets.includes(filter)
            return (
              <Badge
                key={filter}
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-all",
                  isSelected
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "hover:bg-muted"
                )}
                onClick={() => onTogglePreset(filter)}
              >
                {filter}
                {isSelected && <X className="ml-1 h-3 w-3" />}
              </Badge>
            )
          })}
        </div>
        {!showAll && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-stone-50 to-transparent" />
        )}
      </div>
      {presetFilters.length > 4 && (
        <div className="mt-2 text-right">
          <button
            type="button"
            className="text-sm font-medium text-primary-dark underline-offset-4 cursor-pointer"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? "- Show less" : "+ Show more"}
          </button>
        </div>
      )}
    </div>
  )
}
