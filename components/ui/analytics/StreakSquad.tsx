"use client";

import React from "react";
import Avatar from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
// import { format } from "date-fns"
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
    <div className="rounded-lg border bg-card p-4 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Streak Squad</h3>
          <div className="text-xs font-medium text-muted-foreground">Streak Level 1 ( 7 days )</div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/squad">View all</Link>
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

                  <div className="flex items-center gap-2">
                    {(() => {
                      const size = 28;
                      const radius = (size - 6) / 2;
                      const circumference = 2 * Math.PI * radius;
                      const dash = (circumference * pct) / 100;

                      return (
                        <div className="inline-flex items-center gap-2">
                          <svg
                            width={size}
                            height={size}
                            viewBox={`0 0 ${size} ${size}`}
                            className="block"
                          >
                            <g transform={`translate(${size / 2},${size / 2})`}>
                              <circle
                                r={radius}
                                fill="none"
                                stroke="var(--border)"
                                strokeWidth="3"
                                opacity="0.18"
                              />
                              <motion.circle
                                r={radius}
                                fill="none"
                                stroke="var(--color-emerald-500)"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeDasharray={`${circumference}`}
                                initial={{ strokeDashoffset: circumference }}
                                animate={{
                                  strokeDashoffset: circumference - dash,
                                }}
                                transition={{
                                  type: "spring",
                                  stiffness: 120,
                                  damping: 20,
                                }}
                              />
                            </g>
                          </svg>
                          <div>
                            <div className="text-xs text-muted-foreground">
                              {pct}%
                            </div>
                            <p className="text-xs text-muted-foreground">completion</p>
                          </div>
                        </div>
                      );
                    })()}
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
