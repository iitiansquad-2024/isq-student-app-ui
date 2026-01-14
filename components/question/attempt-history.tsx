"use client";

import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SAMPLE_ATTEMPTS = [
  {
    id: "a1",
    timestamp: "2024-01-13T10:00:00Z",
    answer: "2.5",
    isCorrect: true,
  },
  {
    id: "a2",
    timestamp: "2024-01-13T11:00:00Z",
    answer: "5.0",
    isCorrect: false,
  },
  {
    id: "a3",
    timestamp: "2024-01-13T12:00:00Z",
    answer: "7.5",
    isCorrect: true,
  },
];

export function AttemptHistory() {
  // Calculate cumulative accuracy for each attempt
  const accuracyTrend = SAMPLE_ATTEMPTS.reduce((acc, attempt, idx) => {
    const previousCorrect = acc[idx - 1]?.correctCount || 0;
    const currentCorrect = attempt.isCorrect ? previousCorrect + 1 : previousCorrect;
    const accuracy = (currentCorrect / (idx + 1)) * 100;

    return [...acc, {
      correctCount: currentCorrect,
      accuracy: Math.round(accuracy),
      attemptNumber: idx + 1,
    }];
  }, [] as { correctCount: number; accuracy: number; attemptNumber: number }[]);

  const chartData = {
    labels: accuracyTrend.map(a => `Attempt ${a.attemptNumber}`),
    datasets: [
      {
        label: "Cumulative Accuracy (%)",
        data: accuracyTrend.map(a => a.accuracy),
        borderColor: "#FFCD29",
        backgroundColor: "rgba(255, 205, 41, 0.1)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {/* Stats */}
        <div className="rounded-lg border p-4">
          <h3 className="text-sm font-medium mb-2">Overall Stats</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-2xl font-bold">
                {SAMPLE_ATTEMPTS.length}
              </p>
              <p className="text-xs text-muted-foreground">Total Attempts</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">
                {accuracyTrend[accuracyTrend.length - 1].accuracy}%
              </p>
              <p className="text-xs text-muted-foreground">Current Accuracy</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">
                {SAMPLE_ATTEMPTS.filter(a => a.isCorrect).length}
              </p>
              <p className="text-xs text-muted-foreground">Correct Answers</p>
            </div>
          </div>
        </div>

        {/* Accuracy Trend */}
        <div className="rounded-lg border p-4">
          <h3 className="text-sm font-medium mb-2">Accuracy Trend</h3>
          <div className="h-[150px]">
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      callback: (value) => `${value}%`,
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Attempt List */}
      <div className="rounded-lg border">
        <h3 className="text-sm font-medium p-4 border-b">Attempt History</h3>
        <div className="divide-y">
          {SAMPLE_ATTEMPTS.map((attempt, idx) => (
            <div key={attempt.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Attempt {idx + 1}</span>
                    <Badge
                      variant={attempt.isCorrect ? "secondary" : "destructive"}
                      className="capitalize"
                    >
                      {attempt.isCorrect ? "Correct" : "Incorrect"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(attempt.timestamp).toLocaleDateString()} •{" "}
                    {accuracyTrend[idx].accuracy}% accuracy
                  </p>
                </div>
                <div className="text-sm">
                  Your answer: <span className="font-medium">{attempt.answer}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
