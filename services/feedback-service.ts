import { Prisma } from "@prisma/client";

import { getMealSessionContext } from "@/lib/meal-context";
import { FEEDBACK_REVIEW_MAX_LEN, HOSTEL_BLOCKS, MEALS } from "@/lib/constants";
import type { MealType } from "@/lib/constants";
import { formatMealWindowHuman, getMealSlotKey, isMealWindowOpen } from "@/lib/meal-windows";

import { prisma } from "@/lib/prisma";

const CLIENT_UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type FeedbackInput = {
  mealType: MealType;
  block: string;
  rating: number;
  review?: string | null;
  clientId: string;
};

export type CreateFeedbackResult =
  | { ok: true }
  | { ok: false; error: string; code?: "DUPLICATE_SLOT" };

export function validateFeedback(input: FeedbackInput): string | null {
  if (!MEALS.includes(input.mealType)) return "Invalid meal type.";
  if (!(HOSTEL_BLOCKS as readonly string[]).includes(input.block))
    return "Invalid hostel block.";
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
    return "Rating must be between 1 and 5.";
  }
  const review = input.review?.trim() ?? "";
  if (review.length > FEEDBACK_REVIEW_MAX_LEN) {
    return `Review must be at most ${FEEDBACK_REVIEW_MAX_LEN} characters.`;
  }
  const cid = input.clientId.trim();
  if (!CLIENT_UUID_RE.test(cid)) {
    return "Invalid client identifier. Please reload the page and try again.";
  }
  return null;
}

export async function createAnonymousFeedback(body: FeedbackInput): Promise<CreateFeedbackResult> {
  const err = validateFeedback(body);
  if (err) return { ok: false, error: err };

  const now = new Date();
  if (!isMealWindowOpen(body.mealType, now)) {
    return {
      ok: false,
      error: `Feedback for ${body.mealType} is only accepted during ${formatMealWindowHuman(body.mealType)} IST.`,
    };
  }

  const ctx = getMealSessionContext(now);
  const reviewTrimmed = body.review?.trim() ?? "";
  const mealSlotKey = getMealSlotKey(body.mealType, now);
  const clientId = body.clientId.trim();

  try {
    await prisma.feedback.create({
      data: {
        mealType: body.mealType,
        block: body.block,
        rating: body.rating,
        review: reviewTrimmed.length > 0 ? reviewTrimmed : null,
        date: ctx.dateLabel,
        day: ctx.dayLabel,
        clientId,
        mealSlotKey,
      },
    });
    return { ok: true };
  } catch (unknownError) {
    if (
      unknownError instanceof Prisma.PrismaClientKnownRequestError &&
      unknownError.code === "P2002"
    ) {
      return {
        ok: false,
        code: "DUPLICATE_SLOT",
        error:
          "You have already submitted feedback for this meal during the current serving time. Please wait until the next meal window opens.",
      };
    }
    console.error("[feedback] database error:", unknownError);
    return { ok: false, error: formatFeedbackDbError(unknownError) };
  }
}

/** True when this process is a remote Vercel deployment (not `vercel dev` on your laptop). */
function isVercelDeployedServer(): boolean {
  if (process.env.VERCEL_ENV === "development") return false;
  const v = process.env.VERCEL;
  if (v === "1" || v === "true") return true;
  if (process.env.VERCEL_URL && !/^https?:\/\/localhost/i.test(process.env.VERCEL_URL)) return true;
  return false;
}

function databaseUrlLooksLocal(): boolean {
  const u = process.env.DATABASE_URL ?? "";
  return /127\.0\.0\.1|localhost/i.test(u);
}

/** User-facing copy when the server runs on Vercel (or similar) — not Docker on a laptop. */
function hostedDatabaseSetupMessage(): string {
  return (
    "This deployment cannot reach PostgreSQL. On vercel.com open your project → Settings → Environment Variables " +
    "and set DATABASE_URL to a hosted database (Neon, Supabase, or Vercel Postgres). " +
    "Run `npx prisma db push` against that database from your machine, then redeploy. " +
    "URLs with localhost or 127.0.0.1 only work on your own computer, not on Vercel."
  );
}

function localDevDatabaseMessage(kind: "init" | "unreachable" | "prismaPlus" | "socket"): string {
  if (kind === "init") {
    return (
      "Cannot open database connection. Start Docker Desktop, run `docker compose up -d`, " +
      "and set DATABASE_URL to postgresql://postgres:postgres@127.0.0.1:5432/amrita_feedback?schema=public " +
      "then restart `npm run dev`. If you use `prisma+postgres://…`, run `prisma dev` or switch to a normal postgresql:// URL."
    );
  }
  if (kind === "unreachable") {
    return (
      "Database unreachable. Run `docker compose up -d`, use DATABASE_URL with 127.0.0.1:5432, " +
      "then `npx prisma db push` and restart the dev server."
    );
  }
  if (kind === "prismaPlus") {
    return (
      "Database URL looks like Prisma Postgres / Accelerate (`prisma+…`) but that service is not running. " +
      "In `web/.env` set DATABASE_URL to postgresql://postgres:postgres@127.0.0.1:5432/amrita_feedback?schema=public " +
      "and restart `npm run dev`."
    );
  }
  return "Cannot connect to PostgreSQL. Start the DB (`docker compose up -d`) and check DATABASE_URL host/port.";
}

function formatFeedbackDbError(err: unknown): string {
  const hosted =
    isVercelDeployedServer() ||
    (process.env.NODE_ENV === "production" && databaseUrlLooksLocal()) ||
    (process.env.NODE_ENV === "production" && !(process.env.DATABASE_URL ?? "").trim());

  if (err instanceof Prisma.PrismaClientInitializationError) {
    return hosted ? hostedDatabaseSetupMessage() : localDevDatabaseMessage("init");
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const code = err.code;
    const msg = err.message;

    if (code === "P1001" || code === "P1000" || code === "P1017") {
      return hosted ? hostedDatabaseSetupMessage() : localDevDatabaseMessage("unreachable");
    }

    if (/does not exist|relation.*not found|no such table/i.test(msg)) {
      return hosted
        ? "Database tables are missing. Run `npx prisma db push` against the same DATABASE_URL you configured on Vercel, then try again."
        : "Database tables are missing. From the `web` folder run: `npx prisma db push` (with Postgres running).";
    }

    return `Could not save feedback (${code}). ${msg.slice(0, 180)}`;
  }

  if (err instanceof Error) {
    const m = err.message;
    if (/Cannot fetch data from service|fetch failed/i.test(m)) {
      return hosted ? hostedDatabaseSetupMessage() : localDevDatabaseMessage("prismaPlus");
    }
    if (/ECONNREFUSED|getaddrinfo|timed out/i.test(m)) {
      return hosted ? hostedDatabaseSetupMessage() : localDevDatabaseMessage("socket");
    }
  }

  return hosted
    ? hostedDatabaseSetupMessage()
    : "We could not save your feedback. Check the server terminal log, then PostgreSQL + `npx prisma db push`.";
}
