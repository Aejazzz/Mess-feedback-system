"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Coffee, Sandwich, Salad, Moon } from "lucide-react";
import * as React from "react";

const STORAGE_KEY = "amrita-food-feedback-splash";

function FloatingBubble({ delay }: { delay: number }) {
  const icons = [
    Coffee,
    Salad,
    Sandwich,
    Moon,
  ] as const;
  const Icon = icons[(Math.floor(delay * 17) % icons.length)!] ?? Coffee;
  return (
    <motion.div
      className="pointer-events-none absolute text-[#4285F4]/30"
      initial={{ opacity: 0.3, y: 0, rotate: -6 }}
      animate={{ opacity: [0.35, 0.85, 0.35], y: [-8, -40, -8], rotate: [6, -4, 6] }}
      transition={{ duration: 9 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <Icon className="size-7" aria-hidden />
    </motion.div>
  );
}

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
    }, 2900);
    return () => window.clearTimeout(t);
  }, [showSplash]);

  if (showSplash === null) return <div className="min-h-svh bg-[#FAFAFA]" />;

  return (
    <div className="relative min-h-svh">
      <AnimatePresence>
        {showSplash && (
          <motion.section
            className="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-[#FAFAFA]"
            aria-label="Intro"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="pointer-events-none absolute inset-0">
              {[0, 1.2, 2.6, 3.9, 5.1].map((d, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${8 + ((i * 19) % 70)}vw`,
                    top: `${14 + (((i + 7) * 21) % 55)}vh`,
                  }}
                >
                  <FloatingBubble delay={d} />
                </div>
              ))}
            </div>

            <motion.div
              className="relative z-[1] max-w-xl px-6 text-center"
              initial={{ filter: "blur(10px)", opacity: 0, y: 12 }}
              animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
            >
              <motion.div
                className="flex flex-wrap items-center justify-center gap-2 text-neutral-900"
                aria-hidden="false"
              >
                {"Amrita Food Feedback System".split("").map((ch, idx) => (
                  <motion.span
                    key={`${idx}-${ch}`}
                    className={`inline-block text-3xl font-semibold tracking-tight sm:text-4xl`}
                    initial={{ opacity: 0.02, filter: "blur(6px)", y: 8 }}
                    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                    transition={{ delay: 0.04 * idx + 0.1, duration: 0.28 }}
                  >
                    {ch === " " ? "\u00A0" : ch}
                  </motion.span>
                ))}
              </motion.div>

              <motion.p
                className="mx-auto mt-4 max-w-md text-base text-neutral-600"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.45 }}
              >
                Warm, anonymous feedback windows for every meal—with live trends you can trust.
              </motion.p>

              <motion.div
                className="mx-auto mt-10 h-[3px] w-44 overflow-hidden rounded-full bg-neutral-200"
                aria-hidden
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-[#4285F4] via-[#34A853] to-[#FBBC05]"
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 2.35, ease: "easeOut" }}
                />
              </motion.div>
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
