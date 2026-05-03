import { NextResponse } from "next/server";

import { getAnalyticsPayload } from "@/services/analytics-service";

export const runtime = "nodejs";

export async function GET() {
  try {
    const data = await getAnalyticsPayload();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Unable to fetch analytics." }, { status: 500 });
  }
}
