import React from "react"
import Link from "next/link"
import Badge from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <Badge variant="primary-dark" className="mb-4">Premium</Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            Upgrade to Premium — study smarter, faster
          </h1>
          <p className="mt-4 text-muted-foreground">
            Get unlimited access to premium practice sets, advanced analytics, and priority support. Choose a plan
            that works for you and accelerate your revision.
          </p>
        </div>

        <div className="mt-12 grid gap-6 grid-cols-1 md:grid-cols-3">
          {/* Free */}
          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">Free</h3>
                <p className="mt-1 text-sm text-muted-foreground">Essential practice for beginners</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-3xl font-extrabold">₹0</div>
              <div className="mt-4 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-green-600" /> 50 daily questions
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-green-600" /> Basic analytics
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-green-600" /> Community access
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button variant="outline" size="lg" asChild className="w-full">
                <Link href="/signup">Get started</Link>
              </Button>
            </div>
          </section>

          {/* Premium - highlighted */}
          <section className="rounded-3xl border-2 border-primary-dark bg-gradient-to-br from-primary/10 to-white p-8 shadow-lg transform md:-translate-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">Premium</h3>
                <p className="mt-1 text-sm text-muted-foreground">For focused revision and top performance</p>
              </div>
              <Badge variant="primary-dark">Most popular</Badge>
            </div>

            <div className="mt-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold">₹299</span>
                <span className="text-sm text-muted-foreground">/ month</span>
              </div>

              <p className="mt-3 text-sm text-muted-foreground">Billed monthly. Save with yearly billing.</p>

              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary-dark" /> Unlimited practice sets
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary-dark" /> Detailed coverage analytics
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary-dark" /> Adaptive revision scheduler
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary-dark" /> Priority support
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <Button size="lg" className="w-full">Upgrade now</Button>
            </div>
          </section>

          {/* Team */}
          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">Team</h3>
                <p className="mt-1 text-sm text-muted-foreground">Group plans for coaching or classrooms</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-3xl font-extrabold">Custom</div>
              <div className="mt-4 text-sm text-muted-foreground">Get a quote for 5+ users</div>

              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-green-600" /> Shared analytics dashboard
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-green-600" /> Bulk user management
                </li>
              </ul>
            </div>

            <div className="mt-6">
              <Button variant="ghost" size="lg" asChild className="w-full">
                <Link href="/contact">Contact sales</Link>
              </Button>
            </div>
          </section>
        </div>

        <div className="mt-16 max-w-3xl mx-auto">
          <h4 className="text-xl font-semibold">What's included</h4>
          <div className="mt-6 grid gap-6 grid-cols-1 md:grid-cols-2">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary-dark mt-1" />
                <span>Unlimited custom practice sets</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary-dark mt-1" />
                <span>Detailed performance analytics and revision suggestions</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary-dark mt-1" />
                <span>Exportable progress reports</span>
              </li>
            </ul>

            <div>
              <h5 className="font-semibold">FAQ</h5>
              <div className="mt-3 space-y-3 text-sm text-muted-foreground">
                <div>
                  <strong>Can I cancel anytime?</strong>
                  <div>Yes — cancel from your account and billing stops at the end of the billing period.</div>
                </div>
                <div>
                  <strong>Do you offer student discounts?</strong>
                  <div>We occasionally run student promotions — follow announcements for offers.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
