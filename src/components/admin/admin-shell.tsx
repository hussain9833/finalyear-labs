"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  ExternalLink,
  FileText,
  FolderKanban,
  GraduationCap,
  HelpCircle,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  Search,
  Shapes,
  Users,
  UserSquare2,
} from "lucide-react";
import { logoutAction, logoutEverywhereAction } from "@/app/admin/login/actions";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LogoMark } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

const ICONS = {
  dashboard: LayoutDashboard,
  analytics: BarChart3,
  leads: UserSquare2,
  requests: Inbox,
  projects: FolderKanban,
  categories: Shapes,
  degrees: GraduationCap,
  testimonials: MessageSquareQuote,
  faqs: HelpCircle,
  seo: Search,
  users: Users,
  docs: FileText,
};

export type AdminNavItem = { href: string; label: string; icon: keyof typeof ICONS };

export function AdminShell({
  nav,
  admin,
  children,
}: {
  nav: AdminNavItem[];
  admin: { name: string; email: string; role: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname?.startsWith(href));

  const links = (
    <nav aria-label="Admin" className="grid gap-0.5">
      {nav.map((item) => {
        const Icon = ICONS[item.icon];
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
              active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="grid gap-2 border-t border-sidebar-border pt-4">
      <div className="px-3">
        <p className="truncate text-sm font-medium">{admin.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {admin.email} · <span className="capitalize">{admin.role}</span>
        </p>
      </div>
      <Link href="/" target="_blank" className="flex h-9 items-center gap-2 rounded-lg px-3 text-sm text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground">
        <ExternalLink className="size-4" aria-hidden /> View site
      </Link>
      <form action={logoutAction}>
        <button type="submit" className="flex h-9 w-full items-center gap-2 rounded-lg px-3 text-sm text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground">
          <LogOut className="size-4" aria-hidden /> Sign out
        </button>
      </form>
      <form action={logoutEverywhereAction}>
        <button type="submit" className="flex h-8 w-full items-center rounded-lg px-3 text-xs text-muted-foreground hover:text-foreground">
          Sign out on all devices
        </button>
      </form>
    </div>
  );

  return (
    <div className="flex min-h-dvh bg-background">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col gap-6 border-r border-sidebar-border bg-sidebar p-4 lg:flex">
        <Link href="/admin" className="flex items-center gap-2.5 px-2 pt-1">
          <LogoMark className="size-7" />
          <span className="font-semibold">Admin</span>
        </Link>
        <div className="flex-1 overflow-y-auto">{links}</div>
        {footer}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur lg:px-8">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="inline-flex size-10 items-center justify-center rounded-lg hover:bg-muted lg:hidden" aria-label="Open admin menu">
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 gap-6 bg-sidebar p-4">
              <SheetTitle className="flex items-center gap-2.5 px-2 pt-1">
                <LogoMark className="size-7" /> Admin
              </SheetTitle>
              <div className="flex-1 overflow-y-auto">{links}</div>
              {footer}
            </SheetContent>
          </Sheet>
          <p className="text-sm font-medium text-muted-foreground lg:hidden">Admin</p>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>
        <main id="main" className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
