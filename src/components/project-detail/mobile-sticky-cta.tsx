"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";

/**
 * Mobile-only sticky bottom CTA. The page reserves bottom padding (pb-28) so it never covers content,
 * and the bar hides while the inline CTA block is on screen to avoid duplicate buttons.
 */
export function MobileStickyCta({ slug, name, price, degree }: { slug: string; name: string; price: string; degree?: string }) {
  const [inlineVisible, setInlineVisible] = useState(true);

  useEffect(() => {
    const target = document.getElementById("inline-cta");
    if (!target) return;
    const io = new IntersectionObserver(([entry]) => setInlineVisible(Boolean(entry?.isIntersecting)), { threshold: 0 });
    io.observe(target);
    return () => io.disconnect();
  }, []);

  if (!siteConfig.whatsappEnabled) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/90 backdrop-blur-xl transition-transform duration-300 lg:hidden",
        inlineVisible ? "translate-y-full" : "translate-y-0",
      )}
      aria-hidden={inlineVisible}
      inert={inlineVisible}
    >
      <div className="container-page flex items-center gap-3 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-muted-foreground">{name}</p>
          <p className="text-base font-semibold">
            <span className="text-xs font-normal text-muted-foreground">from </span>
            {price}
          </p>
        </div>
        <WhatsAppButton intent="project" cta="mobile_sticky" project={slug} degree={degree} size="lg" className="shrink-0 px-5">
          Get This Project
        </WhatsAppButton>
      </div>
    </div>
  );
}
