"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Sliders, X } from "lucide-react"
import Streak from "@/components/ui/streak"
import QuestionCard from "@/components/ui/question-card"
import PracticeFilters from "@/components/practice/PracticeFilters"
import PresetFilters from "@/components/practice/PresetFilters"
import SortByComponent, { SortField, SortOrder } from "@/components/practice/SortByComponent"
import ActiveFilters from "@/components/practice/ActiveFilters"
import Footer from "@/components/ui/footer"

type Question = {
  id: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  tags: string[]
  paper: string
}

const SAMPLE_QUESTIONS: Question[] = [
  { id: "q1", title: "Find the derivative of x^2", difficulty: "Easy", tags: ["calculus"], paper: "JEE Main 2024" },
  { id: "q2", title: "A convoy moving south at the speed of 60 km/h collides with a missile moving north-west at 80 km/h. Calculate the time of collision.", difficulty: "Medium", tags: ["calculus", "integration"], paper: "JEE Advanced 2023" },
  { id: "q3", title: "Prove Fermat's little theorem", difficulty: "Hard", tags: ["number-theory"], paper: "JEE Advanced 2023" },
  { id: "q4", title: "Multiple choice: identify the verb", difficulty: "Easy", tags: ["grammar", "mcq"], paper: "BITSAT 2024" },
]

interface FilterState {
  subjects: string[]
  chapters: string[]
  topics: string[]
  years: string[]
  difficulty: string[]
  questionType: string[]
  previousYearOnly: boolean
}

export default function Home() {
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    subjects: [],
    chapters: [],
    topics: [],
    years: [],
    difficulty: [],
    questionType: [],
    previousYearOnly: true
  })

  const presetFilters = ["Easy", "Medium", "Hard", "MCQ", "Numerical", "Previous Year"]
  const [selectedPresets, setSelectedPresets] = useState<string[]>([])
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [displayCount, setDisplayCount] = useState(10)

  const visibleCount = 3

  const filtered = useMemo(() => {
    let list = SAMPLE_QUESTIONS

    // Apply preset filters
    if (selectedPresets.length > 0) {
      list = list.filter((q) => {
        return selectedPresets.every((preset) => {
          if (preset === "Easy" || preset === "Medium" || preset === "Hard") {
            return q.difficulty === preset
          }
          if (preset === "MCQ") {
            return q.tags.includes("mcq")
          }
          if (preset === "Previous Year") {
            return true
          }
          return true
        })
      })
    }

    // Apply difficulty filter
    if (filters.difficulty.length > 0) {
      list = list.filter((q) => filters.difficulty.includes(q.difficulty))
    }

    // Apply search query
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter((it) => it.title.toLowerCase().includes(q) || it.tags.join(" ").includes(q))
    }

    // Apply sorting
    if (sortField) {
      list = [...list].sort((a, b) => {
        let aValue: any, bValue: any
        
        switch (sortField) {
          case "id":
            aValue = parseInt(a.id.replace("q", ""))
            bValue = parseInt(b.id.replace("q", ""))
            break
          case "year":
            aValue = parseInt(a.paper.match(/\d{4}/)?.[0] || "0")
            bValue = parseInt(b.paper.match(/\d{4}/)?.[0] || "0")
            break
          case "difficulty":
            const diffOrder = { Easy: 1, Medium: 2, Hard: 3 }
            aValue = diffOrder[a.difficulty]
            bValue = diffOrder[b.difficulty]
            break
          default:
            return 0
        }
        
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue
      })
    }

    return list
  }, [filters, query, selectedPresets, sortField, sortOrder])

  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({})
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({})
  const [prevOpen, setPrevOpen] = useState<Record<string, boolean>>({})

  function toggleSelect(id: string) {
    setSelectedIds((s) => ({ ...s, [id]: !s[id] }))
  }

  function toggleBookmark(id: string) {
    setBookmarked((s) => ({ ...s, [id]: !s[id] }))
  }

  function togglePrev(id: string) {
    setPrevOpen((s) => ({ ...s, [id]: !s[id] }))
  }

  return (
    <section className="py-8">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Practice</h1>
          <p className="mt-1 text-sm text-muted-foreground">Pick a filter or search to find questions</p>
        </div>

        <div className="flex items-center gap-4">
          <Streak goal={18} size={48} currentDays={5} meterDescription="practice meter" meterUnit=" Question" />
        </div>
      </header>

      {/* Preset Filters */}
      <PresetFilters
        presetFilters={presetFilters}
        selectedPresets={selectedPresets}
        onTogglePreset={(filter) => {
          setSelectedPresets((prev) =>
            prev.includes(filter)
              ? prev.filter((f) => f !== filter)
              : [...prev, filter]
          )
        }}
      />

      {/* Active Filters Display */}
      <ActiveFilters
        filters={filters}
        onRemoveFilter={(type, value) => {
          setFilters((prev) => ({
            ...prev,
            [type]: (prev[type] as string[]).filter((item) => item !== value),
          }))
        }}
        onClearAll={() => {
          setFilters({
            subjects: [],
            chapters: [],
            topics: [],
            years: [],
            difficulty: [],
            questionType: [],
            previousYearOnly: true,
          })
        }}
      />

      {/* Search, Sort and Filter Button */}
      <div className="mb-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search questions or tags" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Sort By Component */}
        <SortByComponent
          sortField={sortField}
          sortOrder={sortOrder}
          onSortChange={(field, order) => {
            setSortField(field)
            setSortOrder(order)
          }}
        />

        {/* Filter Button - Both Mobile and Desktop */}
        <PracticeFilters 
          filters={filters} 
          onFiltersChange={setFilters}
          isMobile={true}
        />
      </div>

      {/* 3. Question list row */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-md border border-border p-4 text-muted-foreground">No questions match your search.</div>
        ) : (
          filtered.slice(0, displayCount).map((q) => {
            const attempts = q.id === "q1" ? 12 : q.id === "q2" ? 34 : q.id === "q3" ? 7 : 3
            const accuracy = q.id === "q1" ? 0.82 : q.id === "q2" ? 0.63 : q.id === "q3" ? 0.49 : 0.92
            const year = q.id === "q1" ? 2024 : q.id === "q2" ? 2025 : q.id === "q3" ? 2023 : 2026
            const selected = !!selectedIds[q.id]
            const isBookmarked = !!bookmarked[q.id]

            return (
              <QuestionCard
                key={q.id}
                question={q}
                attempts={attempts}
                accuracy={accuracy}
                year={year}
                selected={selected}
                bookmarked={isBookmarked}
                prevOpen={!!prevOpen[q.id]}
                prevAttempt={
                  q.id === "q1"
                    ? { success: true, time: Date.now() - 1000 * 60 * 60 * 24, accuracy }
                    : q.id === "q2"
                    ? { success: false, time: Date.now() - 1000 * 60 * 60 * 24 * 3, accuracy }
                    : q.id === "q3"
                    ? { success: false, time: Date.now() - 1000 * 60 * 60 * 24 * 7, accuracy }
                    : undefined
                }
                onToggleSelect={toggleSelect}
                onToggleBookmark={toggleBookmark}
                onTogglePrev={togglePrev}
              />
            )
          })
        )}
      </div>

      {/* Load More Button */}
      {filtered.length > displayCount && (
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={() => setDisplayCount(prev => prev + 10)}
            className="min-w-[200px]"
          >
            Load More Questions
          </Button>
        </div>
      )}

      <Footer />
    </section>
  )
}
