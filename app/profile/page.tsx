"use client";
import { useQuota } from "@/components/ui/quota";
import Avatar from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  LogOut,
  Edit,
  Settings,
  Bookmark,
  Heart,
  Clock,
  Flag,
  Award,
  Target,
  BarChart3,
  Medal,
  ChevronDown,
} from "lucide-react";
import StreakSquad from "@/components/ui/analytics/StreakSquad";
import PageHeader from "@/components/ui/page-header";
import EditProfileDialog from "@/components/profile/EditProfileDialog";
import BookmarkedQuestions from "@/components/profile/BookmarkedQuestions";
import LikedBlogs from "@/components/profile/LikedBlogs";
import AttemptHistory from "@/components/profile/AttemptHistory";
import ReportManagement from "@/components/profile/ReportManagement";
import HeatmapCalendar from "@/components/analytics/HeatmapCalendar";
import { CollapsibleCard } from "@/components/ui/collapsible-card";
import { useSearchParams } from "next/navigation";
import sampleMembers from "@/lib/members";
import Link from "next/link";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function ProfileCard({ viewed }: { viewed?: any }) {
  const defaultProfile = {
    id: "me",
    name: "Anita Verma",
    email: "anita.verma@example.com",
    preferredExam: "JEE",
    totalQuestions: 120,
    xp: 200,
    joined: "2023-08-01",
    avatarUrl: null,
    streakDays: 5,
    goal: 7,
  };

  const initial = viewed
    ? {
        ...viewed,
        email: `${viewed.id}@example.com`,
        preferredExam: "JEE",
        totalQuestions: (viewed.streakDays ?? 0) * 10,
      }
    : defaultProfile;

  const [profile, setProfile] = useState(initial);
  const [editing, setEditing] = useState(false);

  const rank = useMemo(() => {
    const sorted = [...sampleMembers].sort(
      (a: any, b: any) => (b.xp ?? 0) - (a.xp ?? 0)
    );
    const id = viewed ? viewed.id : sorted[0]?.id;
    const idx = sorted.findIndex((m: any) => m.id === id);
    return idx >= 0 ? idx + 1 : "-";
  }, [viewed]);

  function handleSave(updatedProfile: {
    name: string;
    email: string;
    preferredExam: string;
  }) {
    setProfile({ ...profile, ...updatedProfile });
    setEditing(false);
  }

  return (
    <CollapsibleCard
      title="Details"
      defaultExpanded
      className="border-border bg-background"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar
            src={profile.avatarUrl ?? null}
            name={profile.name}
            size={80}
          />
          <div>
            <div className="text-lg font-semibold">{profile.name}</div>
            <div className="text-sm text-muted-foreground">{profile.email}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Joined {profile.joined}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
              staggerChildren: 0.05,
            }}
            className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3"
          >
            {[
              {
                label: "Preferred Exam",
                value: profile.preferredExam,
                icon: Target,
                iconClass: "bg-primary/10 text-primary",
              },
              {
                label: "Questions",
                value: profile.totalQuestions,
                icon: BarChart3,
                iconClass: "bg-emerald-100 text-emerald-700",
              },
              {
                label: "XP",
                value: profile.xp,
                icon: Award,
                iconClass: "bg-indigo-100 text-indigo-700",
              },
              {
                label: "Rank",
                value: rank,
                icon: Medal,
                iconClass: "bg-amber-100 text-amber-700",
              },
            ].map((card, idx) => (
              <motion.div
                key={card.label}
                variants={{
                  initial: { opacity: 0, y: 8 },
                  animate: { opacity: 1, y: 0 },
                }}
                initial="initial"
                animate="animate"
                transition={{
                  delay: 0.05 * idx,
                  duration: 0.3,
                  ease: "easeOut",
                }}
                className="rounded-md border-border bg-stone-50/90 p-3 flex items-center gap-2"
              >
                <div className={cn("rounded-md p-2", card.iconClass)}>
                  <card.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                  <p className="text-sm font-semibold leading-tight">
                    {card.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </CollapsibleCard>
  );
}

function generateUserActivityData(
  userId: string,
  year: number
): Record<string, number> {
  const data: Record<string, number> = {};
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  const seed = userId.charCodeAt(0) * 100;
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
    const random = (seed + d.getDate() * d.getMonth()) % 100;
    if (random > 50) {
      data[dateKey] = Math.floor(random / 10) + 1;
    }
  }

  return data;
}

export default function ProfilePage() {
  const { state, remaining } = useQuota(20);
  const search = useSearchParams();
  const memberId = search.get("member");
  const viewed = memberId ? sampleMembers.find((m) => m.id === memberId) : null;
  const [activeTab, setActiveTab] = useState("bookmarks");
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const viewedUserActivity = useMemo(() => {
    if (!viewed) return {};
    return generateUserActivityData(viewed.id, selectedYear);
  }, [viewed, selectedYear]);

  const viewedUserStats = useMemo(() => {
    if (!viewed) return { totalAttempted: 0, daysActive: 0, avgPerDay: "0" };
    const values = Object.values(viewedUserActivity);
    const totalAttempted = values.reduce((sum, count) => sum + count, 0);
    const daysActive = values.filter((count) => count > 0).length;
    const avgPerDay = daysActive > 0 ? totalAttempted / daysActive : 0;

    return {
      totalAttempted,
      daysActive,
      avgPerDay: avgPerDay.toFixed(1),
    };
  }, [viewedUserActivity, viewed]);

  return (
    <section className="py-8 flex flex-col gap-4">
      {/* ROW 1 — Identity & Status */}
      <header>
        <PageHeader
          title={viewed ? viewed.name : "Profile"}
          subtitle={
            viewed
              ? `Member since ${viewed.joined}`
              : "Manage all your account here!"
          }
          actions={
            <div className="flex items-center gap-1 ml-2">
              {!viewed && (
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => {}}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {!viewed && (
                <>
                  <Button size="sm" variant="ghost" aria-label="Settings">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" aria-label="Logout">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              )}
              {viewed && (
                <Link href="/squad" className="text-sm text-muted-foreground">
                  Back
                </Link>
              )}
            </div>
          }
        />
      </header>

      {/* Identity / viewed member */}

      <ProfileCard viewed={viewed} />

      {/* Heatmap for viewed user */}
      {viewed && (
        <div className="rounded-md border border-border bg-background p-3 sm:p-4">
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-md border border-border p-3">
              <div className="text-sm text-muted-foreground mb-1">
                Total Attempted ({selectedYear})
              </div>
              <div className="text-2xl font-bold">
                {viewedUserStats.totalAttempted}
              </div>
            </div>
            <div className="rounded-md border border-border p-3">
              <div className="text-sm text-muted-foreground mb-1">
                Active Days
              </div>
              <div className="text-2xl font-bold text-emerald-600">
                {viewedUserStats.daysActive}
              </div>
            </div>
            <div className="rounded-md border border-border p-3">
              <div className="text-sm text-muted-foreground mb-1">
                Avg. Per Active Day
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {viewedUserStats.avgPerDay}
              </div>
            </div>
          </div>

          <HeatmapCalendar
            year={selectedYear}
            onYearChange={setSelectedYear}
            activityData={viewedUserActivity}
          />
        </div>
      )}

      {/* Squad sections - only show for own profile */}
      {!viewed && (
        <>
          <CollapsibleCard
            title={<h3 className="text-sm font-medium">Streak Squad</h3>}
            chevronElement={(open) => (
              <div className="flex gap-3 items-center">
                <p className="text-xs font-medium text-muted-foreground">
                  <span className="underline">Level 1</span> (7 days)
                </p>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform",
                    open ? "rotate-180" : "rotate-0"
                  )}
                />
              </div>
            )}
          >
            <div>
              <StreakSquad
                mode="stream"
                title="Streak Squad"
                viewAllHref="/squad?tab=stream"
              />
            </div>
          </CollapsibleCard>

          <CollapsibleCard
            title={
              <h3 className="text-sm font-medium">IITian Squad Leaderboard</h3>
            }
          >
            <div>
              <StreakSquad
                mode="leaderboard"
                title="Global Leaderboard"
                viewAllHref="/squad?tab=leaderboard"
              />
            </div>
          </CollapsibleCard>
        </>
      )}

      {/* Tabs Section - Only show for own profile - Below squad sections for mobile view */}
      {!viewed && (
        <div className="rounded-md border border-border bg-background p-3 sm:p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
              <TabsTrigger
                value="bookmarks"
                className="flex items-center gap-1 whitespace-nowrap"
              >
                <Bookmark className="h-4 w-4" />
                <span className="sm:inline ml-1">Bookmarks</span>
              </TabsTrigger>
              <TabsTrigger
                value="liked"
                className="flex items-center gap-1 whitespace-nowrap"
              >
                <Heart className="h-4 w-4" />
                <span className="sm:inline ml-1">Liked Blogs</span>
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="flex items-center gap-1 whitespace-nowrap"
              >
                <Clock className="h-4 w-4" />
                <span className="sm:inline ml-1">History</span>
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="flex items-center gap-1 whitespace-nowrap"
              >
                <Flag className="h-4 w-4" />
                <span className="sm:inline ml-1">Reports</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bookmarks">
              <BookmarkedQuestions />
            </TabsContent>

            <TabsContent value="liked">
              <LikedBlogs />
            </TabsContent>

            <TabsContent value="history">
              <AttemptHistory />
            </TabsContent>

            <TabsContent value="reports">
              <ReportManagement />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </section>
  );
}
