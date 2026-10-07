import Link from "next/link";
import { requireAdminPage } from "@/lib/auth/dal";
import { getWhatsAppStats, statsFilterSchema } from "@/lib/analytics/whatsapp-stats";
import { getCatalog } from "@/lib/data/catalog";
import { DEVICE_TYPES } from "@/lib/constants";
import { CTA_LOCATIONS, CTA_LOCATION_LABEL, WHATSAPP_NUMBER_LABEL, WHATSAPP_NUMBER_TYPES, type CtaLocation, type WhatsAppNumberType } from "@/lib/whatsapp/types";
import { BarList, PageHeader, Panel, StatCard } from "@/components/admin/ui";
import { TrendChart } from "@/components/admin/trend-chart";
import { NativeSelect } from "@/components/forms/native-select";

export const metadata = { title: "WhatsApp analytics" };

export default async function AnalyticsPage({ searchParams }: PageProps<"/admin/analytics">) {
  await requireAdminPage("analytics.view");
  const sp = await searchParams;
  const filter = statsFilterSchema.parse(Object.fromEntries(Object.entries(sp).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])));
  const [stats, catalog] = await Promise.all([getWhatsAppStats(filter), getCatalog()]);

  const catName = new Map(catalog.categories.map((c) => [c.slug, c.name]));
  const degName = new Map(catalog.degrees.map((d) => [d.slug, d.name]));
  const link = (key: string, value: string) => {
    const next = new URLSearchParams(Object.entries(filter).filter(([, v]) => v) as [string, string][]);
    next.set(key, value);
    return `/admin/analytics?${next.toString()}`;
  };
  const active = Object.values(filter).some(Boolean);
  const mobile = stats.byDevice.find((d) => d.key === "mobile")?.count ?? 0;
  const deviceTotal = stats.byDevice.reduce((s, d) => s + d.count, 0);

  return (
    <>
      <PageHeader
        title="WhatsApp analytics"
        description="WhatsApp CTA clicks = lead intent, not sales. Track purchases in Leads."
      />

      <form method="get" className="mb-6 grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="grid gap-1.5">
          <label htmlFor="from" className="text-sm font-medium">From</label>
          <input id="from" type="date" name="from" defaultValue={filter.from ?? stats.range.from} className="h-12 rounded-xl border border-input bg-background px-3 text-sm" />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="to" className="text-sm font-medium">To</label>
          <input id="to" type="date" name="to" defaultValue={filter.to ?? stats.range.to} className="h-12 rounded-xl border border-input bg-background px-3 text-sm" />
        </div>
        <NativeSelect name="project" label="Project" placeholder="All projects" defaultValue={filter.project} options={catalog.projects.map((p) => ({ value: p.slug, label: p.name }))} />
        <NativeSelect name="category" label="Category" placeholder="All categories" defaultValue={filter.category} options={catalog.categories.map((c) => ({ value: c.slug, label: c.name }))} />
        <NativeSelect name="degree" label="Degree" placeholder="All degrees" defaultValue={filter.degree} options={catalog.degrees.map((d) => ({ value: d.slug, label: d.name }))} />
        <NativeSelect name="number" label="WhatsApp number" placeholder="All numbers" defaultValue={filter.number} options={WHATSAPP_NUMBER_TYPES.map((n) => ({ value: n, label: WHATSAPP_NUMBER_LABEL[n] }))} />
        <NativeSelect name="cta" label="CTA location" placeholder="All CTAs" defaultValue={filter.cta} options={CTA_LOCATIONS.map((c) => ({ value: c, label: CTA_LOCATION_LABEL[c] }))} />
        <NativeSelect name="device" label="Device" placeholder="All devices" defaultValue={filter.device} options={DEVICE_TYPES.map((d) => ({ value: d, label: d[0]!.toUpperCase() + d.slice(1) }))} />
        <div className="grid gap-1.5">
          <label htmlFor="source" className="text-sm font-medium">UTM source</label>
          <input id="source" name="source" defaultValue={filter.source} placeholder="e.g. instagram" className="h-12 rounded-xl border border-input bg-background px-3 text-sm" />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="campaign" className="text-sm font-medium">UTM campaign</label>
          <input id="campaign" name="campaign" defaultValue={filter.campaign} placeholder="e.g. bca_projects" className="h-12 rounded-xl border border-input bg-background px-3 text-sm" />
        </div>
        <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-5">
          <button type="submit" className="h-10 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground">Apply filters</button>
          {active && <Link href="/admin/analytics" className="inline-flex h-10 items-center rounded-xl border border-border px-4 text-sm font-medium hover:bg-muted">Reset</Link>}
        </div>
      </form>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Total clicks (all time)" value={stats.total.toLocaleString("en-IN")} />
        <StatCard label="Today" value={stats.today.toLocaleString("en-IN")} />
        <StatCard label="Last 7 days" value={stats.week.toLocaleString("en-IN")} />
        <StatCard label="Last 30 days" value={stats.month.toLocaleString("en-IN")} />
        <StatCard label="Mobile share" value={deviceTotal ? `${Math.round((mobile / deviceTotal) * 100)}%` : "—"} hint={`${stats.range.from} → ${stats.range.to}`} className="col-span-2 lg:col-span-1" />
      </div>

      <Panel title={`Daily clicks · ${stats.range.from} → ${stats.range.to}`} className="mt-6">
        <TrendChart data={stats.daily} />
      </Panel>

      <div className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <Panel title="Top projects">
          <BarList items={stats.byProject.map((b) => ({ label: b.name ?? b.key, value: b.count, href: link("project", b.key) }))} />
        </Panel>
        <Panel title="Top categories">
          <BarList items={stats.byCategory.map((b) => ({ label: catName.get(b.key) ?? b.key, value: b.count, href: b.key !== "(none)" ? link("category", b.key) : undefined }))} />
        </Panel>
        <Panel title="Top degrees">
          <BarList items={stats.byDegree.map((b) => ({ label: degName.get(b.key) ?? b.key, value: b.count, href: b.key !== "(none)" ? link("degree", b.key) : undefined }))} />
        </Panel>
        <Panel title="WhatsApp numbers">
          <BarList items={stats.byNumber.map((b) => ({ label: WHATSAPP_NUMBER_LABEL[b.key as WhatsAppNumberType] ?? b.key, value: b.count, href: link("number", b.key) }))} />
        </Panel>
        <Panel title="CTA locations">
          <BarList items={stats.byCta.map((b) => ({ label: CTA_LOCATION_LABEL[b.key as CtaLocation] ?? b.key, value: b.count, href: link("cta", b.key) }))} />
        </Panel>
        <Panel title="Devices">
          <BarList items={stats.byDevice.map((b) => ({ label: b.key, value: b.count, href: link("device", b.key) }))} />
        </Panel>
        <Panel title="Traffic sources">
          <BarList items={stats.bySource.map((b) => ({ label: b.key, value: b.count }))} />
        </Panel>
        <Panel title="UTM campaigns">
          <BarList items={stats.byCampaign.map((b) => ({ label: b.key, value: b.count, href: link("campaign", b.key) }))} emptyText="No campaign-tagged clicks yet" />
        </Panel>
        <Panel title="Source pages">
          <BarList items={stats.bySourcePage.map((b) => ({ label: b.key, value: b.count }))} />
        </Panel>
      </div>
    </>
  );
}
