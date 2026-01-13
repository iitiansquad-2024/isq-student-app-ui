"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {Badge} from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

type CoverageData = {
  overall: {
    totalQuestions: number
    attempted: number
    correct: number
    avgAccuracy: number
  }
  byYear: Record<string, { attempted: number; correct: number; accuracy: number }>
  bySubject: Record<string, { attempted: number; correct: number; accuracy: number }>
  byDifficulty: Record<string, { attempted: number; correct: number; accuracy: number }>
  byChapter: Record<string, { attempted: number; correct: number; accuracy: number }>
}

const SAMPLE_COVERAGE_DATA: CoverageData = {
  overall: {
    totalQuestions: 500,
    attempted: 245,
    correct: 180,
    avgAccuracy: 73.5,
  },
  byYear: {
    "2024": { attempted: 120, correct: 92, accuracy: 76.7 },
    "2023": { attempted: 85, correct: 60, accuracy: 70.6 },
    "2022": { attempted: 40, correct: 28, accuracy: 70.0 },
  },
  bySubject: {
    "Physics": { attempted: 95, correct: 72, accuracy: 75.8 },
    "Chemistry": { attempted: 80, correct: 58, accuracy: 72.5 },
    "Mathematics": { attempted: 70, correct: 50, accuracy: 71.4 },
  },
  byDifficulty: {
    "Easy": { attempted: 120, correct: 105, accuracy: 87.5 },
    "Medium": { attempted: 90, correct: 60, accuracy: 66.7 },
    "Hard": { attempted: 35, correct: 15, accuracy: 42.9 },
  },
  byChapter: {
    "Calculus": { attempted: 45, correct: 35, accuracy: 77.8 },
    "Mechanics": { attempted: 40, correct: 30, accuracy: 75.0 },
    "Organic Chemistry": { attempted: 35, correct: 23, accuracy: 65.7 },
    "Algebra": { attempted: 30, correct: 25, accuracy: 83.3 },
    "Thermodynamics": { attempted: 25, correct: 18, accuracy: 72.0 },
  },
}

type StatCardProps = {
  label: string
  attempted: number
  correct: number
  accuracy: number
}

function StatCard({ label, attempted, correct, accuracy }: StatCardProps) {
  return (
    <div className="rounded-md border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium">{label}</h4>
        <Badge>{accuracy.toFixed(1)}%</Badge>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Attempted</span>
          <span className="font-medium">{attempted}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Correct</span>
          <span className="font-medium text-emerald-600">{correct}</span>
        </div>
        <Progress value={(correct / attempted) * 100} className="h-2" />
      </div>
    </div>
  )
}

export default function CoverageStats({ data = SAMPLE_COVERAGE_DATA }: { data?: CoverageData }) {
  const [activeTab, setActiveTab] = useState("overall")

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Coverage Analysis</h3>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overall">Overall</TabsTrigger>
          <TabsTrigger value="year">By Year</TabsTrigger>
          <TabsTrigger value="subject">By Subject</TabsTrigger>
          <TabsTrigger value="difficulty">By Difficulty</TabsTrigger>
          <TabsTrigger value="chapter">By Chapter</TabsTrigger>
        </TabsList>

        <TabsContent value="overall">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-md border border-border p-4">
              <div className="text-sm text-muted-foreground mb-1">Total Questions</div>
              <div className="text-2xl font-bold">{data.overall.totalQuestions}</div>
            </div>
            <div className="rounded-md border border-border p-4">
              <div className="text-sm text-muted-foreground mb-1">Attempted</div>
              <div className="text-2xl font-bold text-blue-600">{data.overall.attempted}</div>
            </div>
            <div className="rounded-md border border-border p-4">
              <div className="text-sm text-muted-foreground mb-1">Correct</div>
              <div className="text-2xl font-bold text-emerald-600">{data.overall.correct}</div>
            </div>
            <div className="rounded-md border border-border p-4">
              <div className="text-sm text-muted-foreground mb-1">Avg. Accuracy</div>
              <div className="text-2xl font-bold">{data.overall.avgAccuracy.toFixed(1)}%</div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="year">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(data.byYear).map(([year, stats]) => (
              <StatCard
                key={year}
                label={year}
                attempted={stats.attempted}
                correct={stats.correct}
                accuracy={stats.accuracy}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="subject">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(data.bySubject).map(([subject, stats]) => (
              <StatCard
                key={subject}
                label={subject}
                attempted={stats.attempted}
                correct={stats.correct}
                accuracy={stats.accuracy}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="difficulty">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(data.byDifficulty).map(([difficulty, stats]) => (
              <StatCard
                key={difficulty}
                label={difficulty}
                attempted={stats.attempted}
                correct={stats.correct}
                accuracy={stats.accuracy}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="chapter">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(data.byChapter).map(([chapter, stats]) => (
              <StatCard
                key={chapter}
                label={chapter}
                attempted={stats.attempted}
                correct={stats.correct}
                accuracy={stats.accuracy}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
