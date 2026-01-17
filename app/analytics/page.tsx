"use client"

import { useState, useMemo, useEffect } from "react"
import { TrendingUp, Target, Award, BookOpen, CheckCircle2, XCircle, Clock, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import StreakAnalytics from "@/components/ui/analytics/StreakAnalytics"
import CoverageAnalytics from "@/components/ui/analytics/CoverageAnalytics"
import RevisionDebtAnalytics from "@/components/ui/analytics/RevisionDebtAnalytics"
import ActivityHeatmap from "@/components/ui/activity-heatmap"
import CoverageStats from "@/components/analytics/CoverageStats"

function generateSampleActivityData(year: number, seed: number): Record<string, number> {
  const data: Record<string, number> = {}
  const startDate = new Date(year, 0, 1)
  const endDate = new Date(year, 11, 31)
  
  // Use seed for consistent random generation
  let random = seed
  const seededRandom = () => {
    random = (random * 9301 + 49297) % 233280
    return random / 233280
  }
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
    if (seededRandom() > 0.6) {
      data[dateKey] = Math.floor(seededRandom() * 15) + 1
    }
  }
  
  return data
}

export default function AnalyticsPage() {
  const [selectedSubject, setSelectedSubject] = useState<"all" | "physics" | "chemistry" | "mathematics">("all")
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const activityData = useMemo(() => {
    if (!mounted) return {}
    return generateSampleActivityData(selectedYear, selectedYear)
  }, [selectedYear, mounted])
  
  const yearStats = useMemo(() => {
    if (!activityData) return {}
    const values = Object.values(activityData)
    const totalAttempted = values.reduce((sum, count) => sum + count, 0)
    const daysActive = values.filter(count => count > 0).length
    const avgPerDay = daysActive > 0 ? totalAttempted / daysActive : 0
    
    return {
      totalAttempted,
      daysActive,
      avgPerDay: avgPerDay.toFixed(1),
    }
  }, [activityData])

  // Mock data - replace with real data
  const stats = {
    totalQuestions: 1250,
    attempted: 856,
    correct: 642,
    accuracy: 75,
    streak: 12,
    weakTopics: [
      { name: "Thermodynamics", accuracy: 45, attempted: 23 },
      { name: "Organic Chemistry", accuracy: 52, attempted: 31 },
      { name: "Calculus", accuracy: 58, attempted: 45 },
    ],
    strongTopics: [
      { name: "Mechanics", accuracy: 92, attempted: 67 },
      { name: "Algebra", accuracy: 88, attempted: 54 },
      { name: "Inorganic Chemistry", accuracy: 85, attempted: 42 },
    ],
    subjectWise: {
      physics: { attempted: 285, correct: 218, total: 450, accuracy: 76 },
      chemistry: { attempted: 312, correct: 229, total: 400, accuracy: 73 },
      mathematics: { attempted: 259, correct: 195, total: 400, accuracy: 75 },
    },
    recentPerformance: [
      { date: "Week 1", accuracy: 68 },
      { date: "Week 2", accuracy: 72 },
      { date: "Week 3", accuracy: 75 },
      { date: "Week 4", accuracy: 78 },
    ],
  }

  return (
    <section className="py-8 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Performance Analytics</h1>
        <p className="mt-1 text-base text-muted-foreground">
          Track your preparation progress and identify areas for improvement
        </p>
      </header>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Attempted</span>
          </div>
          <div className="text-2xl font-bold">{stats.attempted}</div>
          <p className="text-xs text-muted-foreground mt-1">of {stats.totalQuestions} questions</p>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-green-600" />
            <span className="text-sm text-muted-foreground">Accuracy</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.accuracy}%</div>
          <p className="text-xs text-muted-foreground mt-1">{stats.correct} correct</p>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-secondary" />
            <span className="text-sm text-muted-foreground">Streak</span>
          </div>
          <div className="text-2xl font-bold text-secondary">{stats.streak}</div>
          <p className="text-xs text-muted-foreground mt-1">days active</p>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-muted-foreground">Trend</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">+10%</div>
          <p className="text-xs text-muted-foreground mt-1">vs last week</p>
        </div>
      </div>

      {/* Subject-wise Performance */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Subject-wise Performance</h2>
        <div className="space-y-4">
          {Object.entries(stats.subjectWise).map(([subject, data]) => (
            <div key={subject} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium capitalize">{subject}</span>
                  <Badge variant="outline" className="text-xs">
                    {data.attempted}/{data.total}
                  </Badge>
                </div>
                <span className="text-sm font-medium">{data.accuracy}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={(data.attempted / data.total) * 100} className="flex-1" />
                <span className="text-xs text-muted-foreground w-12 text-right">
                  {Math.round((data.attempted / data.total) * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weak & Strong Topics */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Weak Topics */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="h-5 w-5 text-red-600" />
            <h2 className="text-lg font-semibold">Focus Areas</h2>
          </div>
          <div className="space-y-3">
            {stats.weakTopics.map((topic, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{topic.name}</span>
                  <Badge variant="destructive" className="text-xs">{topic.accuracy}%</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={topic.accuracy} className="flex-1" />
                  <span className="text-xs text-muted-foreground">{topic.attempted} Qs</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strong Topics */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold">Strong Areas</h2>
          </div>
          <div className="space-y-3">
            {stats.strongTopics.map((topic, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{topic.name}</span>
                  <Badge variant="secondary" className="text-xs">{topic.accuracy}%</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={topic.accuracy} className="flex-1" />
                  <span className="text-xs text-muted-foreground">{topic.attempted} Qs</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Trend */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Weekly Performance Trend</h2>
        <div className="space-y-3">
          {stats.recentPerformance.map((week, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <span className="text-sm font-medium w-16">{week.date}</span>
              <div className="flex-1">
                <Progress value={week.accuracy} />
              </div>
              <span className="text-sm font-medium w-12 text-right">{week.accuracy}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Streak, Coverage & Revision Debt */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StreakAnalytics current={stats.streak} goal={30} />
        <CoverageAnalytics percent={Math.round((stats.attempted / stats.totalQuestions) * 100)} />
        <RevisionDebtAnalytics overdue={12} />
      </div>

      {/* Activity Heatmap */}
      <div className="rounded-md border border-border bg-background p-4">
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-md border border-border p-3">
            <div className="text-sm text-muted-foreground mb-1">Total Attempted ({selectedYear})</div>
            <div className="text-2xl font-bold">{yearStats.totalAttempted}</div>
          </div>
          <div className="rounded-md border border-border p-3">
            <div className="text-sm text-muted-foreground mb-1">Active Days</div>
            <div className="text-2xl font-bold text-emerald-600">{yearStats.daysActive}</div>
          </div>
          <div className="rounded-md border border-border p-3">
            <div className="text-sm text-muted-foreground mb-1">Avg. Per Active Day</div>
            <div className="text-2xl font-bold text-blue-600">{yearStats.avgPerDay}</div>
          </div>
        </div>
        
        <ActivityHeatmap />
      </div>

      {/* Coverage Stats */}
      <div className="rounded-md border border-border bg-background p-4">
        <CoverageStats />
      </div>

      {/* Recommendations */}
      <div className="rounded-lg border bg-secondary/10 border-secondary/20 p-6">
        <div className="flex items-start gap-3">
          <Award className="h-5 w-5 text-secondary mt-0.5" />
          <div>
            <h3 className="font-semibold mb-2">Recommendations</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Focus on <strong>Thermodynamics</strong> - practice 10 more questions to improve accuracy</li>
              <li>• Revise <strong>Organic Chemistry</strong> concepts - accuracy below 60%</li>
              <li>• Great progress in <strong>Mechanics</strong> - maintain the momentum!</li>
              <li>• Attempt at least 20 questions daily to maintain your {stats.streak}-day streak</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
