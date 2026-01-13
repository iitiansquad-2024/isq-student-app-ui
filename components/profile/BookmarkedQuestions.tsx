"use client"

import { useState } from "react"
import QuestionCard from "@/components/ui/question-card"

type Question = {
  id: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  tags: string[]
  paper?: string
}

const SAMPLE_BOOKMARKED_QUESTIONS: Question[] = [
  { id: "q1", title: "Find the derivative of x^2", difficulty: "Easy", tags: ["calculus"], paper: "JEE Main 2024" },
  { id: "q2", title: "Prove Fermat's little theorem", difficulty: "Hard", tags: ["number-theory"], paper: "JEE Advanced 2023" },
  { id: "q3", title: "Calculate the limit of sin(x)/x as x approaches 0", difficulty: "Medium", tags: ["calculus", "limits"], paper: "JEE Main 2023" },
]

export default function BookmarkedQuestions() {
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>(
    Object.fromEntries(SAMPLE_BOOKMARKED_QUESTIONS.map(q => [q.id, true]))
  )
  const [prevOpen, setPrevOpen] = useState<Record<string, boolean>>({})
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({})

  function toggleBookmark(id: string) {
    setBookmarked((s) => ({ ...s, [id]: !s[id] }))
  }

  function togglePrev(id: string) {
    setPrevOpen((s) => ({ ...s, [id]: !s[id] }))
  }

  function toggleSelect(id: string) {
    setSelectedIds((s) => ({ ...s, [id]: !s[id] }))
  }

  const activeBookmarks = SAMPLE_BOOKMARKED_QUESTIONS.filter(q => bookmarked[q.id])

  return (
    <div className="space-y-2 sm:space-y-3">
      {activeBookmarks.length === 0 ? (
        <div className="rounded-md border border-border p-6 sm:p-8 text-center text-muted-foreground">
          <p className="text-sm sm:text-base">No bookmarked questions yet</p>
          <p className="text-xs sm:text-sm mt-1">Bookmark questions while practicing to see them here</p>
        </div>
      ) : (
        activeBookmarks.map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            attempts={Math.floor(Math.random() * 50) + 1}
            accuracy={Math.random()}
            year={2024}
            selected={!!selectedIds[q.id]}
            bookmarked={!!bookmarked[q.id]}
            prevOpen={!!prevOpen[q.id]}
            prevAttempt={{
              success: Math.random() > 0.5,
              time: Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7,
              accuracy: Math.random(),
            }}
            onToggleSelect={toggleSelect}
            onToggleBookmark={toggleBookmark}
            onTogglePrev={togglePrev}
          />
        ))
      )}
    </div>
  )
}
