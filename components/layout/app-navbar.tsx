"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, Menu, Utensils } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/feedback", label: "Submit Feedback" },
  { href: "/analytics", label: "Analytics" },
  { href: "/qr", label: "QR Access" },
] as const;

export function AppNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full min-w-0 border-b border-black/[0.06] bg-white/70 backdrop-blur-xl">
      <div className="mx-auto grid h-14 w-full min-w-0 max-w-6xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2 px-3 sm:h-16 sm:gap-x-3 sm:px-4 md:flex md:items-center md:justify-between md:gap-4 lg:px-6">
        <Link
          href="/"
          aria-label="Mess Food Feedback — home"
          className="flex min-w-0 shrink-0 items-center gap-1.5 rounded-lg py-1 text-neutral-900 sm:gap-2 md:gap-3"
        >
          <span className="relative h-8 w-[min(9.25rem,36vw)] shrink-0 sm:h-9 sm:w-[11.5rem] md:h-10 md:w-[13.5rem] md:max-w-none">
            <Image
              src="/amrita-vishwa-vidyapeetham-logo.svg"
              alt="Amrita Vishwa Vidyapeetham"
              fill
              className="object-contain object-left"
              priority
              sizes="(max-width: 768px) 9.25rem, 13.5rem"
            />
          </span>
          <span
            className="shrink-0 select-none text-base font-extralight leading-none text-neutral-400 sm:text-lg md:text-xl"
            aria-hidden
          >
            ×
          </span>
          <span className="font-display hidden text-base font-semibold tracking-wide text-neutral-900 md:inline">
            Mess Food Feedback
          </span>
        </Link>

        <p
          className="min-w-0 truncate px-1 text-center font-display text-[0.6875rem] font-semibold leading-tight tracking-wide text-neutral-900 min-[380px]:text-xs sm:text-sm md:hidden"
          aria-hidden
        >
          Mess Food Feedback
        </p>

        <div className="flex shrink-0 items-center justify-end gap-1 md:gap-2">
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {links.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "relative rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-neutral-900/[0.04]",
                    active && "text-[#4285F4]"
                  )}
                >
                  {label}
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-[#4285F4]/10"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <Menu className="size-4" />
          </Button>

          <div className="hidden shrink-0 md:block">
            <Link href="/feedback">
              <Button size="sm" className="rounded-full bg-[#4285F4] shadow-md shadow-[#4285F4]/25">
                <Utensils className="size-4" />
                Submit Feedback
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-black/[0.06] bg-white md:hidden"
          >
            <div className="mx-auto max-w-6xl px-3 py-3 sm:px-4">
              <div className="flex flex-col gap-1">
                {links.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-xl px-3 py-3 text-sm font-medium",
                      pathname === href ? "bg-[#4285F4]/10 text-[#4285F4]" : "hover:bg-neutral-50"
                    )}
                  >
                    {label}
                  </Link>
                ))}
                <Link
                  href="/feedback"
                  onClick={() => setOpen(false)}
                  className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-[#4285F4] px-3 py-3 text-sm font-semibold text-white"
                >
                  <LayoutDashboard className="size-4" />
                  Submit Feedback
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
