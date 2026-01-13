"use client";
import Quota from "@/components/ui/quota";
import { useQuota } from "@/components/ui/quota";
import Avatar from "@/components/ui/avatar";
import Streak from "@/components/ui/streak";
import { Button } from "@/components/ui/button";
import { LogOut, Edit, Settings, Pencil } from "lucide-react";
import StreakSquad from "@/components/ui/analytics/StreakSquad";
import PageHeader from "@/components/ui/page-header";

export default function ProfilePage() {
  const { state, remaining } = useQuota(20);

  return (
    <section className="py-8 flex flex-col gap-4">
      {/* ROW 1 — Identity & Status */}
      <header>
        <PageHeader
          title="Profile"
          subtitle="Manage all your account here!"
          actions={
            <div className="flex items-center gap-1 ml-2">
              <Button size="sm" variant="ghost" aria-label="Edit profile">
                <Edit className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" aria-label="Settings">
                <Settings className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" aria-label="Logout">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          }
        />
      </header>

      {/* ROW 1.5 — Student details card (no elevation) */}
      <div className="rounded-md border border-border bg-background p-3 sm:p-4">
        <div className="flex items-center gap-3">
          <Avatar name="Anita Verma" size={56} />
          <div className="flex-1">
            <div className="text-sm font-medium">Anita Verma</div>
            <div className="text-xs text-muted-foreground">
              anita.verma@example.com
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Class of 2026 • Roll #2345
            </div>
          </div>
          <div>
            <Streak
              goal={7}
              size={48}
              currentDays={5}
              variant="circle"
              showText={true}
              meterDescription="practice meter"
              meterUnit=" Qn"
              centralIcon={<Pencil className="h-3 w-3 text-primary-dark" />}
            />
          </div>
        </div>
      </div>

      <div className="btn-shimmer">
        <StreakSquad />
      </div>
    </section>
  );
}
