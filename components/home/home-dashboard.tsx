"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, LineChartIcon, ShieldCheck } from "lucide-react";

import { AppNavbar } from "@/components/layout/app-navbar";
import { Footer } from "@/components/layout/footer";
import { MealSummaryCards } from "@/components/dashboard/meal-summary-cards";
import {
  DailyTrend,
  MealDayHeat,
  MealPie,
  RatingPie,
  StudentBlockBars,
} from "@/components/charts/analytics-charts";
import type { AnalyticsPayload } from "@/lib/types/analytics";
import { useAnalytics } from "@/hooks/use-analytics";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

function KpiRibbon({ data }: { data: AnalyticsPayload | undefined }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <div className="rounded-2xl border border-black/[0.06] bg-white/70 p-4 shadow-sm backdrop-blur">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-600">Total responses</p>
        <div className="mt-2 text-4xl font-semibold tracking-tight text-neutral-900">
          {data ? data.totalFeedbacks : <Skeleton className="h-9 w-20" />}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Anonymous submissions recorded</p>
      </div>
      <div className="rounded-2xl border border-black/[0.06] bg-white/70 p-4 shadow-sm backdrop-blur">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-600">
          Overall average
        </p>
        <div className="mt-2 text-4xl font-semibold tracking-tight text-[#4285F4]">
          {data ? `${data.avgRatingOverall.toFixed(2)}★` : <Skeleton className="h-9 w-20" />}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Average star rating (two decimal places)</p>
      </div>
      <div className="col-span-2 rounded-2xl border border-black/[0.06] bg-gradient-to-br from-[#4285F4]/10 via-[#34A853]/10 to-transparent p-4 shadow-inner shadow-[#4285F4]/10 sm:col-span-1">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-700">
          Suggested meal window
        </p>
        <div className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">
          {data ? data.suggestedMeal : <Skeleton className="h-7 w-32" />}
        </div>
        <p className="mt-2 text-xs text-neutral-700">
          {data?.serverTimeISO
            ? `${format(new Date(data.serverTimeISO), "MMM d • h:mm a")} server time`
            : "Loading server time"}
        </p>
      </div>
    </div>
  );
}

