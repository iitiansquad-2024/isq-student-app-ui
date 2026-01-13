"use client";

import React from "react";
import { Bookmark, Check, X, Clock } from "lucide-react";
import Badge from "@/components/ui/badge";
import { motion } from "framer-motion";
import Checkbox from "@/components/ui/checkbox";

type Question = {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  paper?: string;
};

type Props = {
  question: Question;
  attempts: number;
  accuracy: number; // 0..1
  year: number;
  selected: boolean;
  bookmarked: boolean;
  prevOpen: boolean;
  prevAttempt?: {
    success: boolean;
    time: string | number | Date;
    accuracy: number;
  };
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
  prevAttempt,
  onToggleSelect,
  onToggleBookmark,
  onTogglePrev,
}: Props) {
  return (
    <article
      className="rounded-md border border-border p-4"
      onClick={() => {
        // onTogglePrev(question.id);
      }}
    >
      {/* Row 1: checkbox, heading, actions (wrap on overflow) */}
      <div className="flex items-center justify-between gap-3 w-full">
        <div className="flex flex-col gap-3 min-w-0 w-full">
          <div className="flex gap-2 justify-between flex-wrap">
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline" className="w-fit">
                {question.id}
              </Badge>
              {question.paper && (
                <Badge variant="outline" className="w-fit">
                  {question.paper}
                </Badge>
              )}
              <Badge variant="outline">{question.difficulty}</Badge>
            </div>

            <div className="flex items-center gap-2">
              <button
                aria-pressed={bookmarked}
                onClick={() => onToggleBookmark(question.id)}
                className={`rounded-md p-1 ${
                  bookmarked
                    ? "bg-primary/10 text-primary-dark"
                    : "text-muted-foreground"
                }`}
                title={bookmarked ? "Bookmarked" : "Bookmark"}
              >
                <Bookmark className="h-4 w-4" />
              </button>

              <button
                onClick={() => onTogglePrev(question.id)}
                className="rounded-md p-1 text-muted-foreground"
                title={
                  prevAttempt
                    ? `${
                        prevAttempt.success ? "Success" : "Failed"
                      } — ${new Date(
                        prevAttempt.time
                      ).toLocaleString()} — ${Math.round(
                        prevAttempt.accuracy * 100
                      )}%`
                    : "Previous attempts"
                }
              >
                {prevAttempt ? (
                  prevAttempt.success ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <X className="h-4 w-4 text-red-600" />
                  )
                ) : (
                  <Clock className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-between">
            <h3 className="text-base font-medium truncate">{question.title}</h3>
          </div>
        </div>
      </div>

      {/* Row 2: data badges (wrap) */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        {question.tags.map((t) => (
          <Badge key={t}>{t}</Badge>
        ))}

        <Badge>Attempts: {attempts}</Badge>

        {/* small circular accuracy */}
        <Badge>Avg. Accuracy: {Math.round(accuracy * 100)}%</Badge>

        <Badge className="">{year}</Badge>
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
