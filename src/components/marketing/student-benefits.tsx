import Link from "next/link";
import { ArrowRight, BookOpenCheck, FileText, GraduationCap, Headphones, Presentation, Search, Wallet } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BENEFITS = [
  { icon: Search, tone: "bg-primary/10 text-primary", title: "Find it easily", body: "Filter by degree, technology or category — or use the project finder and get matches in a minute." },
  { icon: GraduationCap, tone: "bg-brand-2/15 text-brand-2", title: "Made for your syllabus", body: "Projects chosen for BCA, MCA, BSc IT, MSc IT, B.Tech and M.Tech final-year requirements." },
  { icon: FileText, tone: "bg-brand-3/10 text-brand-3", title: "Synopsis & report help", body: "Templates for synopsis, project report and documentation that you adapt to your project." },
  { icon: Presentation, tone: "bg-brand-4/15 text-brand-4", title: "PPT & viva preparation", body: "Understand the code, architecture and likely viva questions so you can present with confidence." },
  { icon: Headphones, tone: "bg-success/15 text-success", title: "Setup & WhatsApp support", body: "Stuck on installation or customization? Message us directly and talk to a real person." },
  { icon: Wallet, tone: "bg-warning/20 text-warning", title: "Student-friendly pricing", body: "Clear prices and customization options that fit a student budget." },
];

export function StudentBenefits() {
  return (
    <>
      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map((b) => (
          <StaggerItem key={b.title} className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg hover:shadow-primary/10">
            <span className={cn("grid size-11 place-items-center rounded-xl", b.tone)}>
              <b.icon className="size-5" aria-hidden />
            </span>
            <h3 className="mt-4 text-lg font-semibold">{b.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
          </StaggerItem>
        ))}
      </Stagger>
      <Reveal className="mt-8 flex flex-col items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-3 text-sm font-medium">
          <BookOpenCheck className="size-5 shrink-0 text-primary" aria-hidden />
          Not sure which project suits you? Answer a few questions and we&apos;ll suggest the best match.
        </p>
        <Link href="/project-finder" className={cn(buttonVariants(), "h-11 rounded-xl px-5")}>
          Try the project finder <ArrowRight className="size-4" aria-hidden />
        </Link>
      </Reveal>
    </>
  );
}
