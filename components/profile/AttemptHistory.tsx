"use client"

import { Clock, CheckCircle, XCircle, Calendar } from "lucide-react"
import {Badge} from "@/components/ui/badge"

type AttemptHistoryItem = {
  id: string
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  tags: string[]
  paper: string
  attemptDate: string
  correct: boolean
  timeTaken: string
}

const SAMPLE_ATTEMPT_HISTORY: AttemptHistoryItem[] = [
  { 
    id: "q1", 
    title: "Find the derivative of x^2", 
    difficulty: "Easy", 
    tags: ["calculus"], 
    paper: "JEE Main 2024", 
    attemptDate: "2024-01-12", 
    correct: true, 
    timeTaken: "2m 30s" 
  },
  { 
    id: "q3", 
    title: "Calculate the limit", 
    difficulty: "Medium", 
    tags: ["calculus", "limits"], 
    paper: "JEE Main 2023", 
    attemptDate: "2024-01-11", 
    correct: false, 
    timeTaken: "5m 10s" 
  },
  { 
    id: "q4", 
    title: "Solve quadratic equation", 
    difficulty: "Easy", 
    tags: ["algebra"], 
    paper: "BITSAT 2024", 
    attemptDate: "2024-01-10", 
    correct: true, 
    timeTaken: "1m 45s" 
  },
  { 
    id: "q5", 
    title: "Organic reaction mechanism", 
    difficulty: "Hard", 
    tags: ["chemistry", "organic"], 
    paper: "JEE Advanced 2024", 
    attemptDate: "2024-01-09", 
    correct: false, 
    timeTaken: "8m 20s" 
  },
  { 
    id: "q6", 
    title: "Newton's laws application", 
    difficulty: "Medium", 
    tags: ["physics", "mechanics"], 
    paper: "JEE Main 2024", 
    attemptDate: "2024-01-08", 
    correct: true, 
    timeTaken: "4m 15s" 
  },
]

export default function AttemptHistory() {
  return (
    <div className="space-y-2 sm:space-y-3">
      {SAMPLE_ATTEMPT_HISTORY.length === 0 ? (
        <div className="rounded-md border border-border p-6 sm:p-8 text-center text-muted-foreground">
          <p className="text-sm sm:text-base">No attempt history yet</p>
          <p className="text-xs sm:text-sm mt-1">Start practicing to see your attempt history here</p>
        </div>
      ) : (
        SAMPLE_ATTEMPT_HISTORY.map((attempt) => (
          <article
            key={attempt.id}
            className="rounded-md border border-border p-3 sm:p-4"
          >
            <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {attempt.correct ? (
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
                  )}
                  <h3 className="text-sm sm:text-base font-medium line-clamp-2">{attempt.title}</h3>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <Badge variant="outline" className="text-xs">{attempt.paper}</Badge>
                  <Badge variant="outline" className="text-xs">{attempt.difficulty}</Badge>
                  {attempt.tags.map((tag) => (
                    <Badge key={tag} className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 flex-shrink-0" />
                <span>{new Date(attempt.attemptDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 flex-shrink-0" />
                <span>{attempt.timeTaken}</span>
              </div>
              <Badge variant={attempt.correct ? "default" : "outline"} className="text-xs">
                {attempt.correct ? "Correct" : "Incorrect"}
              </Badge>
            </div>
          </article>
        ))
      )}
    </div>
  )
}
