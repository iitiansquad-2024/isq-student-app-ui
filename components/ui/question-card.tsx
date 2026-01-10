"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bookmark, Clock } from "lucide-react";
import Badge from "@/components/ui/badge";
import { motion } from "framer-motion";
import Checkbox from "@/components/ui/checkbox";

type Question = {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
};

type Props = {
  question: Question;
  attempts: number;
  accuracy: number; // 0..1
  year: number;
  selected: boolean;
  bookmarked: boolean;
  prevOpen: boolean;
  onToggleSelect: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onTogglePrev: (id: string) => void;
};

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
    <article className="rounded-md border border-border p-4" onClick={() => {
        // onTogglePrev(question.id);
    }}>
      {/* Row 1: checkbox, heading, actions (wrap on overflow) */}
      <div className="flex items-center justify-between gap-3 ">
        <div className="flex items-center gap-3 min-w-0">
          <Checkbox
            checked={selected}
            onChange={() => onToggleSelect(question.id)}
            className="shrink-0"
            aria-label={`Select ${question.title}`}
          />

          <h3 className="text-base font-medium truncate">{question.title}</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-pressed={bookmarked}
            onClick={() => onToggleBookmark(question.id)}
            className={`rounded-md p-1 ${
              bookmarked ? "bg-primary/10 text-primary-dark" : "text-muted-foreground"
            }`}
            title={bookmarked ? "Bookmarked" : "Bookmark"}
          >
            <Bookmark className="h-4 w-4" />
          </button>

          <button
            onClick={() => onTogglePrev(question.id)}
            className="rounded-md p-1 text-muted-foreground"
            title="Previous attempts"
          >
            <Clock className="h-4 w-4" />
          </button>

        </div>
      </div>

      {/* Row 2: data badges (wrap) */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge  className="font-semibold bg-ui-yellow text-white">{question.difficulty}</Badge>
        {question.tags.map((t) => (
          <Badge key={t}>{t}</Badge>
        ))}

        <Badge>Attempts: {attempts}</Badge>

        {/* small circular accuracy */}
        <div className="inline-flex items-center gap-1">
          {(() => {
            const size = 22
            const radius = (size - 4) / 2
            const circumference = 2 * Math.PI * radius
            const dash = (circumference * Math.min(100, Math.round(accuracy * 100))) / 100

            return (
              <>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
                  <g transform={`translate(${size / 2},${size / 2})`}>
                    <circle r={radius} fill="none" stroke="var(--border)" strokeWidth="3" opacity="0.12" />
                    <motion.circle
                      r={radius}
                      fill="none"
                      stroke="var(--primary)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={`${circumference}`}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: circumference - dash }}
                      transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    />
                  </g>
                </svg>
                <span>{Math.round(accuracy * 100)}%</span>
              </>
            )
          })()}
        </div>

        <Badge className="underline">{year}</Badge>
      </div>

      {prevOpen ? (
        <div className="mt-3 rounded-md bg-muted/5 border border-border p-3 text-sm">
          <div className="mb-1 font-medium">Previous Attempts</div>
          <div className="text-xs text-muted-foreground">
            Most recent: {new Date().toLocaleDateString()}
          </div>
          <div className="mt-2 text-xs">
            Score: {Math.round(accuracy * 100)}% — Attempts: {attempts}
          </div>
        </div>
      ) : null}
    </article>
  );
}
