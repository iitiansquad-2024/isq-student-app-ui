"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CollapsibleCard } from "@/components/ui/collapsible-card";
import { Input } from "@/components/ui/input";
import {
  Filter,
  Search,
  ListFilter,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

type FilterType = "all" | "attempted" | "unattempted";

// Sample data
const SAMPLE_QUESTIONS = Array.from({ length: 50 }, (_, i) => ({
  id: `q${i + 1}`,
  title: `Question ${i + 1}: Calculate the derivative of x^${i + 1}`,
  type: "mcq" as const,
  difficulty: ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)] as
    | "Easy"
    | "Medium"
    | "Hard",
  paper: `JEE ${Math.random() > 0.5 ? "Main" : "Advanced"} ${
    2024 - Math.floor(Math.random() * 3)
  }`,
  tags: ["calculus", "derivatives"],
  attempted: Math.random() > 0.6,
  correct: Math.random() > 0.5,
}));

export default function QuestionsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [questions, setQuestions] = useState(SAMPLE_QUESTIONS);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  // Stats for filters
  const stats = {
    all: questions.length,
    attempted: questions.filter((q) => q.attempted).length,
    unattempted: questions.filter((q) => !q.attempted).length,
  };

  const lastQuestionRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && page * 10 < questions.length) {
          setPage((p) => p + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, page, questions.length]
  );

  const filteredQuestions = questions
    .filter((q) => {
      if (filter === "attempted") return q.attempted;
      if (filter === "unattempted") return !q.attempted;
      return true;
    })
    .filter((q) =>
      q.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, page * 10);

  const handleQuestionClick = (id: string) => {
    router.push(`/question/${id}`);
  };

  return (
    <main className="min-h-screen pb-16">
      {/* Fixed Header */}
      <div className="fixed top-0 inset-x-0 bg-background border-b z-50">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold">Questions</h1>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
            <Button
              variant={filter === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("all")}
              className="rounded-full"
            >
              <ListFilter className="h-4 w-4 mr-1" />
              All ({stats.all})
            </Button>
            <Button
              variant={filter === "attempted" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("attempted")}
              className="rounded-full"
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Attempted ({stats.attempted})
            </Button>
            <Button
              variant={filter === "unattempted" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("unattempted")}
              className="rounded-full"
            >
              <Clock className="h-4 w-4 mr-1" />
              Unattempted ({stats.unattempted})
            </Button>
          </div>
        </div>
      </div>

      {/* Question List */}
      <div className="pt-[168px] px-4 space-y-2">
        {filteredQuestions.map((question, idx) => (
          <div
            key={question.id}
            ref={idx === filteredQuestions.length - 1 ? lastQuestionRef : null}
          >
            <CollapsibleCard
              title={
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 min-w-0">
                    <Badge variant="questionBadge">{question.id}</Badge>
                    <Badge variant="questionBadge">{question.paper}</Badge>
                    <Badge
                      variant="questionBadge"
                      className={cn(
                        question.difficulty === "Easy"
                          ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30"
                          : question.difficulty === "Medium"
                          ? "bg-amber-500/10 text-amber-600 dark:bg-amber-400/20 dark:text-amber-400 border-amber-200 dark:border-amber-500/30"
                          : "bg-rose-500/10 text-rose-600 dark:bg-rose-400/20 dark:text-rose-400 border-rose-200 dark:border-rose-500/30"
                      )}
                    >
                      {question.difficulty}
                    </Badge>
                    {question.attempted && (
                      <Badge
                        variant="questionBadge"
                        className={
                          question.correct
                            ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30"
                            : "bg-rose-500/10 text-rose-600 dark:bg-rose-400/20 dark:text-rose-400 border-rose-200 dark:border-rose-500/30"
                        }
                      >
                        {question.correct ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                      </Badge>
                    )}
                  </div>
                </div>
              }
              defaultExpanded={false}
            >
              <div
                className="space-y-2 cursor-pointer"
                onClick={() => handleQuestionClick(question.id)}
              >
                <h3 className="text-sm font-medium">{question.title}</h3>
                <div className="flex flex-wrap gap-1">
                  {question.tags.map((tag) => (
                    <Badge key={tag} variant="questionBadge">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CollapsibleCard>
          </div>
        ))}

        {loading && (
          <div className="py-4 text-center text-sm text-muted-foreground">
            Loading more questions...
          </div>
        )}
      </div>
    </main>
  );
}
