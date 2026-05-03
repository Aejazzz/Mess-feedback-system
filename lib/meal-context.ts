import { format } from "date-fns";

import type { MealType } from "@/lib/constants";
import { MEALS } from "@/lib/constants";

export type MealSessionContext = {
  nowISO: string;
  dateLabel: string;
  dayLabel: string;
  suggestedMeal: MealType;
};

/**
 * Infers suggested meal session from local wall-clock hour (mess-style windows).
 */
export function getMealSessionContext(at: Date = new Date()): MealSessionContext {
  const h = at.getHours() + at.getMinutes() / 60;
  let suggested: MealType = "Breakfast";
  if (h >= 7 && h < 11) suggested = "Breakfast";
  else if (h >= 11 && h < 15.5) suggested = "Lunch";
  else if (h >= 15.5 && h < 19) suggested = "Snacks";
  else suggested = "Dinner";

  return {
    nowISO: at.toISOString(),
    dateLabel: format(at, "yyyy-MM-dd"),
    dayLabel: format(at, "EEEE"),
    suggestedMeal: suggested,
  };
}

export function isMealType(value: unknown): value is MealType {
  return typeof value === "string" && MEALS.includes(value as MealType);
}
