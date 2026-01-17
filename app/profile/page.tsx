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
  LogIn,
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
import { useSearchParams, useRouter } from "next/navigation";
import sampleMembers from "@/lib/members";
import Link from "next/link";
import { useState, useMemo, Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { logout } from "@/lib/authApi";

function ProfileCard({ viewed }: { viewed?: any }) {
  const { user } = useAuth();
  const router = useRouter();
  
  // If not viewing another user and not authenticated, show login prompt
  if (!viewed && !user) {
    return (
      <CollapsibleCard
        title="Details"
        defaultExpanded
        className="border-border bg-background"
      >
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <LogIn className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign In Required</h3>
          <p className="text-gray-600 mb-6 max-w-sm">
            Please sign in to view your profile and access personalized features.
          </p>
          <div className="flex gap-3">
            <Button
              onClick={() => router.push('/login')}
              className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>
            <Button
              onClick={() => router.push('/signup')}
              variant="outline"
            >
              Create Account
            </Button>
          </div>
        </div>
      </CollapsibleCard>
    );
  }
  
  const initial = viewed
    ? {
        id: viewed.id,
        name: viewed.name,
        email: `${viewed.id}@example.com`,
        preferredExam: "JEE",
        totalQuestions: (viewed.streakDays ?? 0) * 10,
        xp: viewed.xp ?? 0,
        joined: viewed.joined ?? "2024-01-01",
        avatarUrl: viewed.avatarUrl ?? null,
        streakDays: viewed.streakDays ?? 0,
        goal: 7,
      }
    : {
        id: user?.id ?? "me",
        name: user?.name ?? "User",
        email: user?.email ?? "user@example.com",
        preferredExam: "JEE",
        totalQuestions: 0,
        xp: 0,
        joined: "2024-01-01",
        avatarUrl: user?.image_url ?? null,
        streakDays: 0,
        goal: 7,
      };

  const [profile, setProfile] = useState(initial);
  const [editing, setEditing] = useState(false);
  
  // Update profile when user data changes
  useEffect(() => {
    if (!viewed && user) {
      setProfile({
        id: user.id,
        name: user.name,
        email: user.email,
        preferredExam: "JEE",
        totalQuestions: 0,
        xp: 0,
        joined: "2024-01-01",
        avatarUrl: user.image_url ?? null,
        streakDays: 0,
        goal: 7,
      });
    }
  }, [user, viewed]);

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

function ProfilePageContent() {
  const { user, loading, logout: authLogout } = useAuth();
  const router = useRouter();
  const { state, remaining } = useQuota(20);
  const search = useSearchParams();
  const memberId = search.get("member");
  const viewed = memberId ? sampleMembers.find((m) => m.id === memberId) : null;
  const [activeTab, setActiveTab] = useState("bookmarks");
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated and not viewing another member
  if (!user && !viewed) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-6">
            <LogIn className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
            <p className="text-gray-600 mb-6">
              Please sign in to view your profile and access personalized features.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => router.push('/login')}
              className="bg-yellow-400 text-gray-900 hover:bg-yellow-500"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>
            <Button
              onClick={() => router.push('/signup')}
              variant="outline"
            >
              Create Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
              {!viewed && user && (
                <>
                  <Button size="sm" variant="ghost" aria-label="Settings">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    aria-label="Logout"
                    onClick={async () => {
                      try {
                        await logout();
                        router.push('/login');
                      } catch (error) {
                        console.error('Logout failed:', error);
                      }
                    }}
                  >
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

      {/* Squad sections - Always show for non-viewed profiles */}
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
                size={user ? 5 : 20}
              />
              
              {user && (
                <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Your Rank</p>
                      <p className="text-2xl font-bold text-gray-900">#42</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Your XP</p>
                      <p className="text-2xl font-bold text-yellow-600">2,450 XP</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-yellow-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Next Rank: #41</span>
                      <span className="text-gray-900 font-medium">150 XP to go</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
              )}
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

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="py-8">Loading...</div>}>
      <ProfilePageContent />
    </Suspense>
  );
}
