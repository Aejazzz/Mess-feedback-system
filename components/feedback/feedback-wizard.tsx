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
import { FEEDBACK_REVIEW_MAX_LEN, HOSTEL_BLOCKS, MEALS } from "@/lib/constants";
import type { MealType } from "@/lib/constants";
import { cn } from "@/lib/utils";

const emojiFor: Record<number, string> = {
  1: "😭",
  2: "😕",
  3: "😐",
  4: "🙂",
  5: "😍",
};

export function FeedbackWizard() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [meal, setMeal] = React.useState<MealType | "">("");
  const [block, setBlock] = React.useState<string>("");
  const [rating, setRating] = React.useState(0);
  const [hover, setHover] = React.useState(0);
  const [review, setReview] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const active = hover || rating;

  async function submit() {
    if (!meal || !block || !rating) {
      toast.error("Please complete every step—it's quick, we promise.");
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
          review: review.trim() || undefined,
        }),
      });
      const body = await res.json();
      if (!res.ok) {
        toast.error(body.error ?? "Unable to submit right now.");
        return;
      }
      router.push("/feedback/thank-you");
    } catch {
      toast.error("Network hiccup—try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-xl border-black/[0.06] bg-white/90 shadow-xl shadow-black/[0.05] backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#4285F4]">
          <Sparkles className="size-4" />
          Anonymous · 3 quick steps
        </div>
        <CardTitle className="text-2xl">Tell us about today&apos;s plate</CardTitle>
        <CardDescription>No names, no IDs—just honest stars.</CardDescription>
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
              <div className="grid gap-3 sm:grid-cols-2">
                {MEALS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMeal(m)}
                    className={`rounded-2xl border px-4 py-4 text-left shadow-sm ring-1 transition-all hover:-translate-y-1 hover:shadow-md ${
                      meal === m ? "border-[#4285F4] bg-[#4285F4]/10" : "border-black/[0.06] bg-[#FAFAFA]"
                    }`}
                  >
                    <p className="text-base font-semibold">{m}</p>
                    <p className="text-xs text-neutral-600">Tap to choose</p>
                  </button>
                ))}
              </div>
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
                Hover for a grin preview, tap to commit your stars—springy and calm.
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
            disabled={submitting || (step === 0 && !meal) || (step === 1 && !block)}
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
                Sending warmth…
              </>
            ) : (
              <>Submit anonymously</>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
