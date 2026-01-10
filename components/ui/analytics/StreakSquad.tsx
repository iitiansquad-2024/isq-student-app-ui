"use client";

import React from "react";
import Avatar from "@/components/ui/avatar";
// import { format } from "date-fns"
import { cn } from "@/lib/utils";

type Member = {
  id: string;
  name: string;
  joined: string; // ISO date
  streakDays: number;
  goal?: number;
  avatarUrl?: string | null;
};

export default function StreakSquad({ members }: { members?: Member[] }) {
  const sample: Member[] = [
    {
      id: "1",
      name: "Aisha Khan",
      joined: "2024-06-12",
      streakDays: 14,
      goal: 30,
    },
    {
      id: "2",
      name: "Ravi Patel",
      joined: "2025-01-03",
      streakDays: 9,
      goal: 30,
    },
    {
      id: "3",
      name: "Maya Rao",
      joined: "2023-11-20",
      streakDays: 21,
      goal: 30,
    },
  ];

  const list = members && members.length > 0 ? members : sample;

  return (
    <div className="rounded-lg border bg-card p-4 flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-sm font-medium">Streak Squad</h3>
        <div className="text-xs text-muted-foreground">
          Challenge participants
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
                  <p className="text-xs text-muted-foreground">{pct}%</p>
                </div>
                <div className="mt-1 flex items-center gap-3">
                  <div className="text-xs text-muted-foreground">
                    Member since 2 months
                  </div>
                  <div className="flex-1">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-border">
                      <div
                        className={cn("h-2 rounded-full bg-primary")}
                        style={{ width: `${pct}%` }}
                      />
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
