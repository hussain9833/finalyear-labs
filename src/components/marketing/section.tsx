import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

export function Section({
  id,
  className,
  children,
  "aria-labelledby": labelledBy,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
  "aria-labelledby"?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("py-16 md:py-24", className)}>
      <div className="container-page">{children}</div>
    </section>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = "left",
  action,
  as: Heading = "h2",
}: {
  id?: string;
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  action?: React.ReactNode;
  as?: "h1" | "h2";
}) {
  return (
    <Reveal
      className={cn(
        "mb-10 flex flex-col gap-4 self-start md:mb-12",
        align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && <p className="mb-3 text-sm font-medium text-primary">{eyebrow}</p>}
        <Heading id={id} className="text-3xl font-semibold tracking-tight md:text-4xl">
          {title}
        </Heading>
        {description && <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}
