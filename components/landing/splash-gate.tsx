"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import * as React from "react";

const STORAGE_KEY = "amrita-food-feedback-splash";
/** First-open intro duration so the splash is easy to notice and read. */
const INTRO_MS = 6500;

type Phase = "intro" | "ready";

function AmbientOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute -left-[15%] top-[18%] h-[min(380px,55vw)] w-[min(380px,55vw)] rounded-full bg-[#4285F4]/18 blur-3xl"
        animate={{ scale: [1, 1.08, 1], opacity: [0.45, 0.65, 0.45] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-[12%] bottom-[12%] h-[min(340px,50vw)] w-[min(340px,50vw)] rounded-full bg-[#34A853]/16 blur-3xl"
        animate={{ scale: [1.06, 1, 1.06], opacity: [0.4, 0.58, 0.4] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute left-1/2 top-[8%] h-[min(280px,42vw)] w-[min(280px,42vw)] -translate-x-1/2 rounded-full bg-[#FBBC05]/10 blur-3xl"
        animate={{ y: [0, 12, 0], opacity: [0.3, 0.45, 0.3] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
    </div>
  );
}

function BrandLoader() {
  return (
    <div className="relative flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32" aria-hidden>
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-neutral-200/90"
        initial={{ opacity: 0.6 }}
        animate={{ opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-[3px] rounded-full"
        style={{
          background: "conic-gradient(from 0deg, transparent 0%, #4285F4 25%, #34A853 55%, #FBBC05 80%, transparent 100%)",
          maskImage: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
          WebkitMaskImage:
            "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1.35, repeat: Infinity, ease: "linear" }}
      />
      <div className="relative z-[1] flex size-[4.25rem] items-center justify-center rounded-full bg-white/90 shadow-inner shadow-neutral-200/60 ring-1 ring-white/80 sm:size-[4.75rem]">
        <svg viewBox="0 0 48 48" className="size-9 text-[#4285F4] sm:size-10" fill="none" aria-hidden>
          <path
            d="M12 22c0-4 3.5-8 12-8s12 4 12 8v14H12V22Z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
            opacity={0.9}
          />
          {[18, 24, 30].map((x, i) => (
            <motion.line
              key={x}
              x1={x}
              y1={13}
              x2={x}
              y2={5}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity={0.45}
              animate={{ y1: [13, 11, 13], y2: [5, 3, 5], opacity: [0.2, 0.55, 0.2] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.18 }}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

function IntroPanel() {
  return (
    <div className="relative z-[1] w-full max-w-[min(22rem,92vw)]">
      <div className="rounded-[1.75rem] border border-white/70 bg-white/75 px-8 py-10 shadow-[0_24px_80px_-12px_rgba(66,133,244,0.18)] backdrop-blur-xl sm:px-10 sm:py-11">
        <div className="flex flex-col items-center gap-7 sm:gap-8">
          <div className="relative h-14 w-[13.5rem] shrink-0 sm:h-[3.75rem] sm:w-[15rem]">
            <Image
              src="/amrita-vishwa-vidyapeetham-logo.svg"
              alt="Amrita Vishwa Vidyapeetham"
              fill
              className="object-contain"
              priority
              sizes="15rem"
            />
          </div>

          <div className="space-y-1.5 text-center">
            <h1 className="font-display text-[1.35rem] font-medium leading-snug tracking-wide text-neutral-800 sm:text-2xl">
              Mess Food Feedback Portal
            </h1>
            <p className="font-display text-xs font-normal tracking-wide text-neutral-500 sm:text-sm">
              Anonymous mess feedback with live analytics for Amrita campuses.
            </p>
          </div>

          <BrandLoader />

          <div className="flex w-full justify-center gap-1.5 pt-0.5" aria-hidden>
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.span
                key={i}
                className="h-1 w-6 rounded-full bg-gradient-to-r from-[#4285F4]/25 via-[#34A853]/35 to-[#FBBC05]/25"
                animate={{ scaleX: [0.35, 1, 0.35], opacity: [0.35, 1, 0.35] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  delay: i * 0.12,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SplashGate({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = React.useState<Phase>("intro");

  React.useLayoutEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- read sessionStorage once before paint to skip intro without flash */
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) setPhase("ready");
    } catch {
      /* keep intro */
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  React.useEffect(() => {
    if (phase !== "intro") return;
    const t = window.setTimeout(() => {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }
      setPhase("ready");
    }, INTRO_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  const showOverlay = phase === "intro";

  return (
    <div className="relative min-h-svh">
      <AnimatePresence mode="wait">
        {showOverlay && (
          <motion.section
            key="splash"
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#f6f8fc] px-5 py-10"
            aria-label="Loading"
            aria-busy="true"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <AmbientOrbs />
            <IntroPanel />
          </motion.section>
        )}
      </AnimatePresence>

      <motion.div
        className="min-h-svh"
        initial={false}
        animate={{
          opacity: phase === "ready" ? 1 : 0,
          pointerEvents: phase === "ready" ? "auto" : "none",
        }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: phase === "ready" ? 0.06 : 0 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
