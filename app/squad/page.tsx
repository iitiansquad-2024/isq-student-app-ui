"use client";

import React from "react";
import Avatar from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import PageHeader from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress"

type Member = {
  id: string;
  name: string;
  joined: string;
  streakDays: number;
  goal?: number;
  avatarUrl?: string | null;
  xp: number; // coins
};

const sampleMembers: Member[] = [
  {
    id: "1",
    name: "Aisha Khan",
    joined: "2024-06-12",
    streakDays: 14,
    goal: 30,
    xp: 200,
    avatarUrl: null,
  },
  {
    id: "2",
    name: "Ravi Patel",
    joined: "2025-01-03",
    streakDays: 9,
    goal: 30,
    xp: 200,
    avatarUrl: null,
  },
  {
    id: "3",
    name: "Maya Rao",
    joined: "2023-11-20",
    streakDays: 21,
    goal: 30,
    xp: 200,
    avatarUrl: null,
  },
  {
    id: "4",
    name: "Arjun Mehta",
    joined: "2024-02-01",
    streakDays: 3,
    goal: 30,
    xp: 200,
    avatarUrl: null,
  },
  {
    id: "5",
    name: "Neha Singh",
    joined: "2024-09-10",
    streakDays: 27,
    goal: 30,
    xp: 200,
    avatarUrl: null,
  },
  {
    id: "6",
    name: "Ishan Verma",
    joined: "2023-05-05",
    streakDays: 18,
    goal: 30,
    xp: 200,
    avatarUrl: null,
  },
];

function ProgressRing({ pct }: { pct: number }) {
  const size = 36;
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (circumference * pct) / 100;

  return (
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
          opacity="0.12"
        />
        <circle
          r={radius}
          fill="none"
          stroke="#10B981"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={String(circumference - dash)}
        />
      </g>
    </svg>
  );
}

export default function SquadPage() {
  const members = sampleMembers;

  const sortedByXp = [...members].sort((a, b) => b.xp - a.xp);

  return (
    <section className="py-8 flex flex-col gap-6">
      <PageHeader
        title="Streak Squad"
        subtitle={<p>Manage your squad and view global leaderboard</p>}
        actions={
          <div>
            {/* <Button size="sm">Invite members</Button> */}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Squad list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-lg border bg-card p-4">
            <h2 className="text-sm font-medium">Members ({members.length})</h2>

            <div className="mt-4 divide-y">
              {members.map((m) => {
                const goal = m.goal ?? 30;
                const pct = Math.min(
                  100,
                  Math.round((m.streakDays / goal) * 100)
                );

                return (
                  <div
                    key={m.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar
                        src={m.avatarUrl ?? null}
                        name={m.name}
                        size={36}
                      />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-medium">{m.name}</p>
                          </div>
                          <div className="text-xs text-muted-foreground">Member since 2 months</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-16">
                          <Progress value={pct} className="rounded-full h-2" />
                        </div>
                        <div className="text-xs text-muted-foreground w-10">{pct}%</div>

                        <div className="text-sm font-semibold flex items-center gap-2">
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs">XP</span>
                          {m.xp}
                        </div>
                      </div>

                    
                  </div>
                );
              })}
            </div>
          </div>

          {/* Global leaderboard under squad list */}
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Global Leaderboard</h3>
              <div className="text-xs text-muted-foreground">Ranked by XP</div>
            </div>

            <ol className="mt-4 space-y-3">
              {sortedByXp.map((m, idx) => (
                <li key={m.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="text-sm font-medium w-6">#{idx + 1}</div>
                    <Avatar src={m.avatarUrl ?? null} name={m.name} size={36} />
                    <div className="min-w-0">
                      <div className="truncate font-medium">{m.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Streak {m.streakDays}d •{" "}
                        {Math.min(
                          100,
                          Math.round((m.streakDays / (m.goal ?? 30)) * 100)
                        )}
                        %
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-sm font-semibold flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs">XP</span>
                      {m.xp}
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Right column: summary / quick actions */}
        <aside className="space-y-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="text-sm font-medium">Your squad XP</h4>
            <p className="mt-2 text-sm text-muted-foreground">Total XP across squad</p>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-lg font-semibold">200 XP</div>
              <Button size="sm">Distribute rewards</Button>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h4 className="text-sm font-medium">How XP works</h4>
            <p className="mt-2 text-sm text-muted-foreground">Earn XP by completing daily practice and streak milestones. XP is used for leaderboard ranking and rewards.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
