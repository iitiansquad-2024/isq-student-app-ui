"use client"

import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

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
  const [open, setOpen] = useState(false)

  const handleFieldChange = (value: string) => {
    onSortChange(value as SortField, sortOrder)
  }

  const toggleSortOrder = () => {
    if (sortField) {
      onSortChange(sortField, sortOrder === "asc" ? "desc" : "asc")
    }
  }

  const triggerIcon = !sortField ? (
    <ArrowUpDown className="h-4 w-4" />
  ) : sortOrder === "asc" ? (
    <ArrowUp className="h-4 w-4" />
  ) : (
    <ArrowDown className="h-4 w-4" />
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={sortField ? "default" : "outline"}
          size="icon"
          aria-label="Sort questions"
          className="h-9 w-9 shrink-0 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
        >
          {triggerIcon}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 space-y-3" align="end">
        <div className="space-y-2">
          <p className="text-sm font-medium">Sort field</p>
          <Select
            value={sortField || ""}
            onValueChange={(val) => {
              handleFieldChange(val)
              setOpen(false)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose field" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="secondary"
          className="w-full"
          onClick={toggleSortOrder}
          disabled={!sortField}
        >
          {sortOrder === "asc" ? (
            <>
              <ArrowUp className="mr-2 h-4 w-4" />
              Ascending
            </>
          ) : (
            <>
              <ArrowDown className="mr-2 h-4 w-4" />
              Descending
            </>
          )}
        </Button>
      </PopoverContent>
    </Popover>
  )
}
