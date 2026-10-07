import { describe, expect, it } from "vitest";
import { buildMessage, buildWaMeUrl } from "@/lib/whatsapp/templates";
import { resolveNumberType } from "@/lib/whatsapp/resolve";
import { buildWaHref } from "@/lib/whatsapp/link";
import type { WhatsAppNumberType } from "@/lib/whatsapp/types";

const none = (): Record<WhatsAppNumberType, string | undefined> => ({
  default: undefined,
  sales: undefined,
  ai: undefined,
  web: undefined,
  ecommerce: undefined,
  support: undefined,
  custom: undefined,
});

describe("buildMessage", () => {
  it("builds the project template with degree", () => {
    expect(buildMessage("project", { projectName: "Student Portal", degreeName: "BCA" })).toBe(
      "Hi, I am interested in the Student Portal project. I am a BCA student. Please share the project details, pricing and customization options.",
    );
  });
  it("builds the AI template", () => {
    expect(buildMessage("ai_project", { projectName: "AI Resume Analyzer" })).toBe("Hi, I am interested in your AI-integrated project AI Resume Analyzer. Please share the details.");
  });
  it("builds the custom template with degree and requirements", () => {
    expect(buildMessage("custom", { degreeName: "MCA", requirements: "Chatbot with RAG" })).toBe(
      "Hi, I want to discuss a custom final-year project. My degree is MCA and my requirements are: Chatbot with RAG.",
    );
    expect(buildMessage("custom")).toBe("Hi, I want to discuss a custom final-year project.");
  });
  it("falls back to the general enquiry", () => {
    expect(buildMessage("general")).toBe("Hi, I want to know more about your final-year projects.");
    expect(buildMessage("project")).toBe("Hi, I want to know more about your final-year projects.");
  });
  it("strips newlines and caps length", () => {
    const msg = buildMessage("custom", { requirements: `line1\nline2${"x".repeat(2000)}` });
    expect(msg).not.toContain("\n");
    expect(msg.length).toBeLessThan(700);
  });
  it("URL-encodes the wa.me link", () => {
    expect(buildWaMeUrl("919999999999", "Hi & hello? #1")).toBe("https://wa.me/919999999999?text=Hi%20%26%20hello%3F%20%231");
  });
});

describe("resolveNumberType", () => {
  it("routes by category and falls back to sales, then default", () => {
    const n = { ...none(), default: "1", sales: "2", ai: "3" };
    expect(resolveNumberType({ intent: "project", categoryRoute: "ai" }, n)).toEqual({ numberType: "ai", number: "3" });
    expect(resolveNumberType({ intent: "project", categoryRoute: "web" }, n)).toEqual({ numberType: "sales", number: "2" });
    expect(resolveNumberType({ intent: "general" }, { ...none(), default: "1" })).toEqual({ numberType: "default", number: "1" });
  });
  it("uses support / custom numbers for those intents", () => {
    const n = { ...none(), default: "1", support: "9", custom: "8" };
    expect(resolveNumberType({ intent: "support" }, n)?.numberType).toBe("support");
    expect(resolveNumberType({ intent: "custom" }, n)?.numberType).toBe("custom");
  });
  it("returns null when nothing is configured", () => {
    expect(resolveNumberType({ intent: "general" }, none())).toBeNull();
  });
});

describe("buildWaHref", () => {
  it("never contains a phone number and encodes context", () => {
    const href = buildWaHref({ intent: "project", cta: "project_card", project: "ai-resume-analyzer", degree: "bca", source: "/projects/bca" });
    expect(href.startsWith("/api/wa?")).toBe(true);
    const sp = new URLSearchParams(href.split("?")[1]);
    expect(sp.get("p")).toBe("ai-resume-analyzer");
    expect(sp.get("c")).toBe("project_card");
    expect(sp.get("s")).toBe("/projects/bca");
  });
});
