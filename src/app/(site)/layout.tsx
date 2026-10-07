import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CompareTray } from "@/components/projects/compare-controls";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <CompareTray />
      <GoogleAnalytics />
    </div>
  );
}
