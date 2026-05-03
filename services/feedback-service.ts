import { Prisma } from "@prisma/client";

import { getMealSessionContext } from "@/lib/meal-context";
import { HOSTEL_BLOCKS, MEALS, STUDENT_TYPES } from "@/lib/constants";
import type { MealType } from "@/lib/constants";
import type { StudentType } from "@/lib/constants";

import { prisma } from "@/lib/prisma";

export type FeedbackInput = {
  mealType: MealType;
  block: string;
  studentType: StudentType;
  rating: number;
};

export function validateFeedback(input: FeedbackInput): string | null {
  if (!MEALS.includes(input.mealType)) return "Invalid meal type.";
  if (!(HOSTEL_BLOCKS as readonly string[]).includes(input.block))
    return "Invalid hostel block.";
  if (!STUDENT_TYPES.includes(input.studentType)) return "Invalid student type.";
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
    return "Rating must be between 1 and 5.";
  }
  return null;
}

export async function createAnonymousFeedback(body: FeedbackInput) {
  const err = validateFeedback(body);
  if (err) return { ok: false as const, error: err };

  const ctx = getMealSessionContext();
  try {
    await prisma.feedback.create({
      data: {
        mealType: body.mealType,
        block: body.block,
        studentType: body.studentType,
        rating: body.rating,
        date: ctx.dateLabel,
        day: ctx.dayLabel,
      },
    });
    return { ok: true as const };
  } catch (unknownError) {
    console.error("[feedback] database error:", unknownError);
    return { ok: false as const, error: formatFeedbackDbError(unknownError) };
  }
}

function formatFeedbackDbError(err: unknown): string {
  if (err instanceof Prisma.PrismaClientInitializationError) {
    return (
      "Cannot open database connection. Start Docker Desktop, run `docker compose up -d`, " +
      "and set DATABASE_URL to postgresql://postgres:postgres@127.0.0.1:5432/amrita_feedback?schema=public " +
      "then restart `npm run dev`. If you use `prisma+postgres://…`, run `prisma dev` or switch to a normal postgresql:// URL."
    );
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const code = err.code;
    const msg = err.message;

    if (code === "P1001" || code === "P1000" || code === "P1017") {
      return (
        `Database unreachable (${code}). Run \`docker compose up -d\`, use DATABASE_URL with 127.0.0.1:5432, ` +
        `then \`npx prisma db push\` and restart the dev server.`
      );
    }

    if (/does not exist|relation.*not found|no such table/i.test(msg)) {
      return "Database tables are missing. From the `web` folder run: `npx prisma db push` (with Postgres running).";
    }

    return `Could not save feedback (${code}). ${msg.slice(0, 180)}`;
  }

  if (err instanceof Error) {
    const m = err.message;
    if (/Cannot fetch data from service|fetch failed/i.test(m)) {
      return (
        "Database URL looks like Prisma Postgres / Accelerate (`prisma+…`) but that service is not running. " +
        "In `web/.env` set DATABASE_URL to postgresql://postgres:postgres@127.0.0.1:5432/amrita_feedback?schema=public " +
        "and restart `npm run dev`."
      );
    }
    if (/ECONNREFUSED|getaddrinfo|timed out/i.test(m)) {
      return "Cannot connect to PostgreSQL. Start the DB (`docker compose up -d`) and check DATABASE_URL host/port.";
    }
  }

  return "We could not save your feedback. Check the server terminal log, then PostgreSQL + `npx prisma db push`.";
}
