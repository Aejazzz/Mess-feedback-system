import { NextResponse } from "next/server";

import type { MealType } from "@/lib/constants";
import { createAnonymousFeedback } from "@/services/feedback-service";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    return NextResponse.json(
      { error: "Expected a JSON object with mealType, block, rating, and optional review." },
      { status: 400 }
    );
  }

  const payload = raw as Record<string, unknown>;

  const ratingUnknown = payload.rating;
  const rating =
    typeof ratingUnknown === "number"
      ? ratingUnknown
      : typeof ratingUnknown === "string"
        ? Number.parseInt(ratingUnknown, 10)
        : Number.NaN;

  const reviewRaw = payload.review;
  const review =
    reviewRaw === null || reviewRaw === undefined
      ? null
      : typeof reviewRaw === "string"
        ? reviewRaw
        : String(reviewRaw);

  const body = {
    mealType: String(payload.mealType ?? ""),
    block: String(payload.block ?? ""),
    rating,
    review,
  };

  const res = await createAnonymousFeedback({
    mealType: body.mealType as MealType,
    block: body.block,
    rating: Number.isFinite(rating) ? rating : Number.NaN,
    review: body.review,
  });

  if (!res.ok) {
    const isValidation =
      res.error.includes("Invalid") ||
      res.error.includes("between") ||
      res.error.includes("Rating") ||
      res.error.includes("Review must");
    return NextResponse.json(
      { error: res.error },
      { status: isValidation ? 400 : 503 }
    );
  }
  return NextResponse.json({ ok: true });
}
