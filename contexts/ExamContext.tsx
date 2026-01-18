"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Exam = {
  id: string
  name: string
}

interface ExamContextType {
  selectedExam: string
  setSelectedExam: (examId: string) => void
  exams: Exam[]
}

const ExamContext = createContext<ExamContextType | undefined>(undefined)

const exams: Exam[] = [
  { id: "jee", name: "JEE Main & Advanced" },
  { id: "neet", name: "NEET" },
  { id: "gate", name: "GATE" },
  { id: "upsc", name: "UPSC" },
]

export function ExamProvider({ children }: { children: ReactNode }) {
  const [selectedExam, setSelectedExamState] = useState("jee")

  useEffect(() => {
    const savedExam = localStorage.getItem("selectedExam")
    if (savedExam && exams.find(exam => exam.id === savedExam)) {
      setSelectedExamState(savedExam)
    }
  }, [])

  const setSelectedExam = (examId: string) => {
    setSelectedExamState(examId)
    localStorage.setItem("selectedExam", examId)
  }

  return (
    <ExamContext.Provider value={{ selectedExam, setSelectedExam, exams }}>
      {children}
    </ExamContext.Provider>
  )
}

export function useExam() {
  const context = useContext(ExamContext)
  if (context === undefined) {
    return {
      selectedExam: "jee",
      setSelectedExam: () => {},
      exams: exams
    }
  }
  return context
}
