"use client"

import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

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
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {presetFilters.map((filter) => {
        const isSelected = selectedPresets.includes(filter)
        return (
          <Badge
            key={filter}
            variant={isSelected ? "default" : "outline"}
            className={`cursor-pointer transition-all ${
              isSelected
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "hover:bg-muted"
            }`}
            onClick={() => onTogglePreset(filter)}
          >
            {filter}
            {isSelected && <X className="ml-1 h-3 w-3" />}
          </Badge>
        )
      })}
    </div>
  )
}
