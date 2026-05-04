import { MEALS, type MealType } from "@/lib/constants";
import { getSuggestedMealForDisplay, istCalendarDateKey, istWeekdayName } from "@/lib/meal-windows";

export type MealSessionContext = {
  nowISO: string;
  dateLabel: string;
  dayLabel: string;
  suggestedMeal: MealType;
};

/**
 * Server “today” labels plus suggested meal from official IST serving windows.
 */
export function getMealSessionContext(at: Date = new Date()): MealSessionContext {
  return {
    nowISO: at.toISOString(),
    dateLabel: istCalendarDateKey(at),
    dayLabel: istWeekdayName(at),
    suggestedMeal: getSuggestedMealForDisplay(at),
  };
}

export function isMealType(value: unknown): value is MealType {
  return typeof value === "string" && MEALS.includes(value as MealType);
}
