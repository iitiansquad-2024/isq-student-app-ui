"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export type SortField = "id" | "year" | "difficulty" | "attempted" | "avgAccuracy"
export type SortOrder = "asc" | "desc"

interface SortByComponentProps {
  sortField: SortField | null
  sortOrder: SortOrder
  onSortChange: (field: SortField, order: SortOrder) => void
}

const sortOptions = [
  { value: "id", label: "Question ID" },
  { value: "year", label: "Year" },
  { value: "difficulty", label: "Difficulty" },
  { value: "attempted", label: "Total Attempts" },
  { value: "avgAccuracy", label: "Avg Accuracy" },
]

export default function SortByComponent({
  sortField,
  sortOrder,
  onSortChange,
}: SortByComponentProps) {
  const handleFieldChange = (value: string) => {
    onSortChange(value as SortField, sortOrder)
  }

  const toggleSortOrder = () => {
    if (sortField) {
      onSortChange(sortField, sortOrder === "asc" ? "desc" : "asc")
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={sortField || ""}
        onValueChange={handleFieldChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {sortField && (
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSortOrder}
          className="h-10 w-10"
        >
          {sortOrder === "asc" ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  )
}
