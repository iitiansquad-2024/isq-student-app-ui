"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Sliders, X } from "lucide-react"
import Streak from "@/components/ui/streak"
import QuestionCard from "@/components/ui/question-card"

type Question = {
  id: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  tags: string[]
}

const SAMPLE_QUESTIONS: Question[] = [
  { id: "q1", title: "Find the derivative of x^2", difficulty: "Easy", tags: ["calculus"] },
  { id: "q2", title: "Solve integrals with substitution", difficulty: "Medium", tags: ["calculus", "integration"] },
  { id: "q3", title: "Prove Fermat's little theorem", difficulty: "Hard", tags: ["number-theory"] },
  { id: "q4", title: "Multiple choice: identify the verb", difficulty: "Easy", tags: ["grammar", "mcq"] },
]

export default function PracticePage() {
  // Preset filters (exclude 'All' which behaves as no filter)
  const initialFilters = ["Easy", "Medium", "Hard", "MCQ"]

  const [filtersOrder, setFiltersOrder] = useState<string[]>(initialFilters)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [prevPositions, setPrevPositions] = useState<Record<string, number | null>>({})
  const [expandedFilters, setExpandedFilters] = useState(false)
  const [query, setQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const visibleCount = 3

  const matchesFilter = (qItem: Question, f: string) => {
    if (f === "MCQ") return qItem.tags.includes("mcq")
    if (["Easy", "Medium", "Hard"].includes(f)) return qItem.difficulty === f
    return qItem.tags.includes(f.toLowerCase())
  }

  const filtered = useMemo(() => {
    let list = SAMPLE_QUESTIONS

    if (selectedFilters.length > 0) {
      list = list.filter((q) => {
        return selectedFilters.some((f) => {
          if (f === "MCQ") return q.tags.includes("mcq")
          if (["Easy", "Medium", "Hard"].includes(f)) return q.difficulty === f
          return q.tags.includes(f.toLowerCase())
        })
      })
    }

    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter((it) => it.title.toLowerCase().includes(q) || it.tags.join(" ").includes(q))
    }

    return list
  }, [selectedFilters, query])

  // selection, bookmark and previous-attempt UI state per question
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

  // counts for each preset filter considering current query
  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    const q = query.trim().toLowerCase()
    for (const f of filtersOrder) {
      counts[f] = SAMPLE_QUESTIONS.filter((item) => {
        if (!matchesFilter(item, f)) return false
        if (!q) return true
        return item.title.toLowerCase().includes(q) || item.tags.join(" ").includes(q)
      }).length
    }
    return counts
  }, [filtersOrder, query])

  return (
    <section className="py-8">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Practice</h1>
          <p className="mt-1 text-sm text-muted-foreground">Pick a filter or search to find questions</p>
        </div>

        <Streak goal={7} size={48} currentDays={5} />
      </header>

      {/* 1. Preset filters (multi-select, expandable) */}
      <div className="mb-4 rounded-xl bg-stone-50">
        <div className="flex items-center gap-2 overflow-x-auto py-2 px-0.5 flex-wrap">
          {(expandedFilters ? filtersOrder : filtersOrder.slice(0, visibleCount)).map((f) => {
            const selected = selectedFilters.includes(f)
            return (
              <div key={f} className="relative">
                <div
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      if (selected) return
                      setPrevPositions((p) => ({ ...p, [f]: filtersOrder.indexOf(f) }))
                      setFiltersOrder((arr) => [f, ...arr.filter((x) => x !== f)])
                      setSelectedFilters((s) => [f, ...s])
                    }
                  }}
                  onClick={() => {
                    if (selected) return
                    // select and move to front, store previous position
                    setPrevPositions((p) => ({ ...p, [f]: filtersOrder.indexOf(f) }))
                    setFiltersOrder((arr) => [f, ...arr.filter((x) => x !== f)])
                    setSelectedFilters((s) => [f, ...s])
                  }}
                  className={`focus:ring-2 focus:ring-primary-dark flex cursor-pointer items-center gap-2 rounded-full px-3 py-1 text-sm font-medium transition ${
                    selected ? "bg-primary text-primary-foreground" : "bg-transparent text-muted-foreground"
                  }`}
                >
                  <span>
                    {f} <span className="ml-1 text-xs text-muted-foreground">({filterCounts[f] ?? 0})</span>
                  </span>
                  {selected ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // remove and restore previous position
                        const prev = prevPositions[f]
                        setFiltersOrder((arr) => {
                          const without = arr.filter((x) => x !== f)
                          const insertAt = prev != null ? Math.min(Math.max(prev, 0), without.length) : without.length
                          const res = [...without]
                          res.splice(insertAt, 0, f)
                          return res
                        })
                        setPrevPositions((p) => {
                          const copy = { ...p }
                          delete copy[f]
                          return copy
                        })
                        setSelectedFilters((s) => s.filter((x) => x !== f))
                      }}
                      aria-label={`Remove ${f}`}
                      className="ml-1 inline-flex items-center justify-center rounded-full p-0.5 text-muted-foreground cursor-pointer hover:bg-black/5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  ) : null}
                </div>
              </div>
            )
          })}

          {filtersOrder.length > visibleCount ? (
            <button
              className="ml-2 rounded-full px-3 py-1 text-sm text-muted-foreground cursor-pointer hover:bg-background/50 underline"
              onClick={() => setExpandedFilters((s) => !s)}
            >
              {expandedFilters ? "Show less" : "Show all"}
            </button>
          ) : null}
        </div>
      </div>

      {/* 2. Search and filter row */}
      <div className="mb-4 flex w-full items-center gap-3">
        <div className="flex w-full items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search questions or tags" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        <Button variant="outline" onClick={() => setShowFilters((s) => !s)} className="px-3">
          <Sliders className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Optional filter area */}
      {showFilters ? (
        <div className="mb-4 rounded-md border border-border p-3">
          <div className="text-sm text-muted-foreground">No advanced filters configured — placeholder area.</div>
        </div>
      ) : null}

      {/* 3. Question list row */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-md border border-border p-4 text-muted-foreground">No questions match your search.</div>
        ) : (
          filtered.map((q) => {
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
                onToggleSelect={toggleSelect}
                onToggleBookmark={toggleBookmark}
                onTogglePrev={togglePrev}
              />
            )
          })
        )}
      </div>
    </section>
  )
}
