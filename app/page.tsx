import Image from "next/image"
import TopNav from "@/components/ui/top-nav"
import BottomNav from "@/components/ui/bottom-nav"

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground dark:bg-black">
      <TopNav showSecondRow={true} />

      <main className="mx-auto max-w-3xl px-4 pt-24 pb-28">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Mobile navigation prototype
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            This page demonstrates the top and bottom navigation for the iitian mobile
            prototype. Tap items in the bottom bar to see the selection animation.
          </p>
        </div>

        <section className="mt-8">
          <h2 className="mb-3 text-lg font-medium">Sample content</h2>
          <div className="space-y-3">
            <div className="rounded-md border border-border p-4">Card 1</div>
            <div className="rounded-md border border-border p-4">Card 2</div>
            <div className="rounded-md border border-border p-4">Card 3</div>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
