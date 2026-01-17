"use client";

import React, { useState } from "react";
import Link from "next/link";
import Avatar from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
// import { format } from "date-fns"
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { ArrowRight } from "lucide-react";

type Member = {
  id: string;
  name: string;
  joined: string; // ISO date
  streakDays: number;
  goal?: number;
  avatarUrl?: string | null;
  xp?: number;
};

export default function StreakSquad({
  members,
  mode = "tabs",
  viewAllHref,
  title,
  size = 5,
}: {
  members?: Member[];
  mode?: "tabs" | "stream" | "leaderboard";
  viewAllHref?: string;
  title?: string;
  size?: number;
}) {
  const sample: Member[] = [
    {
      id: "1",
      name: "Aisha Khan",
      joined: "2024-06-12",
      streakDays: 14,
      goal: 30,
      xp: 200,
    },
    {
      id: "2",
      name: "Ravi Patel",
      joined: "2025-01-03",
      streakDays: 9,
      goal: 30,
      xp: 200,
    },
    {
      id: "3",
      name: "Maya Rao",
      joined: "2023-11-20",
      streakDays: 21,
      goal: 30,
      xp: 200,
    },
  ];

  const list = members && members.length > 0 ? members : sample;
  const [tab, setTab] = useState<"stream" | "leaderboard">("stream");
  const sorted = [...list].sort((a, b) => (b.xp ?? 0) - (a.xp ?? 0));
  const activeTab = mode && mode !== "tabs" ? mode : tab;

  return (
    <div className="rounded-lg bg-card flex flex-col gap-6">
      <div className="space-y-4">
        {mode === "tabs" && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab("stream")}
              className={
                "px-2 py-1 rounded-md text-sm " +
                (tab === "stream"
                  ? "bg-primary text-white"
                  : "text-muted-foreground")
              }
            >
              Stream
            </button>
            <button
              onClick={() => setTab("leaderboard")}
              className={
                "px-2 py-1 rounded-md text-sm " +
                (tab === "leaderboard"
                  ? "bg-primary text-white"
                  : "text-muted-foreground")
              }
            >
              Leaderboard
            </button>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {activeTab === "stream"
            ? list.map((m) => {
                const goal = m.goal ?? 30;
                const pct = Math.min(
                  100,
                  Math.round((m.streakDays / goal) * 100)
                );

                return (
                  <div key={m.id} className="flex items-center gap-3">
                    <Avatar src={m.avatarUrl ?? null} name={m.name} size={36} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="truncate font-medium text-sm leading-tight">
                          {m.name}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          Member since 2 months
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="w-16">
                            <Progress
                              value={pct}
                              className="rounded-full h-2"
                            />
                          </div>
                          <div className="text-xs text-muted-foreground w-10">
                            {pct}%
                          </div>

                          <div className="text-sm font-semibold flex items-center gap-2">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs">
                              XP
                            </span>
                            {(m as any).xp ?? 0}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            : sorted.slice(0, 5).map((m, idx) => (
                <div key={m.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="text-sm font-medium w-6">#{idx + 1}</div>
                    <Avatar src={m.avatarUrl ?? null} name={m.name} size={36} />
                    <div className="min-w-0">
                      <div className="truncate font-medium">{m.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Max streak {m.streakDays}d
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-sm font-semibold flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs">
                        XP
                      </span>
                      {(m as any).xp ?? 0}
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/profile?member=${m.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))}
        </div>
        <div className="btn-shimmer flex items-center justify-between rounded-md border border-dashed bg-muted/30 px-3 py-2">
          <p className="text-xs sm:text-sm text-muted-foreground">
            {activeTab === "stream"
              ? "See full squad streaks ( +300 more )."
              : "Open full leaderboard to view all ranks."}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild className="text-xs">
              <Link
                href={viewAllHref ?? `/squad?tab=${activeTab}`}
                className="flex items-center gap-1 text-muted-foreground"
              >
                View all
                <ArrowRight className="h-2 w-2 text-muted-foreground" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
