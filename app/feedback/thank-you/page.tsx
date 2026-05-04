"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import * as React from "react";

import { AppNavbar } from "@/components/layout/app-navbar";

export default function ThankYouPage() {
  const router = useRouter();

  React.useEffect(() => {
    const redirect = window.setTimeout(() => {
      router.push("/analytics");
    }, 2900);
    return () => window.clearTimeout(redirect);
  }, [router]);

  return (
    <div className="min-h-svh bg-[#FAFAFA]">
      <AppNavbar />
      <main className="relative grid min-h-[calc(100svh-3.5rem)] place-items-center px-6 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ type: "spring", stiffness: 160, damping: 20 }}
          className="relative z-[1] max-w-lg space-y-6 rounded-[32px] border border-black/[0.06] bg-white/90 px-10 py-12 shadow-2xl shadow-[#4285F4]/10 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.6, rotate: -8, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ delay: 0.08, type: "spring", stiffness: 260, damping: 18 }}
            className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-50 text-emerald-600 shadow-inner ring-8 ring-emerald-100"
          >
            <CheckCircle2 className="size-10" />
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Thank you</h1>
            <p className="text-lg text-neutral-600">
              Your feedback was submitted successfully. It helps improve the mess experience.
            </p>
          </div>
          <motion.p className="text-sm text-muted-foreground" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
            Redirecting you to analytics…
          </motion.p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/analytics"
              className="rounded-full bg-[#4285F4] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-[#4285F4]/30"
            >
              View analytics
            </Link>
            <Link href="/" className="rounded-full px-5 py-2 text-sm font-semibold text-neutral-700 ring-1 ring-black/[0.08] hover:bg-neutral-50">
              Back to home
            </Link>
          </div>
        </motion.div>

        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(66,133,244,0.35),transparent_52%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(52,168,83,0.25),transparent_55%)]" />
        </div>
      </main>
    </div>
  );
}
