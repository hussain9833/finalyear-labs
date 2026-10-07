"use client";

import { ThemeProvider } from "next-themes";
import { LazyMotion, MotionConfig } from "motion/react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Motion features load asynchronously so they stay out of the critical bundle.
const loadMotionFeatures = () => import("@/components/motion/features").then((m) => m.default);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <MotionConfig reducedMotion="user">
        <LazyMotion features={loadMotionFeatures} strict>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster richColors closeButton position="top-center" />
        </LazyMotion>
      </MotionConfig>
    </ThemeProvider>
  );
}
