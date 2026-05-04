import { MEALS, type MealType } from "@/lib/constants";

/** Mess hall clock (Amrita campuses in India). */
export const CAMPUS_TIME_ZONE = "Asia/Kolkata";

/**
 * Official serving windows (minutes from midnight IST, inclusive).
 * Campus spec: Breakfast 7:00–9:00, Lunch 12:30–14:00, Snacks 16:45–17:30, Dinner 19:30–20:30.
 * (Snacks was written "16:45–15:30"; 15:30 cannot follow 16:45 same day — implemented as 17:30 end.)
 */
export const MEAL_WINDOWS: Record<MealType, { start: number; endInclusive: number }> = {
  Breakfast: { start: 7 * 60, endInclusive: 9 * 60 },
  Lunch: { start: 12 * 60 + 30, endInclusive: 14 * 60 },
  Snacks: { start: 16 * 60 + 45, endInclusive: 17 * 60 + 30 },
  Dinner: { start: 19 * 60 + 30, endInclusive: 20 * 60 + 30 },
};

function intlParts(d: Date, opts: Intl.DateTimeFormatOptions): Record<string, string> {
  const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: CAMPUS_TIME_ZONE, ...opts });
  const out: Record<string, string> = {};
  for (const p of fmt.formatToParts(d)) {
    if (p.type !== "literal") out[p.type] = p.value;
  }
  return out;
}

/** Minutes from midnight in campus TZ (0–1439). */
export function minutesSinceMidnightInCampusTZ(d: Date): number {
  const map = intlParts(d, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  return Number(map.hour) * 60 + Number(map.minute);
}

/** `yyyy-MM-dd` in campus TZ. */
export function istCalendarDateKey(d: Date): string {
  const map = intlParts(d, { year: "numeric", month: "2-digit", day: "2-digit" });
  return `${map.year}-${map.month}-${map.day}`;
}

export function istWeekdayName(d: Date): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: CAMPUS_TIME_ZONE, weekday: "long" }).format(d);
}

export function formatMinutesAsClock(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function formatMealWindowHuman(meal: MealType): string {
  const w = MEAL_WINDOWS[meal];
  return `${formatMinutesAsClock(w.start)}–${formatMinutesAsClock(w.endInclusive)}`;
}

export function isMealWindowOpen(meal: MealType, at: Date = new Date()): boolean {
  const mins = minutesSinceMidnightInCampusTZ(at);
  const w = MEAL_WINDOWS[meal];
  return mins >= w.start && mins <= w.endInclusive;
}

export function getOpenMeals(at: Date = new Date()): MealType[] {
  return MEALS.filter((m) => isMealWindowOpen(m, at));
}

/** One submission key per calendar day (IST) + meal type for that serving. */
export function getMealSlotKey(meal: MealType, at: Date = new Date()): string {
  return `${istCalendarDateKey(at)}-${meal}`;
}

/**
 * For dashboards: current meal if a window is open, otherwise the next meal whose window has not started today,
 * or Breakfast if we are after the last window (meaning tomorrow’s breakfast).
 */
export function getSuggestedMealForDisplay(at: Date = new Date()): MealType {
  const open = MEALS.find((m) => isMealWindowOpen(m, at));
  if (open) return open;
  const mins = minutesSinceMidnightInCampusTZ(at);
  for (const m of MEALS) {
    if (mins < MEAL_WINDOWS[m].start) return m;
  }
  return "Breakfast";
}

export function describeFullScheduleIST(): string {
  return MEALS.map((m) => `${m} ${formatMealWindowHuman(m)}`).join(" · ");
}

export function getNextServingHint(at: Date = new Date()): string {
  const open = getOpenMeals(at);
  if (open.length > 0) return "";
  const mins = minutesSinceMidnightInCampusTZ(at);
  for (const m of MEALS) {
    if (mins < MEAL_WINDOWS[m].start) {
      return `Next serving: ${m} (${formatMealWindowHuman(m)} IST).`;
    }
  }
  return "Next serving: Breakfast tomorrow (07:00–09:00 IST).";
}
