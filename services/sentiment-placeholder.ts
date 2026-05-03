/** Placeholder hooks for optional future TEXT reviews / sentiment pipelines. */

export type SentimentResult = {
  polarity: number;
  label: "positive" | "neutral" | "negative";
};

/**
 * Lightweight stub scoring for future onboarding of LLM/embeddings-backed analysis.
 */
export async function sentimentStub(): Promise<SentimentResult> {
  return { polarity: 0.5, label: "neutral" };
}
