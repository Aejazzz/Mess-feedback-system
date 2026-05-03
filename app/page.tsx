import { SplashGate } from "@/components/landing/splash-gate";
import { HomeDashboard } from "@/components/home/home-dashboard";
import { getAnalyticsPayload } from "@/services/analytics-service";

export const dynamic = "force-dynamic";

export default async function Home() {
  let initial = null;
  try {
    initial = await getAnalyticsPayload();
  } catch {
    initial = null;
  }

  return (
    <SplashGate>
      <HomeDashboard initial={initial} />
    </SplashGate>
  );
}
