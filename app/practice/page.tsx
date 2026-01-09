"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Sliders } from "lucide-react"

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
  const [activeTab, setActiveTab] = useState<string>("All")
  const [query, setQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const tabs = ["All", "Easy", "Medium", "Hard", "MCQ"]

  const filtered = useMemo(() => {
    let list = SAMPLE_QUESTIONS
    if (activeTab !== "All") {
      if (activeTab === "MCQ") {
        list = list.filter((q) => q.tags.includes("mcq"))
      } else {
        list = list.filter((q) => q.difficulty === activeTab)
      }
    }
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter((it) => it.title.toLowerCase().includes(q) || it.tags.join(" ").includes(q))
    }
    return list
  }, [activeTab, query])

  return (
    <section className="py-4">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold">Practice</h1>
        <p className="mt-1 text-sm text-muted-foreground">Pick a filter or search to find questions</p>
      </header>

      {/* 1. Preset filters (tabs) */}
      <div className="mb-4 flex gap-2 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition ${
              activeTab === t ? "bg-primary text-primary-foreground" : "bg-background/50 text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
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
          filtered.map((q) => (
            <article key={q.id} className="flex items-start justify-between gap-4 rounded-md border border-border p-4">
              <div>
                <h3 className="text-base font-medium">{q.title}</h3>
                <div className="mt-1 flex gap-2 text-xs text-muted-foreground">
                  <span className="rounded-md bg-muted/10 px-2 py-0.5">{q.difficulty}</span>
                  {q.tags.map((t) => (
                    <span key={t} className="rounded-md bg-muted/10 px-2 py-0.5">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost">Preview</Button>
                <Button>Start</Button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}
