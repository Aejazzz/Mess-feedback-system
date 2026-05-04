import type { MealType } from "@/lib/constants";

export type CountAvg = { count: number; avg: number };

export type RatingDistribution = Record<"1" | "2" | "3" | "4" | "5", number>;

export type AnalyticsPayload = {
  totalFeedbacks: number;
  avgRatingOverall: number;
  suggestedMeal: MealType;
  serverTimeISO: string;
  byMeal: Record<MealType, CountAvg>;
  byDay: Record<string, CountAvg>;
  byDate: { date: string; count: number; avg: number }[];
  byBlock: Record<string, CountAvg>;
  ratingDistribution: RatingDistribution;
  heatmapMealDay: { day: string; mealType: MealType; avg: number; count: number }[];
  insights: string[];
};
