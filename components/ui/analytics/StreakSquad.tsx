"use client";

import React from "react";
import Avatar from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
// import { format } from "date-fns"
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

type Member = {
  id: string;
  name: string;
  joined: string; // ISO date
  streakDays: number;
  goal?: number;
  avatarUrl?: string | null;
  xp?: number
};

export default function StreakSquad({ members }: { members?: Member[] }) {
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

  return (
    <div className="rounded-lg border bg-card p-4 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Streak Squad</h3>
          <div className="text-xs font-medium text-muted-foreground">Streak Level 1 ( 7 days )</div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-xs " asChild>
            <Link href="/squad" className="text-sm">View all</Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {list.map((m) => {
          const goal = m.goal ?? 30;
          const pct = Math.min(100, Math.round((m.streakDays / goal) * 100));

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
                      <Progress value={pct} className="rounded-full h-2" />
                    </div>
                    <div className="text-xs text-muted-foreground w-10">{pct}%</div>

                    <div className="text-sm font-semibold flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs">XP</span>
                      {(m as any).xp ?? 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
