"use client"
import Quota from "@/components/ui/quota"
import { useQuota } from "@/components/ui/quota"
import Avatar from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LogOut, Edit, Settings } from "lucide-react"

export default function ProfilePage() {
  const { state, remaining } = useQuota(20)

  return (
    <section className="py-8 flex flex-col gap-4">
      {/* ROW 1 — Identity & Status */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage all your account here!</p>
        </div>

        <div className="flex items-center gap-3">
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
        </div>
      </header>

      {/* ROW 1.5 — Student details card (no elevation) */}
      <div className="rounded-md border border-border bg-background p-3 sm:p-4">
        <div className="flex items-center gap-3">
          <Avatar name="Anita Verma" size={56} />
          <div className="flex-1">
            <div className="text-sm font-medium">Anita Verma</div>
            <div className="text-xs text-muted-foreground">anita.verma@example.com</div>
            <div className="mt-1 text-xs text-muted-foreground">Class of 2026 • Roll #2345</div>
          </div>
          <div className="hidden sm:flex sm:flex-col sm:items-end">
            <div className="text-xs text-muted-foreground">Overall progress</div>
            <div className="text-sm font-semibold">72%</div>
          </div>
        </div>
      </div>

      {/* ROW 2 — Primary Control Row (Quota) */}
      <div className="rounded-xl border border-border bg-muted/5 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-1/3">
            <div className="text-xs sm:text-sm font-medium">Daily quota</div>
            <div className="text-[11px] sm:text-xs text-muted-foreground">{state.used}/{state.limit} used</div>
          </div>

          <div className="w-full sm:w-1/3 flex justify-center">
            <Quota limit={20} />
          </div>

          <div className="w-full sm:w-1/3 flex justify-end items-center gap-2">
            <div className="text-xs sm:text-sm text-muted-foreground">Remaining: {remaining}</div>
          </div>
        </div>
      </div>

      {/* ROW 3 — Snapshot Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="rounded-md border p-2">Usage today<div className="text-xl sm:text-2xl font-semibold">{state.used}</div></div>
        <div className="rounded-md border p-2">Accuracy<div className="text-xl sm:text-2xl font-semibold">92%</div></div>
        <div className="rounded-md border p-2">Streak<div className="text-xl sm:text-2xl font-semibold">5d</div></div>
      </div>

      {/* ROW 4 — Configuration Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <details className="rounded-md border p-2">
          <summary className="cursor-pointer font-medium text-sm">Learning preferences</summary>
          <div className="mt-2 text-xs text-muted-foreground">Adjust how you receive content and difficulty ramps.</div>
        </details>
        <details className="rounded-md border p-2">
          <summary className="cursor-pointer font-medium text-sm">Subject focus</summary>
          <div className="mt-2 text-xs text-muted-foreground">Choose subjects to prioritize in your practice.</div>
        </details>
      </div>

      {/* ROW 5 — Activity & History */}
      <details className="rounded-md border p-2">
        <summary className="cursor-pointer font-medium text-sm">Recent activity</summary>
        <div className="mt-2 text-xs text-muted-foreground">No recent activity to show.</div>
      </details>

      {/* ROW 6 — System & Account Actions */}
      <div className="rounded-md border p-2">
        <div className="mb-2 font-medium text-sm">Account actions</div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <button className="rounded-md border px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm">Export data</button>
          <button className="rounded-md border px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm">Clear progress</button>
          <button className="rounded-md border px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm text-destructive">Delete account</button>
        </div>
      </div>
    </section>
  )
}
