"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Sliders, X } from "lucide-react"
import QuestionCard from "@/components/ui/question-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

export default function RevisionPage() {
  const initialFilters = ["Correct", "Incorrect", "Easy", "Medium", "Hard"]

  const [filtersOrder, setFiltersOrder] = useState<string[]>(initialFilters)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [prevPositions, setPrevPositions] = useState<Record<string, number | null>>({})
  const [expandedFilters, setExpandedFilters] = useState(false)
  const [query, setQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc">("date-desc")

  const visibleCount = 3

  const matchesFilter = (qItem: Question, f: string) => {
    if (f === "Correct") return qItem.correct
    if (f === "Incorrect") return !qItem.correct
    if (["Easy", "Medium", "Hard"].includes(f)) return qItem.difficulty === f
    return qItem.tags.includes(f.toLowerCase())
  }

  const filtered = useMemo(() => {
    let list = SAMPLE_REVISION_QUESTIONS

    if (selectedFilters.length > 0) {
      list = list.filter((q) => {
        return selectedFilters.some((f) => matchesFilter(q, f))
      })
    }

    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter((it) => it.title.toLowerCase().includes(q) || it.tags.join(" ").includes(q) || it.paper.toLowerCase().includes(q))
    }

    list = [...list].sort((a, b) => {
      const dateA = new Date(a.attemptDate).getTime()
      const dateB = new Date(b.attemptDate).getTime()
      return sortBy === "date-desc" ? dateB - dateA : dateA - dateB
    })

    return list
  }, [selectedFilters, query, sortBy])

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

  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    const q = query.trim().toLowerCase()
    for (const f of filtersOrder) {
      counts[f] = SAMPLE_REVISION_QUESTIONS.filter((item) => {
        if (!matchesFilter(item, f)) return false
        if (!q) return true
        return item.title.toLowerCase().includes(q) || item.tags.join(" ").includes(q) || item.paper.toLowerCase().includes(q)
      }).length
    }
    return counts
  }, [filtersOrder, query])

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

      {showFilters ? (
        <div className="mb-4 rounded-md border border-border p-3">
          <div className="text-sm text-muted-foreground">No advanced filters configured — placeholder area.</div>
        </div>
      ) : null}

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-md border border-border p-4 text-muted-foreground">No questions match your search.</div>
        ) : (
          filtered.map((q) => {
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
    </section>
  )
}
