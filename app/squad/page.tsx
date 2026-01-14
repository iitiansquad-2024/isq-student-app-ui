"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Avatar from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageHeader from "@/components/ui/page-header";
import { Progress } from "@/components/ui/progress"
import sampleMembers from "@/lib/members";

type Member = {
  id: string;
  name: string;
  joined: string;
  streakDays: number;
  goal?: number;
  avatarUrl?: string | null;
  xp: number; // coins
};

// moved sample data to lib/members

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

const ITEMS_PER_PAGE = 10;

function SquadPageContent() {
  const members = sampleMembers;

  // keep member id '6' only in the squad stream; exclude from leaderboard
  const squadMembers = members; // All members for squad streak
  const sortedByXp = [...members].filter((m) => m.id !== "6").sort((a, b) => b.xp - a.xp);
  const search = useSearchParams();
  const initialTab = (search?.get("tab") === "leaderboard") ? "leaderboard" : "stream";
  const [tab, setTab] = useState<"stream" | "leaderboard">(initialTab as "stream" | "leaderboard");
  const [streamPage, setStreamPage] = useState(1);
  const [leaderboardPage, setLeaderboardPage] = useState(1);

  const streamTotalPages = Math.ceil(squadMembers.length / ITEMS_PER_PAGE);
  const leaderboardTotalPages = Math.ceil(sortedByXp.length / ITEMS_PER_PAGE);

  const paginatedSquadMembers = squadMembers.slice(
    (streamPage - 1) * ITEMS_PER_PAGE,
    streamPage * ITEMS_PER_PAGE
  );

  const paginatedLeaderboard = sortedByXp.slice(
    (leaderboardPage - 1) * ITEMS_PER_PAGE,
    leaderboardPage * ITEMS_PER_PAGE
  );

  return (
    <section className="py-8 flex flex-col gap-6">
      <PageHeader
        title="Leaderboard"
        subtitle="Manage your squad and view global leaderboard"
        actions={
          <div>
            {/* <Button size="sm">Invite members</Button> */}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabs: Stream and Leaderboard in one card */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-sm font-medium">
                  {tab === "stream" ? `Squad Streak (${squadMembers.length})` : `Global Leaderboard (${sortedByXp.length})`}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTab("stream")}
                    className={"px-3 py-1 rounded-md text-sm " + (tab === "stream" ? "bg-primary text-white" : "text-muted-foreground")}
                  >
                    Stream
                  </button>
                  <button
                    onClick={() => setTab("leaderboard")}
                    className={"px-3 py-1 rounded-md text-sm " + (tab === "leaderboard" ? "bg-primary text-white" : "text-muted-foreground")}
                  >
                    Global Leaderboard
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4">
              {tab === "stream" ? (
                <div className="space-y-3">
                  {paginatedSquadMembers.map((m) => {
                    const goal = m.goal ?? 30;
                    const pct = Math.min(100, Math.round((m.streakDays / goal) * 100));

                    return (
                      <div key={m.id} className="flex items-center justify-between py-3 gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar src={m.avatarUrl ?? null} name={m.name} size={40} />
                          <div className="min-w-0">
                            <div className="font-medium truncate">{m.name}</div>
                            <div className="text-xs text-muted-foreground">Member since 2 months</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <div className="w-16">
                              <Progress value={pct} className="rounded-full h-2" />
                            </div>
                            <div className="text-sm">{pct}%</div>
                          </div>

                          <div className="text-sm font-semibold flex items-center gap-2">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs">XP</span>
                            {m.xp}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-3">
                  {paginatedLeaderboard.map((m, idx) => {
                    const globalRank = (leaderboardPage - 1) * ITEMS_PER_PAGE + idx + 1;
                    return (
                      <div key={m.id} className="flex items-center justify-between py-3 gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="text-sm font-medium w-6">#{globalRank}</div>
                          <Avatar src={m.avatarUrl ?? null} name={m.name} size={40} />
                          <div className="min-w-0">
                            <div className="font-medium truncate">{m.name}</div>
                            <div className="text-xs text-muted-foreground">Streak {m.streakDays}d • {Math.min(100, Math.round((m.streakDays / (m.goal ?? 30)) * 100))}%</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-sm font-semibold flex items-center gap-2">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs">XP</span>
                            {m.xp}
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/profile?member=${m.id}`}>View</Link>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <div className="text-sm text-muted-foreground">
                {tab === "stream" 
                  ? `Page ${streamPage} of ${streamTotalPages}`
                  : `Page ${leaderboardPage} of ${leaderboardTotalPages}`
                }
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => tab === "stream" ? setStreamPage(p => Math.max(1, p - 1)) : setLeaderboardPage(p => Math.max(1, p - 1))}
                  disabled={tab === "stream" ? streamPage === 1 : leaderboardPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => tab === "stream" ? setStreamPage(p => Math.min(streamTotalPages, p + 1)) : setLeaderboardPage(p => Math.min(leaderboardTotalPages, p + 1))}
                  disabled={tab === "stream" ? streamPage === streamTotalPages : leaderboardPage === leaderboardTotalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: summary / quick actions */}
        <aside className="space-y-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="text-sm font-medium">Your squad XP</h4>
            <p className="mt-2 text-sm text-muted-foreground">Total XP across squad</p>
            <div className="mt-4">
              {/* compute total XP and top member */}
              <div className="text-sm text-muted-foreground">Total squad XP</div>
              <div className="mt-2 text-lg font-semibold">
                {members.reduce((s, m) => s + (m.xp || 0), 0)} XP
              </div>
              {sortedByXp.length > 0 && (
                <div className="mt-3 text-sm text-muted-foreground">
                  Top: #{1} {sortedByXp[0].name} — <span className="font-semibold">{sortedByXp[0].xp} XP</span>
                </div>
              )}
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

export default function SquadPage() {
  return (
    <Suspense fallback={<div className="py-8">Loading...</div>}>
      <SquadPageContent />
    </Suspense>
  );
}
