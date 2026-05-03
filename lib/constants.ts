export const MEALS = ["Breakfast", "Lunch", "Snacks", "Dinner"] as const;
export type MealType = (typeof MEALS)[number];

export const HOSTEL_BLOCKS = [
  "A Block",
  "B Block",
  "C Block",
  "D Block",
  "E Block",
  "F Block",
] as const;
export type BlockType = (typeof HOSTEL_BLOCKS)[number];

export const STUDENT_TYPES = ["National", "International"] as const;
export type StudentType = (typeof STUDENT_TYPES)[number];

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
