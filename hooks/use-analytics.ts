"use client";

import useSWR from "swr";

import type { AnalyticsPayload } from "@/lib/types/analytics";

async function fetcher(url: string): Promise<AnalyticsPayload> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load analytics");
  return res.json();
}

export function useAnalytics(intervalMs = 15_000) {
  const { data, error, isLoading, mutate } = useSWR("/api/analytics", fetcher, {
    refreshInterval: intervalMs,
    revalidateOnFocus: true,
    dedupingInterval: 2_000,
  });

  return {
    analytics: data,
    loading: !data && !error,
    refreshing: !!data && isLoading,
    error,
    mutate,
  };
}
