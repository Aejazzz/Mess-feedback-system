"use client";

import type { ComponentType } from "react";
import { motion } from "framer-motion";
import { Beef, Sandwich, Sunrise, Soup } from "lucide-react";

import type { MealType } from "@/lib/constants";
import type { AnalyticsPayload } from "@/lib/types/analytics";
import { satisfactionTone, toneColor } from "@/lib/constants";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const mealIcon: Record<MealType, ComponentType<{ className?: string }>> = {
  Breakfast: Sunrise,
  Lunch: Soup,
  Snacks: Sandwich,
  Dinner: Beef,
};

export function MealSummaryCards({ data }: { data: AnalyticsPayload | undefined }) {
  const meals: MealType[] = ["Breakfast", "Lunch", "Snacks", "Dinner"];
  return (
    <section className="grid grid-cols-2 gap-3 min-[480px]:gap-4 xl:grid-cols-4" aria-label="Meal summaries">
      {meals.map((meal, i) => {
        const row = data?.byMeal[meal] ?? { count: 0, avg: 0 };
        const tone = satisfactionTone(row.avg);
        const ring = toneColor(tone);
        const Icon = mealIcon[meal];
        return (
          <motion.div
            key={meal}
            className="min-w-0"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ type: "spring", stiffness: 320, damping: 28, delay: i * 0.05 }}
            whileHover={{ y: -6, transition: { type: "spring", stiffness: 420, damping: 22 } }}
          >
            <Card
              className={cn(
                "backdrop-blur-sm transition-shadow hover:shadow-lg",
                "bg-white/80 ring-black/[0.06]"
              )}
              style={{
                borderColor: `${ring}22`,
              }}
            >
              <CardHeader className="space-y-2 pb-2 sm:pb-3">
                <div className="flex flex-col gap-2 min-[400px]:flex-row min-[400px]:items-start min-[400px]:justify-between min-[400px]:gap-3">
                  <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <span
                      className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/[0.04] ring-1 ring-black/[0.06] sm:size-10"
                      style={{ color: ring }}
                    >
                      <Icon className="size-4 sm:size-5" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <CardTitle className="text-base leading-tight sm:text-lg">{meal}</CardTitle>
                      <p className="text-[0.65rem] text-muted-foreground sm:text-xs">Rolling snapshot</p>
                    </div>
                  </div>
                  <Badge
                    className={cn(
                      "shrink-0 self-start rounded-full border-0 px-2 py-0.5 text-[0.65rem] backdrop-blur sm:px-2.5 sm:text-xs",
                      tone === "good" && "bg-emerald-50 text-emerald-800",
                      tone === "average" && "bg-amber-50 text-amber-900",
                      tone === "poor" && "bg-rose-50 text-rose-900"
                    )}
                  >
                    {tone === "good" ? "Great" : tone === "average" ? "Fair" : "Needs care"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-3 sm:pb-4">
                <div className="flex items-end justify-between gap-2 sm:gap-3">
                  <div className="min-w-0">
                    <p className="text-3xl font-semibold tracking-tight tabular-nums sm:text-5xl">
                      {row.avg.toFixed(1)}
                    </p>
                    <p className="text-[0.65rem] text-muted-foreground sm:text-xs">average stars</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs font-medium text-neutral-900 sm:text-sm">{row.count}</p>
                    <p className="text-[0.65rem] text-muted-foreground sm:text-xs">responses</p>
                  </div>
                </div>
                <div
                  className="mt-4 h-1.5 rounded-full bg-neutral-100"
                  role="presentation"
                  style={{
                    border: `1px solid ${ring}22`,
                  }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, (row.avg / 5) * 100)}%`,
                      background: `linear-gradient(90deg, ${ring}, #ffffffaa)`,
                    }}
                  />
                </div>
              </CardContent>
              <CardFooter className="text-[0.62rem] leading-snug text-neutral-700 sm:text-xs">
                Suggested campus session is informed by gentle time windows—not strict cutoffs.
              </CardFooter>
            </Card>
          </motion.div>
        );
      })}
    </section>
  );
}
