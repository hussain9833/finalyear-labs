import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("size-8", className)}>
      <defs>
        <linearGradient id="fyl-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--primary)" />
          <stop offset="1" stopColor="var(--brand-2)" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#fyl-g)" />
      <path d="M10 22V10h8.5M10 16h6.5" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M19.5 15.5V22h4" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity=".9" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  const [first, ...rest] = siteConfig.name.split(" ");
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5 rounded-lg", className)} aria-label={`${siteConfig.name} home`}>
      <LogoMark className="transition-transform duration-300 group-hover:-rotate-6" />
      <span className="text-[1.05rem] font-semibold tracking-tight">
        {first}
        {rest.length > 0 && <span className="text-muted-foreground"> {rest.join(" ")}</span>}
      </span>
    </Link>
  );
}
