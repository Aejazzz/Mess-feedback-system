import { NextResponse } from "next/server";

import type { MealType } from "@/lib/constants";
import type { StudentType } from "@/lib/constants";
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
      { error: "Expected a JSON object with mealType, block, studentType, and rating." },
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

  const body = {
    mealType: String(payload.mealType ?? ""),
    block: String(payload.block ?? ""),
    studentType: String(payload.studentType ?? ""),
    rating,
  };

  const res = await createAnonymousFeedback({
    mealType: body.mealType as MealType,
    block: body.block,
    studentType: body.studentType as StudentType,
    rating: Number.isFinite(rating) ? rating : Number.NaN,
  });

  if (!res.ok) {
    const isValidation =
      res.error.includes("Invalid") ||
      res.error.includes("between") ||
      res.error.includes("Rating");
    return NextResponse.json(
      { error: res.error },
      { status: isValidation ? 400 : 503 }
    );
  }
  return NextResponse.json({ ok: true });
}
