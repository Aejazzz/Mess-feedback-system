"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FEEDBACK_REVIEW_MAX_LEN, HOSTEL_BLOCKS } from "@/lib/constants";
import type { MealType } from "@/lib/constants";
import {
  CAMPUS_TIME_ZONE,
  describeFullScheduleIST,
  formatMealWindowHuman,
  getNextServingHint,
  getOpenMeals,
  isMealWindowOpen,
} from "@/lib/meal-windows";
import { cn } from "@/lib/utils";

const CLIENT_ID_STORAGE_KEY = "amrita-mess-feedback-client-id";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function getOrCreateFeedbackClientId(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = window.localStorage.getItem(CLIENT_ID_STORAGE_KEY);
    if (existing && UUID_RE.test(existing)) return existing;
    const id = crypto.randomUUID();
    window.localStorage.setItem(CLIENT_ID_STORAGE_KEY, id);
    return id;
  } catch {
    return "";
  }
}

const emojiFor: Record<number, string> = {
  1: "😭",
  2: "😕",
  3: "😐",
  4: "🙂",
  5: "😍",
};

function formatNowInIST(now: Date) {
  const datePart = new Intl.DateTimeFormat("en-GB", {
    timeZone: CAMPUS_TIME_ZONE,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(now);
  const timePart = new Intl.DateTimeFormat("en-GB", {
    timeZone: CAMPUS_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(now);
  return { datePart, timePart };
}

function FeedbackSessionNotice({ meal, now }: { meal: MealType | ""; now: Date }) {
  const { datePart, timePart } = formatNowInIST(now);

  if (!meal) {
    return (
      <div className="rounded-2xl border border-black/[0.08] bg-white px-4 py-3 text-center shadow-sm sm:px-5">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">India Standard Time (IST)</p>
        <p className="text-sm font-semibold text-neutral-900">{datePart}</p>
        <p className="text-sm font-medium text-neutral-700">{timePart}</p>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
          When a serving window is open, choose that meal in the form below. Your submission is tied to
          the date and time above and you can submit once per meal per window on this device.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#4285F4]/25 bg-[#4285F4]/8 px-4 py-3 text-center shadow-sm sm:px-5">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-600">India Standard Time (IST)</p>
      <p className="text-sm leading-relaxed text-neutral-800">
        You are giving feedback for <span className="font-semibold text-neutral-950">{meal}</span> on{" "}
        <span className="font-medium text-neutral-900">{datePart}</span> at{" "}
        <span className="font-medium text-neutral-900">{timePart}</span>.
      </p>
      <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm">
        Complete the steps in the form below to finish your submission for this meal.
      </p>
    </div>
  );
}

export function FeedbackWizard() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [meal, setMeal] = React.useState<MealType | "">("");
  const [block, setBlock] = React.useState<string>("");
  const [rating, setRating] = React.useState(0);
  const [hover, setHover] = React.useState(0);
  const [review, setReview] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [now, setNow] = React.useState(() => new Date());

  const clientId = React.useSyncExternalStore(
    () => () => {},
    () => getOrCreateFeedbackClientId(),
    () => ""
  );

  const openMeals = React.useMemo(() => getOpenMeals(now), [now]);

  React.useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 5000);
    return () => window.clearInterval(id);
  }, []);

  const selectedMealOnStep0 = meal && openMeals.includes(meal) ? meal : "";
  const mealForContext = step === 0 ? selectedMealOnStep0 : meal || "";

  const active = hover || rating;

  async function submit() {
    if (!meal || !block || !rating) {
      toast.error("Please complete all steps before submitting.");
      return;
    }
    if (!clientId) {
      toast.error("Session not ready. Please reload the page and try again.");
      return;
    }
    if (!isMealWindowOpen(meal, new Date())) {
      toast.error("This meal serving window has closed. Please go back and choose the current meal.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mealType: meal,
          block,
          rating,
          clientId,
          review: review.trim() || undefined,
        }),
      });
      const body = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          toast.error(body.error ?? "You already submitted for this meal window.");
        } else {
          toast.error(body.error ?? "Unable to submit right now.");
        }
        return;
      }
      router.push("/feedback/thank-you");
    } catch {
      toast.error("Network error. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl space-y-4">
      <FeedbackSessionNotice meal={mealForContext} now={now} />
      <Card className="w-full border-black/[0.06] bg-white/90 shadow-xl shadow-black/[0.05] backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#4285F4]">
            <Sparkles className="size-4" />
            Anonymous · three steps
          </div>
          <CardTitle className="text-2xl">Mess feedback form</CardTitle>
          <CardDescription>No sign-in required. Ratings are anonymous.</CardDescription>
          <div className="flex gap-1 pt-2">
            {[0, 1, 2].map((idx) => (
              <span
                key={idx}
                className={`h-1 flex-1 rounded-full ${step >= idx ? "bg-[#4285F4]" : "bg-neutral-200"}`}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent className="min-h-[280px] sm:min-h-[300px]">
          <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="meal"
              initial={{ opacity: 0, filter: "blur(6px)", x: -10 }}
              animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
              exit={{ opacity: 0, filter: "blur(6px)", x: 12 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              className="space-y-4"
            >
              <p className="text-lg font-semibold tracking-tight">Which meal?</p>
              <p className="text-sm text-muted-foreground">
                Only meals with an open serving window (IST) can be selected. Schedule:{" "}
                {describeFullScheduleIST()}.
              </p>
              {openMeals.length === 0 ? (
                <div className="rounded-2xl border border-amber-200/80 bg-amber-50/90 px-4 py-4 text-sm text-amber-950">
                  <p className="font-medium">No meal window is open right now.</p>
                  <p className="mt-1 text-amber-900/90">{getNextServingHint(now)}</p>
                  <p className="mt-2 text-xs text-amber-900/80">
                    Each meal can be rated once per serving time on this device. Please return during the
                    times above.
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {openMeals.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMeal(m)}
                      className={`rounded-2xl border px-4 py-4 text-left shadow-sm ring-1 transition-all hover:-translate-y-1 hover:shadow-md ${
                        selectedMealOnStep0 === m
                          ? "border-[#4285F4] bg-[#4285F4]/10"
                          : "border-black/[0.06] bg-[#FAFAFA]"
                      }`}
                    >
                      <p className="text-base font-semibold">{m}</p>
                      <p className="text-xs text-neutral-600">{formatMealWindowHuman(m)} IST · open now</p>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="block"
              initial={{ opacity: 0, filter: "blur(6px)", x: -10 }}
              animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
              exit={{ opacity: 0, filter: "blur(6px)", x: 12 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              className="space-y-4"
            >
              <p className="text-lg font-semibold tracking-tight">Hostel block</p>
              <Select value={block || undefined} onValueChange={(v) => setBlock(v ?? "")}>
                <SelectTrigger size="default" className="h-12 w-full min-w-0 rounded-2xl text-base">
                  <SelectValue placeholder="Choose your block" />
                </SelectTrigger>
                <SelectContent className="min-w-[260px]">
                  {HOSTEL_BLOCKS.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="rating"
              initial={{ opacity: 0, filter: "blur(6px)", x: -10 }}
              animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
              exit={{ opacity: 0, filter: "blur(6px)", x: 12 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              className="space-y-5"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-lg font-semibold tracking-tight">How was the food?</p>
                <span className="text-4xl" aria-live="polite">
                  {active ? emojiFor[active] ?? "✨" : "⭐️"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const filled = star <= active;
                  return (
                    <motion.button
                      key={star}
                      type="button"
                      aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      onFocus={() => setHover(star)}
                      onBlur={() => setHover(0)}
                      onClick={() => setRating(star)}
                      whileTap={{ scale: 0.9 }}
                      className={cn(
                        "grid size-12 place-items-center rounded-2xl text-2xl transition-colors",
                        filled ? "bg-amber-100 text-amber-700" : "bg-neutral-50 text-neutral-400"
                      )}
                    >
                      ★
                    </motion.button>
                  );
                })}
              </div>
              <div className="space-y-2">
                <label htmlFor="feedback-review" className="text-sm font-semibold text-neutral-900">
                  Write a review
                </label>
                <textarea
                  id="feedback-review"
                  value={review}
                  onChange={(e) => setReview(e.target.value.slice(0, FEEDBACK_REVIEW_MAX_LEN))}
                  rows={4}
                  maxLength={FEEDBACK_REVIEW_MAX_LEN}
                  placeholder="Optional — what stood out, or what could be better?"
                  className="w-full resize-y rounded-2xl border border-input bg-transparent px-4 py-3 text-base text-neutral-900 shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-[#4285F4] focus-visible:ring-[3px] focus-visible:ring-[#4285F4]/25 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <p className="text-xs text-muted-foreground">
                  {review.length} / {FEEDBACK_REVIEW_MAX_LEN}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Hover or focus stars for a preview, then click to set your rating.
              </p>
            </motion.div>
          )}
          </AnimatePresence>
        </CardContent>
        <CardFooter className="flex justify-between gap-3">
          <Button
          variant="outline"
          className="rounded-full"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || submitting}
          >
            Back
          </Button>
          {step < 2 ? (
            <Button
              className="relative isolate overflow-hidden rounded-full bg-[#4285F4] px-6"
              disabled={
              submitting ||
              !clientId ||
              (step === 0 && (!selectedMealOnStep0 || openMeals.length === 0)) ||
              (step === 1 && !block)
            }
              onClick={() => setStep((s) => Math.min(2, s + 1))}
            >
              Continue
            </Button>
          ) : (
            <Button
              className="relative isolate overflow-hidden rounded-full bg-[#34A853] px-6"
              disabled={submitting || rating === 0}
              onClick={submit}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                <>Submit feedback</>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
