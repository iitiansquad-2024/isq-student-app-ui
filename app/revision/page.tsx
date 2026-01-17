"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Sliders, X } from "lucide-react"
import QuestionCard from "@/components/ui/question-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  attemptDate: string
  correct: boolean
}

const SAMPLE_REVISION_QUESTIONS: Question[] = [
  { id: "q1", title: "Find the derivative of x^2", difficulty: "Easy", tags: ["calculus"], paper: "JEE Main 2024", attemptDate: "2024-01-12", correct: true },
  { id: "q2", title: "A convoy moving south at the speed of 60 km/h collides with a missile moving north-west at 80 km/h. Calculate the time of collision.", difficulty: "Medium", tags: ["calculus", "integration"], paper: "JEE Advanced 2023", attemptDate: "2024-01-11", correct: false },
  { id: "q3", title: "Prove Fermat's little theorem", difficulty: "Hard", tags: ["number-theory"], paper: "JEE Advanced 2023", attemptDate: "2024-01-10", correct: false },
  { id: "q4", title: "Multiple choice: identify the verb", difficulty: "Easy", tags: ["grammar", "mcq"], paper: "BITSAT 2024", attemptDate: "2024-01-09", correct: true },
  { id: "q5", title: "Calculate the limit of sin(x)/x", difficulty: "Medium", tags: ["calculus", "limits"], paper: "JEE Main 2023", attemptDate: "2024-01-08", correct: true },
  { id: "q6", title: "Organic reaction mechanism", difficulty: "Hard", tags: ["chemistry", "organic"], paper: "JEE Advanced 2024", attemptDate: "2024-01-07", correct: false },
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

export default function RevisionPage() {
  const [query, setQuery] = useState("")
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc">("date-desc")
  const [filters, setFilters] = useState<FilterState>({
    subjects: [],
    chapters: [],
    topics: [],
    years: [],
    difficulty: [],
    questionType: [],
    previousYearOnly: true
  })

  const presetFilters = ["Easy", "Medium", "Hard", "Correct", "Incorrect"]
  const [selectedPresets, setSelectedPresets] = useState<string[]>([])
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [displayCount, setDisplayCount] = useState(10)

  const filtered = useMemo(() => {
    let list = SAMPLE_REVISION_QUESTIONS

    // Apply preset filters
    if (selectedPresets.length > 0) {
      list = list.filter((q) => {
        return selectedPresets.every((preset) => {
          if (preset === "Easy" || preset === "Medium" || preset === "Hard") {
            return q.difficulty === preset
          }
          if (preset === "Correct") {
            return q.correct === true
          }
          if (preset === "Incorrect") {
            return q.correct === false
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
      list = list.filter((it) => it.title.toLowerCase().includes(q) || it.tags.join(" ").includes(q) || it.paper.toLowerCase().includes(q))
    }

    // Sort by date or custom field
    list = [...list].sort((a, b) => {
      if (sortField) {
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
      } else {
        const dateA = new Date(a.attemptDate).getTime()
        const dateB = new Date(b.attemptDate).getTime()
        return sortBy === "date-desc" ? dateB - dateA : dateA - dateB
      }
    })

    return list
  }, [filters, query, sortBy, selectedPresets, sortField, sortOrder])

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
          <h1 className="text-2xl font-semibold">Revision</h1>
          <p className="mt-1 text-sm text-muted-foreground">Review questions you've already attempted</p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={(val) => setSortBy(val as any)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Latest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>
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

        {/* Filter Button - Both Mobile and Desktop */}
        <PracticeFilters 
          filters={filters} 
          onFiltersChange={setFilters}
          isMobile={true}
        />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-md border border-border p-4 text-muted-foreground">No questions match your search.</div>
        ) : (
          filtered.slice(0, displayCount).map((q) => {
            const attempts = Math.floor(Math.random() * 10) + 1
            const accuracy = Math.random()
            const year = parseInt(q.paper.match(/\d{4}/)?.[0] || "2024")
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
                prevAttempt={{
                  success: q.correct,
                  time: new Date(q.attemptDate).getTime(),
                  accuracy,
                }}
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
