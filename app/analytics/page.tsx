import { AnalyticsPageBody } from "@/components/analytics/analytics-page-body";
import { getAnalyticsPayload } from "@/services/analytics-service";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Analytics — Amrita Food Feedback",
  description: "Meal-wise, day-wise, and block-wise mess satisfaction signals.",
};

export default async function AnalyticsPage() {
  let initial = null;
  try {
    initial = await getAnalyticsPayload();
  } catch {
    initial = null;
  }

  return <AnalyticsPageBody initial={initial} />;
}
