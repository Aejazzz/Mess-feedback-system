"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delay={200}>
      {children}
      <Toaster richColors closeButton />
    </TooltipProvider>
  );
}
