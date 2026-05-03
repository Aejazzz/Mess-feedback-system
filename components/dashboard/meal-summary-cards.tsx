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
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Meal summaries">
      {meals.map((meal, i) => {
        const row = data?.byMeal[meal] ?? { count: 0, avg: 0 };
        const tone = satisfactionTone(row.avg);
        const ring = toneColor(tone);
        const Icon = mealIcon[meal];
        return (
          <motion.div
            key={meal}
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
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex size-10 items-center justify-center rounded-2xl bg-white shadow-sm shadow-black/[0.04] ring-1 ring-black/[0.06]"
                      style={{ color: ring }}
                    >
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <div>
                      <CardTitle>{meal}</CardTitle>
                      <p className="text-xs text-muted-foreground">Rolling snapshot</p>
                    </div>
                  </div>
                  <Badge
                    className={cn(
                      "rounded-full border-0 backdrop-blur",
                      tone === "good" && "bg-emerald-50 text-emerald-800",
                      tone === "average" && "bg-amber-50 text-amber-900",
                      tone === "poor" && "bg-rose-50 text-rose-900"
                    )}
                  >
                    {tone === "good" ? "Great" : tone === "average" ? "Fair" : "Needs care"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-5xl font-semibold tracking-tight">{row.avg.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">average stars</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-neutral-900">{row.count}</p>
                    <p className="text-xs text-muted-foreground">responses</p>
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
              <CardFooter className="text-xs text-neutral-700">
                Suggested campus session is informed by gentle time windows—not strict cutoffs.
              </CardFooter>
            </Card>
          </motion.div>
        );
      })}
    </section>
  );
}
