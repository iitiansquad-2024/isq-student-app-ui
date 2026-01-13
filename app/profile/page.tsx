import Quota from "@/components/ui/quota"

export default function ProfilePage() {
  return (
    <section className="py-8">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="mt-3 text-base text-muted-foreground">This is the Profile page.</p>
        </div>

        <Quota limit={20} />
      </header>
    </section>
  )
}
