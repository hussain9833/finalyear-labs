import { describe, expect, it } from "vitest";
import { buildMetadata, projectTitle, TITLE_MAX } from "@/lib/seo/metadata";
import { faqJsonLd, projectJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { decodeAttribution, encodeAttribution, referrerHost, trafficSource, utmFromSearchParams } from "@/lib/analytics/attribution";
import { deviceFromUA, isBot } from "@/lib/analytics/device";
import { parseEvent } from "@/lib/analytics/events";
import { customRequestSchema } from "@/lib/validation/public";
import { projectInputSchema, safeUrl } from "@/lib/validation/admin";
import { can } from "@/lib/auth/rbac";
import type { ProjectDetail } from "@/lib/types";
import { projects } from "./fixtures";

describe("SEO metadata", () => {
  it("builds degree-aware project titles within the length budget", () => {
    expect(projectTitle({ name: "AI Resume Analyzer", degrees: [{ slug: "bca", name: "BCA" }] })).toBe("AI Resume Analyzer Project for BCA | Final Year Project");
    const long = projectTitle({ name: "Extremely Long Hospital Appointment Booking Platform", degrees: [{ slug: "bca", name: "BCA" }, { slug: "mca", name: "MCA" }] });
    expect(long.length).toBeLessThanOrEqual(TITLE_MAX);
  });
  it("sets canonical, OG and robots", () => {
    const m = buildMetadata({ title: "X", description: "Y".repeat(400), path: "/projects/x", noindex: true });
    expect(String(m.alternates?.canonical)).toMatch(/\/projects\/x$/);
    expect((m.description ?? "").length).toBeLessThanOrEqual(160);
    expect(m.robots).toMatchObject({ index: false, follow: true });
  });
});

describe("JSON-LD", () => {
  const detail = { ...projects[0]!, description: "", features: [], modules: [], howItWorks: [], whatYouGet: [], documentation: { included: true, items: [] }, customization: { available: true, options: [] }, faqs: [], screenshots: [], seo: {} } as ProjectDetail;
  it("never emits ratings without real testimonials", () => {
    expect(projectJsonLd(detail, [])).not.toHaveProperty("aggregateRating");
    expect(projectJsonLd(detail, [{ id: "1", name: "A", quote: "Great", rating: 5 }])).toHaveProperty("aggregateRating");
  });
  it("omits FAQPage when there are no FAQs and escapes script breakouts", () => {
    expect(faqJsonLd([])).toBeNull();
    expect(serializeJsonLd({ x: "</script><script>alert(1)</script>" })).not.toContain("</script>");
  });
});

describe("attribution", () => {
  it("captures and sanitises UTM params", () => {
    const utm = utmFromSearchParams(new URLSearchParams("utm_source=Instagram&utm_campaign=bca_projects<script>&x=1"));
    expect(utm).toEqual({ s: "instagram", c: "bca_projectsscript" });
    expect(utmFromSearchParams(new URLSearchParams("a=1"))).toBeNull();
  });
  it("round-trips the cookie and survives garbage", () => {
    expect(decodeAttribution(encodeAttribution({ s: "google", c: "x", ts: 1 }))).toEqual({ s: "google", c: "x", ts: 1 });
    expect(decodeAttribution("%%%not-json")).toEqual({});
  });
  it("classifies referrers", () => {
    expect(referrerHost("https://www.google.com/search?q=x", "example.com")).toBe("google.com");
    expect(referrerHost("https://example.com/page", "example.com")).toBeUndefined();
    expect(trafficSource({ ref: "l.instagram.com" })).toBe("instagram");
    expect(trafficSource({})).toBe("direct");
  });
  it("detects devices and bots", () => {
    expect(deviceFromUA("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)")).toBe("mobile");
    expect(deviceFromUA("Mozilla/5.0 (iPad; CPU OS 17_0)")).toBe("tablet");
    expect(deviceFromUA("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")).toBe("desktop");
    expect(isBot("Mozilla/5.0 (compatible; Googlebot/2.1)")).toBe(true);
    expect(isBot("Mozilla/5.0 (Linux; Android 14; Pixel 8) Mobile")).toBe(false);
  });
});

describe("validation", () => {
  it("accepts only schema-valid analytics events", () => {
    expect(parseEvent({ name: "project_view", props: { projectSlug: "ai-resume-analyzer" } })).not.toBeNull();
    expect(parseEvent({ name: "project_view", props: { projectSlug: "<x>" } })).toBeNull();
    expect(parseEvent({ name: "drop_tables", props: {} })).toBeNull();
  });
  it("validates the custom request form", () => {
    const ok = customRequestSchema.safeParse({ name: "Asha", email: "asha@example.com", phone: "+91 98765 43210", features: "Login, dashboard and reports", consent: "on" });
    expect(ok.success).toBe(true);
    if (ok.success) expect(ok.data.phone).toBe("+919876543210");
    expect(customRequestSchema.safeParse({ name: "A", email: "bad", phone: "1", features: "x" }).success).toBe(false);
  });
  it("rejects unsafe URLs in the CMS", () => {
    expect(safeUrl.safeParse("javascript:alert(1)").success).toBe(false);
    expect(safeUrl.safeParse("http://insecure.example").success).toBe(false);
    expect(safeUrl.safeParse("https://demo.example.com").success).toBe(true);
    expect(projectInputSchema.shape.slug.safeParse("Bad Slug!").success).toBe(false);
  });
});

describe("RBAC", () => {
  it("enforces role ranks", () => {
    expect(can("viewer", "analytics.view")).toBe(true);
    expect(can("viewer", "leads.edit")).toBe(false);
    expect(can("editor", "catalog.edit")).toBe(true);
    expect(can("editor", "catalog.publish")).toBe(false);
    expect(can("admin", "catalog.delete")).toBe(false);
    expect(can("owner", "users.manage")).toBe(true);
  });
});
