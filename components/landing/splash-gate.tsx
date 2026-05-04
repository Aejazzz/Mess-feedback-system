"use client";

import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import * as React from "react";

const DotLottieReact = dynamic(
  () => import("@lottiefiles/dotlottie-react").then((m) => m.DotLottieReact),
  { ssr: false },
);

const STORAGE_KEY = "amrita-food-feedback-splash";

const DOTLOTTIE_SRC =
  "https://lottie.host/ba7482da-e7fb-44ae-af8a-ae05383bb0ff/FczOutHRaY.lottie";

export function SplashGate({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- sessionStorage unavailable until mount */
    try {
      const skipped = typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY);
      setShowSplash(!skipped);
    } catch {
      setShowSplash(true);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  React.useEffect(() => {
    if (!showSplash) return;
    const t = window.setTimeout(() => {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }
      setShowSplash(false);
    }, 3600);
    return () => window.clearTimeout(t);
  }, [showSplash]);

  if (showSplash === null) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-8 bg-[#FAFAFA] px-6">
        <div className="relative h-12 w-48 shrink-0 sm:h-14 sm:w-56">
          <Image
            src="/amrita-vishwa-vidyapeetham-logo.svg"
            alt="Amrita Vishwa Vidyapeetham"
            fill
            className="object-contain"
            priority
            sizes="14rem"
          />
        </div>
        <div className="font-display text-center text-lg font-medium tracking-wide text-neutral-700 sm:text-xl">
          Mess Food Feedback Portal
        </div>
        <div className="flex gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="size-2 rounded-full bg-[#4285F4]/45"
              animate={{ opacity: [0.35, 1, 0.35], y: [0, -6, 0] }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-svh">
      <AnimatePresence>
        {showSplash && (
          <motion.section
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 overflow-hidden bg-[#FAFAFA] px-6 sm:gap-10"
            aria-label="Intro"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55 }}
          >
            <motion.div
              className="flex w-full max-w-md flex-col items-center gap-8 text-center sm:max-w-lg sm:gap-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 140, damping: 20 }}
            >
              <div className="relative h-14 w-56 shrink-0 sm:h-16 sm:w-64">
                <Image
                  src="/amrita-vishwa-vidyapeetham-logo.svg"
                  alt="Amrita Vishwa Vidyapeetham"
                  fill
                  className="object-contain"
                  priority
                  sizes="16rem"
                />
              </div>

              <h1 className="font-display text-2xl font-medium leading-snug tracking-wide text-neutral-800 sm:text-3xl">
                Mess Food Feedback Portal
              </h1>

              <DotLottieReact
                src={DOTLOTTIE_SRC}
                loop
                autoplay
                width={220}
                height={220}
                className="mx-auto max-h-[min(220px,72vw)] max-w-[min(220px,72vw)]"
                aria-hidden
              />
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.08 }}>
        {children}
      </motion.div>
    </div>
  );
}
