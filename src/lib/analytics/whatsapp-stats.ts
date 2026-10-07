import "server-only";
import type { PipelineStage } from "mongoose";
import { z } from "zod";
import { connectDB } from "@/lib/db/connect";
import { WhatsAppEvent } from "@/lib/db/models";
import { env } from "@/lib/env";
import { DEVICE_TYPES } from "@/lib/constants";
import { CTA_LOCATIONS, WHATSAPP_NUMBER_TYPES } from "@/lib/whatsapp/types";

const slug = z.string().trim().max(120).regex(/^[a-z0-9-]+$/).optional().catch(undefined);
const token = z.string().trim().max(150).regex(/^[a-z0-9 _.\-+/()]+$/i).optional().catch(undefined);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().catch(undefined);

export const statsFilterSchema = z.object({
  from: date,
  to: date,
  project: slug,
  category: slug,
  degree: slug,
  number: z.enum(WHATSAPP_NUMBER_TYPES).optional().catch(undefined),
  cta: z.enum(CTA_LOCATIONS).optional().catch(undefined),
  device: z.enum(DEVICE_TYPES).optional().catch(undefined),
  source: token,
  campaign: token,
});
export type StatsFilter = z.infer<typeof statsFilterSchema>;

export type Bucket = { key: string; count: number };
export type WhatsAppStats = {
  total: number;
  today: number;
  week: number;
  month: number;
  byProject: (Bucket & { name?: string })[];
  byCategory: Bucket[];
  byDegree: Bucket[];
  byNumber: Bucket[];
  byCta: Bucket[];
  byDevice: Bucket[];
  bySource: Bucket[];
  byCampaign: Bucket[];
  bySourcePage: Bucket[];
  daily: { date: string; count: number }[];
  range: { from: string; to: string };
};

/** Start of "today" in the analytics timezone (default Asia/Kolkata), as a UTC Date. */
function startOfDayInTz(d: Date, tz: string): Date {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
  const offset = tzOffsetMinutes(d, tz);
  return new Date(new Date(`${parts}T00:00:00Z`).getTime() - offset * 60_000);
}
function tzOffsetMinutes(d: Date, tz: string) {
  const local = new Date(d.toLocaleString("en-US", { timeZone: tz }));
  const utc = new Date(d.toLocaleString("en-US", { timeZone: "UTC" }));
  return Math.round((local.getTime() - utc.getTime()) / 60_000);
}
function dateInTz(dateStr: string, tz: string, endOfDay = false) {
  const base = new Date(`${dateStr}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}Z`);
  return new Date(base.getTime() - tzOffsetMinutes(base, tz) * 60_000);
}

const group = (field: string, limit = 10): PipelineStage.FacetPipelineStage[] => [
  { $group: { _id: { $ifNull: [`$${field}`, "(none)"] }, count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: limit },
];

export async function getWhatsAppStats(filter: StatsFilter): Promise<WhatsAppStats> {
  await connectDB();
  const tz = env().ANALYTICS_TZ;
  const now = new Date();
  const todayStart = startOfDayInTz(now, tz);
  const weekStart = new Date(todayStart.getTime() - 6 * 86_400_000);
  const monthStart = new Date(todayStart.getTime() - 29 * 86_400_000);

  const from = filter.from ? dateInTz(filter.from, tz) : monthStart;
  const to = filter.to ? dateInTz(filter.to, tz, true) : now;

  // Dimension filters (shared by range + KPI windows). Aggregation pipelines aren't touched by sanitizeFilter;
  // values are already validated by statsFilterSchema.
  const dims: Record<string, unknown> = {};
  if (filter.project) dims.projectSlug = filter.project;
  if (filter.category) dims.category = filter.category;
  if (filter.degree) dims.degree = filter.degree;
  if (filter.number) dims.whatsappNumberType = filter.number;
  if (filter.cta) dims.ctaLocation = filter.cta;
  if (filter.device) dims.deviceType = filter.device;
  if (filter.source) dims["utm.source"] = filter.source;
  if (filter.campaign) dims["utm.campaign"] = filter.campaign;

  const inRange: PipelineStage.FacetPipelineStage = { $match: { createdAt: { $gte: from, $lte: to } } };

  const [result] = await WhatsAppEvent.aggregate<Record<string, unknown[]>>([
    { $match: dims },
    {
      $facet: {
        kpis: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              today: { $sum: { $cond: [{ $gte: ["$createdAt", todayStart] }, 1, 0] } },
              week: { $sum: { $cond: [{ $gte: ["$createdAt", weekStart] }, 1, 0] } },
              month: { $sum: { $cond: [{ $gte: ["$createdAt", monthStart] }, 1, 0] } },
            },
          },
        ],
        ...Object.fromEntries(
          Object.entries({
            byProject: [
              { $match: { projectSlug: { $exists: true, $ne: null } } },
              { $group: { _id: "$projectSlug", name: { $last: "$projectName" }, count: { $sum: 1 } } },
              { $sort: { count: -1 } },
              { $limit: 10 },
            ],
            byCategory: group("category"),
            byDegree: group("degree"),
            byNumber: group("whatsappNumberType"),
            byCta: group("ctaLocation", 20),
            byDevice: group("deviceType"),
            bySource: [
              { $group: { _id: { $ifNull: ["$utm.source", { $ifNull: ["$referrer", "direct"] }] }, count: { $sum: 1 } } },
              { $sort: { count: -1 } },
              { $limit: 10 },
            ],
            byCampaign: [{ $match: { "utm.campaign": { $exists: true, $ne: null } } }, ...group("utm.campaign")],
            bySourcePage: group("sourcePage"),
            daily: [
              { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: tz } }, count: { $sum: 1 } } },
              { $sort: { _id: 1 } },
            ],
          } as Record<string, PipelineStage.FacetPipelineStage[]>).map(([k, stages]) => [k, [inRange, ...stages]]),
        ),
      },
    },
  ]);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const kpis = (result?.kpis?.[0] ?? {}) as any;
  const ranged = (result ?? {}) as any;
  const buckets = (rows: any[] = []): Bucket[] => rows.map((r) => ({ key: String(r._id), count: r.count }));

  // Fill gaps in the daily series so charts are continuous.
  const dailyMap = new Map<string, number>((ranged.daily ?? []).map((r: any) => [r._id, r.count]));
  const daily: { date: string; count: number }[] = [];
  const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" });
  const days = Math.min(366, Math.ceil((to.getTime() - from.getTime()) / 86_400_000));
  for (let i = 0; i < days; i++) {
    const key = fmt.format(new Date(from.getTime() + i * 86_400_000 + 3_600_000));
    if (!daily.some((d) => d.date === key)) daily.push({ date: key, count: dailyMap.get(key) ?? 0 });
  }

  return {
    total: kpis.total ?? 0,
    today: kpis.today ?? 0,
    week: kpis.week ?? 0,
    month: kpis.month ?? 0,
    byProject: (ranged.byProject ?? []).map((r: any) => ({ key: r._id, name: r.name, count: r.count })),
    byCategory: buckets(ranged.byCategory),
    byDegree: buckets(ranged.byDegree),
    byNumber: buckets(ranged.byNumber),
    byCta: buckets(ranged.byCta),
    byDevice: buckets(ranged.byDevice),
    bySource: buckets(ranged.bySource),
    byCampaign: buckets(ranged.byCampaign),
    bySourcePage: buckets(ranged.bySourcePage),
    daily,
    range: { from: fmt.format(from), to: fmt.format(to) },
  };
}
