"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface FilterState {
  subjects: string[]
  chapters: string[]
  topics: string[]
  years: string[]
  difficulty: string[]
  questionType: string[]
  previousYearOnly: boolean
}

interface ActiveFiltersProps {
  filters: FilterState
  onRemoveFilter: (type: keyof FilterState, value: string) => void
  onClearAll: () => void
}

export default function ActiveFilters({
  filters,
  onRemoveFilter,
  onClearAll,
}: ActiveFiltersProps) {
  const getActiveFilterCount = () => {
    return (
      filters.subjects.length +
      filters.chapters.length +
      filters.topics.length +
      filters.years.length +
      filters.difficulty.length +
      filters.questionType.length
    )
  }

  const activeCount = getActiveFilterCount()

  if (activeCount === 0) return null

  return (
    <div className="mb-4 p-3 bg-muted/50 rounded-lg border">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">
          Active Filters ({activeCount})
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-7 text-xs"
        >
          Clear All
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.subjects.map((subject) => (
          <Badge
            key={subject}
            variant="secondary"
            className="gap-1 pr-1 cursor-pointer hover:bg-destructive/10"
          >
            Subject: {subject}
            <X
              className="h-3 w-3 hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                onRemoveFilter("subjects", subject)
              }}
            />
          </Badge>
        ))}
        {filters.chapters.map((chapter) => (
          <Badge
            key={chapter}
            variant="secondary"
            className="gap-1 pr-1 cursor-pointer hover:bg-destructive/10"
          >
            Chapter: {chapter}
            <X
              className="h-3 w-3 hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                onRemoveFilter("chapters", chapter)
              }}
            />
          </Badge>
        ))}
        {filters.topics.map((topic) => (
          <Badge
            key={topic}
            variant="secondary"
            className="gap-1 pr-1 cursor-pointer hover:bg-destructive/10"
          >
            Topic: {topic}
            <X
              className="h-3 w-3 hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                onRemoveFilter("topics", topic)
              }}
            />
          </Badge>
        ))}
        {filters.years.map((year) => (
          <Badge
            key={year}
            variant="secondary"
            className="gap-1 pr-1 cursor-pointer hover:bg-destructive/10"
          >
            Year: {year}
            <X
              className="h-3 w-3 hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                onRemoveFilter("years", year)
              }}
            />
          </Badge>
        ))}
        {filters.difficulty.map((diff) => (
          <Badge
            key={diff}
            variant="secondary"
            className="gap-1 pr-1 cursor-pointer hover:bg-destructive/10"
          >
            {diff}
            <X
              className="h-3 w-3 hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                onRemoveFilter("difficulty", diff)
              }}
            />
          </Badge>
        ))}
        {filters.questionType.map((type) => (
          <Badge
            key={type}
            variant="secondary"
            className="gap-1 pr-1 cursor-pointer hover:bg-destructive/10"
          >
            Type: {type}
            <X
              className="h-3 w-3 hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                onRemoveFilter("questionType", type)
              }}
            />
          </Badge>
        ))}
      </div>
    </div>
  )
}
