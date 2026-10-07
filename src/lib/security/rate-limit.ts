import "server-only";
import { connectDB, isDatabaseConfigured } from "@/lib/db/connect";
import { RateLimit } from "@/lib/db/models";
import { hashIdentifier } from "./request";

export const LIMITS = {
  login: { limit: 5, windowSec: 15 * 60 },
  loginEmail: { limit: 10, windowSec: 15 * 60 },
  custom_request: { limit: 5, windowSec: 60 * 60 },
  contact: { limit: 5, windowSec: 60 * 60 },
  events: { limit: 120, windowSec: 60 },
  wa: { limit: 30, windowSec: 60 },
  search: { limit: 60, windowSec: 60 },
} as const;

export type Bucket = keyof typeof LIMITS;

/**
 * Fixed-window limiter stored in MongoDB (TTL-expired), so it is correct across serverless instances.
 * Fails open if the database is unavailable — availability of public pages matters more than strict limiting.
 */
export async function rateLimit(bucket: Bucket, identifier: string): Promise<{ ok: boolean; remaining: number }> {
  const { limit, windowSec } = LIMITS[bucket];
  if (!isDatabaseConfigured()) return { ok: true, remaining: limit };
  const windowStart = Math.floor(Date.now() / 1000 / windowSec) * windowSec;
  const key = `${bucket}:${hashIdentifier(identifier)}:${windowStart}`;
  try {
    await connectDB();
    const doc = await RateLimit.findOneAndUpdate(
      { key },
      { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((windowStart + windowSec) * 1000) } },
      { upsert: true, returnDocument: "after", lean: true },
    );
    const count = doc?.count ?? 1;
    return { ok: count <= limit, remaining: Math.max(0, limit - count) };
  } catch (error) {
    console.error("[rate-limit] failed open", error);
    return { ok: true, remaining: limit };
  }
}
