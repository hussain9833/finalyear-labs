"use client";

import { usePathname } from "next/navigation";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import { buildWaHref, type WaLinkParams } from "@/lib/whatsapp/link";
import { mirrorToGA } from "@/lib/analytics/client";

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("size-4 shrink-0", className)} fill="currentColor">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.24-9.43 9.44-9.43a9.37 9.37 0 0 1 6.67 2.77 9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.24 9.43-9.44 9.43M20.08 3.92A11.27 11.27 0 0 0 12.05.6C5.8.6.7 5.7.7 11.95c0 2 .52 3.95 1.52 5.67L.6 23.4l5.92-1.55a11.3 11.3 0 0 0 5.42 1.38h.01c6.26 0 11.35-5.1 11.36-11.35a11.3 11.3 0 0 0-3.23-7.96" />
    </svg>
  );
}

const waVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-xl font-medium whitespace-nowrap transition-[background-color,box-shadow,transform] duration-200 outline-none focus-visible:ring-3 focus-visible:ring-whatsapp/40 active:translate-y-px select-none",
  {
    variants: {
      variant: {
        solid: "bg-whatsapp text-whatsapp-foreground shadow-sm shadow-whatsapp/25 hover:bg-whatsapp/90 hover:shadow-md hover:shadow-whatsapp/30",
        outline: "border border-whatsapp/40 bg-whatsapp/5 text-foreground hover:bg-whatsapp/10 hover:border-whatsapp/60 [&_svg]:text-whatsapp",
        ghost: "text-foreground hover:bg-whatsapp/10 [&_svg]:text-whatsapp",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "solid", size: "md" },
  },
);

export type WhatsAppButtonProps = Omit<WaLinkParams, "source"> &
  VariantProps<typeof waVariants> & {
    children?: React.ReactNode;
    className?: string;
    "aria-label"?: string;
    hideIcon?: boolean;
  };

/**
 * The single component behind every WhatsApp CTA. It links to the tracked /api/wa redirect, which
 * picks the right number, logs the click (with ctaLocation, page, project, degree…) and opens WhatsApp.
 */
export function WhatsAppButton({
  intent,
  cta,
  project,
  category,
  degree,
  requirements,
  variant,
  size,
  className,
  children,
  hideIcon,
  ...rest
}: WhatsAppButtonProps) {
  const pathname = usePathname();
  if (!siteConfig.whatsappEnabled) return null;

  const href = buildWaHref({ intent, cta, project, category, degree, requirements, source: pathname ?? "/" });
  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow noopener"
      className={cn(waVariants({ variant, size }), className)}
      onClick={() => mirrorToGA("whatsapp_click", { cta_location: cta, project_slug: project, category, degree })}
      aria-label={rest["aria-label"]}
      data-cta={cta}
    >
      {!hideIcon && <WhatsAppIcon className={size === "lg" ? "size-5" : undefined} />}
      {children ?? (size === "icon" ? <span className="sr-only">Chat on WhatsApp</span> : "Chat on WhatsApp")}
    </a>
  );
}
