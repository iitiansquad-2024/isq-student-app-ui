"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import {
  MessageSquare,
  Users,
  History,
  ChevronLeft,
  ChevronRight,
  Flag,
  Lightbulb,
  Eye,
  Filter,
  CheckCircle2,
  Clock,
  X,
  ListFilter,
  BookOpen,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Comments } from "@/components/question/comments";
import { Solutions } from "@/components/question/solutions";
import { AttemptHistory } from "@/components/question/attempt-history";

type QuestionType = "single" | "multiple" | "numerical" | "text";
type SubjectType = "physics" | "chemistry" | "mathematics";
type ExamType = "jee-main" | "jee-advanced" | "neet" | "bitsat";

type AnswerType = {
  single: string;
  multiple: string[];
  numerical: string;
  text: string;
};

interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description: string;
  options?: string[];
  correctAnswer?: string[] | number;
  hint?: string;
  solution?: string;
  marks: {
    positive: number;
    negative: number;
  };
  metadata: {
    paper: string;
    exam: ExamType;
    subject: SubjectType;
    chapter: string;
    year: number;
  };
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  attempts?: {
    total: number;
    correct: number;
  };
}

type PageProps = {
  params: Promise<{ id: string }>;
};

const SAMPLE_QUESTIONS = Array.from({ length: 50 }, (_, i) => ({
  id: `q${i + 1}`,
  type: ["single", "multiple", "numerical"][Math.floor(Math.random() * 3)] as QuestionType,
  title: `Question ${i + 1}: Calculate the derivative of x^${i + 1}`,
  description: `Find the derivative of f(x) = x^${i + 1} with respect to x.`,
  options: ["x", `${i + 1}x^${i}`, `x^${i + 1}`, `${i + 1}`],
  correctAnswer: i % 2 === 0 ? [`${i + 1}x^${i}`] : i + 1,
  hint: "Remember the power rule for derivatives.",
  solution: `Using the power rule, d/dx(x^n) = nx^(n-1). Here n=${i + 1}, so d/dx(x^${i + 1}) = ${i + 1}x^${i}`,
  marks: {
    positive: 4,
    negative: -1,
  },
  metadata: {
    paper: `Paper ${Math.floor(i / 10) + 1}`,
    exam: ["jee-main", "jee-advanced"][Math.floor(Math.random() * 2)] as ExamType,
    subject: ["physics", "chemistry", "mathematics"][Math.floor(Math.random() * 3)] as SubjectType,
    chapter: "Calculus",
    year: 2024 - Math.floor(Math.random() * 3),
  },
  difficulty: ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)] as "Easy" | "Medium" | "Hard",
  tags: ["calculus", "derivatives", `chapter-${Math.floor(i / 10) + 1}`],
  attempts: {
    total: Math.floor(Math.random() * 10),
    correct: Math.floor(Math.random() * 5),
  },
}));

