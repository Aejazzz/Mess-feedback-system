export const MEALS = ["Breakfast", "Lunch", "Snacks", "Dinner"] as const;
export type MealType = (typeof MEALS)[number];

export const HOSTEL_BLOCKS = [
  "Mathura",
  "Govardhan",
  "Gokul",
  "Brindavan",
  "Devaki",
] as const;
export type BlockType = (typeof HOSTEL_BLOCKS)[number];

/** Max characters for optional written feedback */
export const FEEDBACK_REVIEW_MAX_LEN = 2000;

/** Google-inspired palette */
export const palette = {
  bg: "#FAFAFA",
  blue: "#4285F4",
  green: "#34A853",
  yellow: "#FBBC05",
  red: "#EA4335",
} as const;

export function satisfactionTone(avg: number): "good" | "average" | "poor" {
  if (avg >= 4) return "good";
  if (avg >= 3) return "average";
  return "poor";
}

export function toneColor(tone: ReturnType<typeof satisfactionTone>): string {
  switch (tone) {
    case "good":
      return palette.green;
    case "average":
      return palette.yellow;
    case "poor":
      return palette.red;
    default:
      return palette.blue;
  }
}
