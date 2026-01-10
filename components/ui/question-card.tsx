"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Bookmark, Clock } from "lucide-react"

type Question = {
  id: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  tags: string[]
}

type Props = {
  question: Question
  attempts: number
  accuracy: number // 0..1
  year: number
  selected: boolean
  bookmarked: boolean
  prevOpen: boolean
  onToggleSelect: (id: string) => void
  onToggleBookmark: (id: string) => void
  onTogglePrev: (id: string) => void
}

export default function QuestionCard({
  question,
  attempts,
  accuracy,
  year,
  selected,
  bookmarked,
  prevOpen,
  onToggleSelect,
  onToggleBookmark,
  onTogglePrev,
}: Props) {
  return (
    <article className="rounded-md border border-border p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggleSelect(question.id)}
            className="mt-1 h-4 w-4 cursor-pointer"
            aria-label={`Select ${question.title}`}
          />

          <div>
            <h3 className="text-base font-medium">{question.title}</h3>

            <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-md bg-muted/10 px-2 py-0.5">{question.difficulty}</span>
              {question.tags.map((t) => (
                <span key={t} className="rounded-md bg-muted/10 px-2 py-0.5">
                  {t}
                </span>
              ))}

              <span className="rounded-md bg-muted/10 px-2 py-0.5">Attempts: {attempts}</span>
              <span className="rounded-md bg-muted/10 px-2 py-0.5">Accuracy: {Math.round(accuracy * 100)}%</span>
              <span className="rounded-md bg-muted/10 px-2 py-0.5">Year: {year}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-pressed={bookmarked}
            onClick={() => onToggleBookmark(question.id)}
            className={`rounded-md p-1 ${bookmarked ? "bg-primary/10 text-primary-dark" : "text-muted-foreground"}`}
            title={bookmarked ? "Bookmarked" : "Bookmark"}
          >
            <Bookmark className="h-4 w-4" />
          </button>

          <button onClick={() => onTogglePrev(question.id)} className="rounded-md p-1 text-muted-foreground" title="Previous attempts">
            <Clock className="h-4 w-4" />
          </button>

          <Button variant="ghost">Preview</Button>
          <Button>Start</Button>
        </div>
      </div>

      {prevOpen ? (
        <div className="mt-3 rounded-md bg-muted/5 border border-border p-3 text-sm">
          <div className="mb-1 font-medium">Previous Attempts</div>
          <div className="text-xs text-muted-foreground">Most recent: {new Date().toLocaleDateString()}</div>
          <div className="mt-2 text-xs">Score: {Math.round(accuracy * 100)}% — Attempts: {attempts}</div>
        </div>
      ) : null}
    </article>
  )
}
