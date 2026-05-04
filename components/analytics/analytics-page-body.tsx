"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

function KpiGrid({ data }: { data: AnalyticsPayload | undefined }) {
  const ts = data?.serverTimeISO
    ? format(new Date(data.serverTimeISO), "MMM d yyyy • h:mm a")
    : null;
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-3xl border border-black/[0.06] bg-white/80 p-4 shadow-sm backdrop-blur">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-600">Total feedback</p>
        <div className="mt-3 text-2xl font-semibold text-neutral-900">
          {data ? data.totalFeedbacks : <Skeleton className="h-7 w-20" />}
        </div>
      </div>
      <div className="rounded-3xl border border-black/[0.06] bg-white/80 p-4 shadow-sm backdrop-blur">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-600">Overall average</p>
        <div className="mt-3 text-2xl font-semibold text-[#4285F4]">
          {data ? `${data.avgRatingOverall.toFixed(2)}★` : <Skeleton className="h-7 w-20" />}
        </div>
      </div>
      <div className="rounded-3xl border border-black/[0.06] bg-white/80 p-4 shadow-sm backdrop-blur">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-600">Suggested meal</p>
        <div className="mt-3 text-2xl font-semibold text-neutral-900">
          {data ? data.suggestedMeal : <Skeleton className="h-7 w-32" />}
        </div>
      </div>
      <div className="rounded-3xl border border-black/[0.06] bg-white/80 p-4 shadow-sm backdrop-blur">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-600">Server time</p>
        <div className="mt-3 text-xl font-semibold leading-snug text-neutral-900">
          {ts ?? <Skeleton className="h-7 w-40" />}
        </div>
      </div>
    </div>
  );
}

export function AnalyticsPageBody({ initial }: { initial: AnalyticsPayload | null }) {
  const { analytics, loading } = useAnalytics(12_000);
  const data = analytics ?? initial ?? undefined;

  return (
    <div className="min-h-svh min-w-0 bg-[#FAFAFA]">
      <AppNavbar />
      <main className="mx-auto min-w-0 max-w-6xl space-y-10 px-4 pb-16 pt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-3">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Link href="/" className="inline-flex items-center gap-2 text-sm text-neutral-700">
                <ArrowLeft className="size-4" />
                Back to home
              </Link>
            </motion.div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Analytics dashboard</h1>
            <p className="max-w-2xl text-base text-neutral-600">
              Aggregated anonymous feedback by meal, weekday, date, and hostel block—including
              distributions, trends, and a weekday × meal heatmap.
            </p>
          </div>
          <Link href="/feedback">
            <Button variant="outline" className="rounded-full">
              Submit more feedback
            </Button>
          </Link>
        </div>

        <Card className="border-black/[0.06] bg-white/85 backdrop-blur">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Key figures refresh automatically while you view this page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <KpiGrid data={data} />
            {loading && !data && (
              <div className="grid gap-2 md:grid-cols-3">
                <Skeleton className="h-24 w-full rounded-3xl" />
                <Skeleton className="h-24 w-full rounded-3xl" />
                <Skeleton className="h-24 w-full rounded-3xl" />
              </div>
            )}
          </CardContent>
        </Card>

        <MealSummaryCards data={data} />

        <div className="grid min-w-0 gap-4 lg:grid-cols-2 [&>*]:min-w-0">
          <MealPie data={data} />
          <RatingPie data={data} />
          <StudentBlockBars data={data} />
          <div className="min-w-0 lg:col-span-2">
            <DailyTrend data={data} />
          </div>
          <div className="min-w-0 lg:col-span-2">
            <MealDayHeat data={data} />
          </div>
        </div>

        <Card className="border-black/[0.06] bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle>Insights</CardTitle>
            <CardDescription>Automated notes from recent feedback patterns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(data?.insights?.length ? data.insights : ["Add more feedback to unlock trend summaries."]).map(
              (line, idx) => (
                <div key={`${idx}-${line}`} className="rounded-2xl bg-[#FAFAFA] px-4 py-3 text-sm text-neutral-800 ring-1 ring-black/[0.04]">
                  {line}
                </div>
              )
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