export function HomeDashboard({ initial }: { initial: AnalyticsPayload | null }) {
  const { analytics, loading } = useAnalytics();
  const data = analytics ?? initial ?? undefined;

  return (
    <div className="min-h-svh min-w-0 bg-[#FAFAFA] text-neutral-900">
      <AppNavbar />
      <main className="mx-auto min-w-0 max-w-6xl space-y-12 px-4 pb-16 pt-8 sm:pt-12">
        <section className="overflow-hidden rounded-3xl border border-black/[0.06] bg-gradient-to-br from-white via-white to-[#4285F4]/6 p-4 shadow-sm sm:rounded-[28px] sm:p-6 lg:rounded-[32px] lg:p-8">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            {/* DOM: snapshot → submit → hero so mobile reads top-to-bottom; lg:order restores desktop columns */}
            <Card className="order-1 border-white/60 bg-white/70 shadow-lg shadow-black/[0.04] backdrop-blur-xl lg:order-2">
              <CardHeader>
                <CardTitle>Live overview</CardTitle>
                <CardDescription>Figures update automatically every few seconds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <KpiRibbon data={data} />
                {loading && !data && (
                  <div className="grid gap-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-5/6" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                )}
              </CardContent>
            </Card>
            <div className="order-2 lg:hidden">
              <Link href="/feedback" className="flex w-full sm:inline-flex sm:w-auto">
                <Button className="group relative isolate w-full overflow-hidden rounded-full bg-[#4285F4] px-6 py-6 text-base font-semibold text-white shadow-lg shadow-[#4285F4]/30 sm:w-auto">
                  <span className="relative z-[1] flex items-center justify-center gap-2">
                    Submit Feedback
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                  <span className="pointer-events-none absolute inset-0 rounded-full opacity-60 mix-blend-screen">
                    <span className="absolute left-1/2 top-full size-[200%] -translate-x-1/2 rounded-full bg-white/35 transition-transform duration-[1100ms] ease-out group-hover:-translate-y-[135%]" />
                  </span>
                </Button>
              </Link>
            </div>
            <div className="order-3 min-w-0 space-y-4 lg:order-1 lg:space-y-0">
              <div className="rounded-3xl border border-black/[0.06] bg-white/95 p-5 shadow-sm sm:p-6 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 24 }}
                  className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-neutral-700 ring-1 ring-black/[0.06] lg:bg-white/80"
                >
                  <ShieldCheck className="size-4 text-[#34A853]" />
                  Fully anonymous • no accounts
                </motion.div>
                <motion.h1
                  className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05, type: "spring", stiffness: 180, damping: 22 }}
                >
                  Mess food feedback, at a glance.
                </motion.h1>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-600">
                  Submit anonymous mess feedback, view ratings and trends, and explore summaries by meal,
                  hostel block, and date—all in one place for Amrita campuses.
                </p>
                <div className="mt-8 lg:hidden">
                  <Link href="/analytics" className="inline-flex">
                    <Button variant="outline" className="rounded-full px-6 py-6">
                      Explore analytics
                      <LineChartIcon className="size-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mt-8 hidden flex-wrap gap-3 lg:flex">
                <Link href="/feedback">
                  <Button className="group relative isolate overflow-hidden rounded-full bg-[#4285F4] px-6 py-6 text-base font-semibold text-white shadow-lg shadow-[#4285F4]/30">
                    <span className="relative z-[1] flex items-center gap-2">
                      Submit Feedback
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                    <span className="pointer-events-none absolute inset-0 rounded-full opacity-60 mix-blend-screen">
                      <span className="absolute left-1/2 top-full size-[200%] -translate-x-1/2 rounded-full bg-white/35 transition-transform duration-[1100ms] ease-out group-hover:-translate-y-[135%]" />
                    </span>
                  </Button>
                </Link>
                <Link href="/analytics">
                  <Button variant="outline" className="rounded-full px-6 py-6">
                    Explore analytics
                    <LineChartIcon className="size-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="meals" className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Meal feedback summary</h2>
              <p className="text-sm text-muted-foreground">
                Green, amber, and red tones show higher, middle, and lower average ratings.
              </p>
            </div>
          </div>
          <MealSummaryCards data={data} />
        </section>

        <section id="analytics" className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Charts and breakdowns</h2>
            <p className="text-sm text-muted-foreground">
              Pie, bar, line, and heat views by meal, block, and date.
            </p>
          </div>
          <div className="grid min-w-0 gap-4 lg:grid-cols-2 [&>*]:min-w-0">
            <MealPie data={data} />
            <StudentBlockBars data={data} />
            <DailyTrend data={data} />
            <div className="min-w-0 lg:col-span-2">
              <MealDayHeat data={data} />
            </div>
            <RatingPie data={data} />
          </div>
        </section>

        <section className="space-y-4" aria-label="Recent trends">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Recent trends</h2>
            <p className="text-sm text-muted-foreground">
              Short summaries from recent feedback trends.
            </p>
          </div>
          <Card className="border-black/[0.06] bg-white/80 backdrop-blur">
            <CardContent className="space-y-3 p-6">
              {(data?.insights?.length ? data.insights : ["Not enough responses yet to show trends."]).map(
                (line, idx) => (
                  <div
                    key={`${idx}-${line}`}
                    className="flex gap-3 rounded-2xl bg-[#FAFAFA] px-4 py-3 ring-1 ring-black/[0.04]"
                  >
                    <span className="mt-0.5 size-2 rounded-full bg-[#FBBC05]" />
                    <p className="text-sm leading-relaxed text-neutral-800">{line}</p>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
}
