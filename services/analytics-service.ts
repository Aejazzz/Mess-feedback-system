import { subDays } from "date-fns";

import { MEALS, type MealType } from "@/lib/constants";
import { getMealSessionContext } from "@/lib/meal-context";
import type {
  AnalyticsPayload,
  CountAvg,
  RatingDistribution,
} from "@/lib/types/analytics";
import { prisma } from "@/lib/prisma";

const emptyAvg = (): CountAvg => ({ count: 0, avg: 0 });

function avgFromBuckets(
  rows: { key: string; _avg: { rating: number | null }; _count: { _all: number } }[]
): Record<string, CountAvg> {
  const out: Record<string, CountAvg> = {};
  for (const r of rows) {
    const c = r._count._all;
    out[r.key] = {
      count: c,
      avg: c ? Number((r._avg.rating ?? 0).toFixed(2)) : 0,
    };
  }
  return out;
}

function computeInsights(byMealRecent: Record<MealType, CountAvg>): string[] {
  const tips: string[] = [];
  const meals = MEALS.filter((m) => byMealRecent[m].count >= 5);
  if (meals.length === 0) {
    tips.push("Share feedback after each meal—the more voices, the clearer the trends.");
    return tips;
  }
  const weakest = [...meals].sort((a, b) => byMealRecent[a].avg - byMealRecent[b].avg)[0];
  const strongest = [...meals].sort((a, b) => byMealRecent[b].avg - byMealRecent[a].avg)[0];
  if (byMealRecent[weakest].avg < 3.4) {
    tips.push(`${weakest} could use attention this week (${byMealRecent[weakest].avg.toFixed(1)}★ avg).`);
  }
  if (byMealRecent[strongest].avg >= 4.2) {
    tips.push(`${strongest} satisfaction is trending strong (${byMealRecent[strongest].avg.toFixed(1)}★).`);
  }
  tips.push(`Thank you—${insightsTotalLabel(byMealRecent)} students shaped this snapshot.`);
  return tips.slice(0, 4);
}

function insightsTotalLabel(byMealRecent: Record<MealType, CountAvg>): number {
  return MEALS.reduce((s, m) => s + byMealRecent[m].count, 0);
}

async function grouped(
  field: "mealType" | "block" | "studentType" | "date" | "day"
): Promise<{ key: string; _avg: { rating: number | null }; _count: { _all: number } }[]> {
  const rows = await prisma.feedback.groupBy({
    by: [field],
    _avg: { rating: true },
    _count: { _all: true },
  });
  return rows.map((r) => ({
    key: String((r as Record<string, unknown>)[field]),
    _avg: r._avg,
    _count: r._count,
  }));
}

async function groupedMealDay(): Promise<
  { day: string; mealType: MealType; avg: number; count: number }[]
> {
  const rows = await prisma.feedback.groupBy({
    by: ["mealType", "day"],
    _avg: { rating: true },
    _count: { _all: true },
  });
  return rows.map((r) => ({
    day: r.day,
    mealType: r.mealType as MealType,
    avg: r._count._all ? Number((r._avg.rating ?? 0).toFixed(2)) : 0,
    count: r._count._all,
  }));
}

export async function getAnalyticsPayload(): Promise<AnalyticsPayload> {
  const ctx = getMealSessionContext();
  const now = new Date();
  const cutoff = subDays(now, 14);
  const sinceWeek = subDays(now, 7);
  const priorStart = subDays(now, 14);

  const [
    total,
    overallAvg,
    mealRows,
    dayRows,
    dateRowsRaw,
    blockRows,
    typeRows,
    heatmapRows,
    distRows,
    recentWeekByMealRows,
    priorWeekByMealRows,
  ] = await Promise.all([
    prisma.feedback.count(),
    prisma.feedback.aggregate({ _avg: { rating: true } }),
    grouped("mealType"),
    grouped("day"),
    prisma.feedback.groupBy({
      by: ["date"],
      _avg: { rating: true },
      _count: { _all: true },
      orderBy: { date: "asc" },
    }),
    grouped("block"),
    grouped("studentType"),
    groupedMealDay(),
    prisma.feedback.groupBy({ by: ["rating"], _count: { _all: true } }),
    prisma.feedback.groupBy({
      by: ["mealType"],
      where: { createdAt: { gte: sinceWeek } },
      _avg: { rating: true },
      _count: { _all: true },
    }),
    prisma.feedback.groupBy({
      by: ["mealType"],
      where: { createdAt: { gte: priorStart, lt: sinceWeek } },
      _avg: { rating: true },
      _count: { _all: true },
    }),
  ]);

  const byMealMap = avgFromBuckets(mealRows);
  const byMeal = Object.fromEntries(
    MEALS.map((m) => [m, byMealMap[m] ?? emptyAvg()])
  ) as Record<MealType, CountAvg>;

  const byDay = avgFromBuckets(dayRows);
  const byBlock = avgFromBuckets(blockRows);
  const byStudentType = avgFromBuckets(typeRows);

  const byDate = dateRowsRaw
    .filter((r) => r.date >= formatYmd(cutoff))
    .map((r) => ({
      date: r.date,
      count: r._count._all,
      avg: r._count._all ? Number((r._avg.rating ?? 0).toFixed(2)) : 0,
    }));

  const ratingDistribution: RatingDistribution = {
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
  };
  for (const row of distRows) {
    const k = String(row.rating) as keyof RatingDistribution;
    if (k in ratingDistribution) ratingDistribution[k] = row._count._all;
  }

  const recentWeekByMeal = Object.fromEntries(
    MEALS.map((m) => [m, emptyAvg()])
  ) as Record<MealType, CountAvg>;
  for (const row of recentWeekByMealRows) {
    const m = row.mealType as MealType;
    recentWeekByMeal[m] = {
      count: row._count._all,
      avg: row._count._all ? Number((row._avg.rating ?? 0).toFixed(2)) : 0,
    };
  }

  const priorMap: Record<string, CountAvg> = {};
  for (const row of priorWeekByMealRows) {
    priorMap[row.mealType] = {
      count: row._count._all,
      avg: row._count._all ? Number((row._avg.rating ?? 0).toFixed(2)) : 0,
    };
  }

  const insights: string[] = [];
  MEALS.forEach((m) => {
    const cur = recentWeekByMeal[m];
    const prev = priorMap[m] ?? emptyAvg();
    if (cur.count < 5 || prev.count < 5) return;
    const diff = Number((cur.avg - prev.avg).toFixed(2));
    if (diff >= 0.35)
      insights.push(`${m} satisfaction increased compared to the previous week.`);
    else if (diff <= -0.35)
      insights.push(`${m} ratings dipped this week—worth a closer look at the menu.`);
  });
  insights.push(...computeInsights(recentWeekByMeal));

  return {
    totalFeedbacks: total,
    avgRatingOverall: Number((overallAvg._avg.rating ?? 0).toFixed(2)),
    suggestedMeal: ctx.suggestedMeal,
    serverTimeISO: ctx.nowISO,
    byMeal,
    byDay,
    byDate,
    byBlock,
    byStudentType,
    ratingDistribution,
    heatmapMealDay: heatmapRows,
    insights,
  };
}

function formatYmd(d: Date): string {
  return d.toISOString().slice(0, 10);
}