export default function QuestionPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [showQuestionList, setShowQuestionList] = useState(false);
  const [questionFilter, setQuestionFilter] = useState<"all" | "attempted" | "unattempted">("all");
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("question");
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [answer, setAnswer] = useState<AnswerType>({ single: "", multiple: [], numerical: "", text: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const filteredQuestions = useMemo(() => {
    return SAMPLE_QUESTIONS
      .filter((q: Question) => {
        if (questionFilter === "attempted") return q.attempts && q.attempts.total > 0;
        if (questionFilter === "unattempted") return !q.attempts || q.attempts.total === 0;
        return true;
      })
      .slice(0, page * 10);
  }, [questionFilter, page]);

  const questionIdx = parseInt(id.replace("q", "")) - 1;
  const question = SAMPLE_QUESTIONS[questionIdx];
  const prevQuestion = questionIdx > 0 ? SAMPLE_QUESTIONS[questionIdx - 1] : null;
  const nextQuestion = questionIdx < SAMPLE_QUESTIONS.length - 1 ? SAMPLE_QUESTIONS[questionIdx + 1] : null;

  const handleSubmit = () => {
    if (!answer[question.type]) return;

    const userAnswer = answer[question.type];
    const correctAnswer = question.correctAnswer;

    let isCorrect = false;
    if (Array.isArray(correctAnswer)) {
      isCorrect = Array.isArray(userAnswer) && 
        userAnswer.length === correctAnswer.length && 
        userAnswer.every(a => correctAnswer.includes(a));
    } else {
      // Handle numerical answers
      if (typeof correctAnswer === 'number') {
        isCorrect = parseFloat(userAnswer as string) === correctAnswer;
      } else {
        isCorrect = userAnswer === correctAnswer;
      }
    }

    setIsCorrect(isCorrect);
    setIsSubmitted(true);
    setShowSolution(isCorrect);
  };

  return (
    <main className="min-h-screen pb-16">
      {/* Top Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-background border-b">
        {/* Top Bar */}
        <div className="h-14 flex items-center px-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => router.push('/practice')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">{question.metadata.exam.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "px-2",
                  question.difficulty === "Easy"
                    ? "border-green-500 text-green-700"
                    : question.difficulty === "Medium"
                    ? "border-yellow-500 text-yellow-700"
                    : "border-red-500 text-red-700"
                )}
              >
                {question.difficulty}
              </Badge>
              <span className="text-sm font-medium">Q{question.id}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 pb-2">
          <div className="grid grid-cols-4 gap-1 p-1 rounded-lg bg-muted">
            <button
              className={cn(
                "py-2 text-sm rounded-md transition-colors",
                activeTab === "question" ? "bg-background shadow text-primary font-medium" : "text-muted-foreground"
              )}
              onClick={() => setActiveTab("question")}
            >
              Question
            </button>
            <button
              className={cn(
                "py-2 text-sm rounded-md transition-colors",
                activeTab === "comments" ? "bg-background shadow text-primary font-medium" : "text-muted-foreground"
              )}
              onClick={() => setActiveTab("comments")}
            >
              Comments
            </button>
            <button
              className={cn(
                "py-2 text-sm rounded-md transition-colors",
                activeTab === "solutions" ? "bg-background shadow text-primary font-medium" : "text-muted-foreground"
              )}
              onClick={() => setActiveTab("solutions")}
            >
              Solutions
            </button>
            <button
              className={cn(
                "py-2 text-sm rounded-md transition-colors",
                activeTab === "history" ? "bg-background shadow text-primary font-medium" : "text-muted-foreground"
              )}
              onClick={() => setActiveTab("history")}
            >
              History
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-[7.5rem] px-4 pb-20">
        {/* Question Info */}
        <div className="mb-6">
          {/* Subject & Paper */}
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline" className="text-primary">
              {question.metadata.subject.charAt(0).toUpperCase() + question.metadata.subject.slice(1)}
            </Badge>
            <Badge variant="outline" className="text-primary">
              {question.metadata.chapter}
            </Badge>
          </div>

          {/* Question Details */}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Paper</span>
                <span className="font-medium">{question.metadata.paper}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Year</span>
                <span className="font-medium">{question.metadata.year}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium">{question.type.charAt(0).toUpperCase() + question.type.slice(1)}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Marks</span>
                <span className="font-medium text-primary">+{question.marks.positive}</span>
                <span className="font-medium text-destructive">{question.marks.negative}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm mt-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{question.attempts?.total || 0}</span>
              <span className="text-muted-foreground">attempts</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{((question.attempts?.correct || 0) / (question.attempts?.total || 1) * 100).toFixed(1)}%</span>
              <span className="text-muted-foreground">accuracy</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-4">
          {activeTab === "question" && (
            <div className="space-y-6">
              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">Question</h2>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      disabled={!prevQuestion}
                      onClick={() => prevQuestion && router.push(`/question/${prevQuestion.id}`)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      disabled={!nextQuestion}
                      onClick={() => nextQuestion && router.push(`/question/${nextQuestion.id}`)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-base">{question.description}</div>

                <div className="mt-8 space-y-3">
                  {question.type === "single" && question.options && (
                    <div className="space-y-3">
                      {question.options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => !isSubmitted && setAnswer({ ...answer, single: option })}
                          disabled={isSubmitted}
                          className={cn(
                            "w-full text-left p-4 rounded-lg border transition-colors",
                            answer.single === option
                              ? "border-secondary bg-secondary/10"
                              : "border-border/40 hover:border-border",
                            isSubmitted && showSolution &&
                              Array.isArray(question.correctAnswer) &&
                              question.correctAnswer.includes(option) &&
                              "border-green-500 bg-green-50",
                            isSubmitted &&
                              answer.single === option &&
                              "border-red-500 bg-red-50"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "flex items-center justify-center w-6 h-6 rounded-full border text-xs font-medium",
                              answer.single === option
                                ? "border-secondary bg-secondary text-primary"
                                : "border-border/40"
                            )}>
                              {String.fromCharCode(65 + idx)}
                            </div>
                            <span className="text-base">{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowHint(true)}
                        disabled={showHint}
                      >
                        <Lightbulb className="h-4 w-4 mr-1" />
                        Hint
                      </Button>
                      {isSubmitted && !isCorrect && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to see the solution? This will be counted as an unsuccessful attempt.')) {
                              setShowSolution(true);
                            }
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Show Solution
                        </Button>
                      )}
                    </div>
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitted || !answer[question.type]}
                    >
                      Submit Answer
                    </Button>
                  </div>

                  {/* Hint */}
                  {showHint && (
                    <div className="mt-4 p-4 rounded-md bg-yellow-50 border border-yellow-200">
                      <h4 className="font-medium text-sm mb-1">Hint</h4>
                      <p className="text-sm text-muted-foreground">
                        {question.hint}
                      </p>
                    </div>
                  )}

                  {/* Solution */}
                  {showSolution && (
                    <div className="mt-4 p-4 rounded-md bg-green-50 border border-green-200">
                      <h4 className="font-medium text-sm mb-1">Solution</h4>
                      <p className="text-sm text-muted-foreground">
                        {question.solution}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {activeTab === "comments" && <Comments />}
          {activeTab === "solutions" && <Solutions />}
          {activeTab === "history" && <AttemptHistory />}
        </div>
      </div>

      {/* Question Navigation */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg z-50"
          >
            <ListFilter className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-md p-0">
          <div className="border-b p-4">
            <h2 className="text-lg font-semibold mb-4">Question Navigation</h2>
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Button
                variant={questionFilter === "all" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setQuestionFilter("all")}
                className="whitespace-nowrap"
              >
                All ({SAMPLE_QUESTIONS.length})
              </Button>
              <Button
                variant={questionFilter === "attempted" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setQuestionFilter("attempted")}
                className="whitespace-nowrap"
              >
                Attempted ({SAMPLE_QUESTIONS.filter(q => q.attempts && q.attempts.total > 0).length})
              </Button>
              <Button
                variant={questionFilter === "unattempted" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setQuestionFilter("unattempted")}
                className="whitespace-nowrap"
              >
                Unattempted ({SAMPLE_QUESTIONS.filter(q => !q.attempts || q.attempts.total === 0).length})
              </Button>
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-8rem)]">
            {filteredQuestions.map((q) => (
              <button
                key={q.id}
                className={cn(
                  "w-full text-left p-4 border-b transition-colors hover:bg-muted/50",
                  q.id === question.id && "bg-secondary/10"
                )}
                onClick={() => {
                  router.push(`/question/${q.id}`);
                }}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="questionBadge">{q.id}</Badge>
                      <Badge
                        variant="questionBadge"
                        className={cn(
                          q.difficulty === "Easy"
                            ? "border-green-500 text-green-700"
                            : q.difficulty === "Medium"
                            ? "border-yellow-500 text-yellow-700"
                            : "border-red-500 text-red-700"
                        )}
                      >
                        {q.difficulty}
                      </Badge>
                      {q.attempts && q.attempts.total > 0 && (
                        <Badge
                          variant="questionBadge"
                          className={q.attempts.correct > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                        >
                          {q.attempts.correct}/{q.attempts.total}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{q.title}</p>
                  </div>
                  {q.id === question.id && (
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2" />
                  )}
                </div>
              </button>
            ))}
            {page * 10 < SAMPLE_QUESTIONS.length && (
              <Button
                variant="ghost"
                className="w-full mt-2"
                onClick={() => setPage(p => p + 1)}
              >
                Load More
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </main>
  );
}
