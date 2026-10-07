import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const OG_SIZE = { width: 1200, height: 630 };

/** Branded 1200×630 social card rendered with next/og. */
export function renderOgCard({ eyebrow, title, subtitle, chips = [] }: { eyebrow: string; title: string; subtitle?: string; chips?: string[] }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #0f1020 0%, #1b1840 55%, #10293a 100%)",
          color: "#f5f5fb",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, #5b4cf0, #22b8cf)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            FL
          </div>
          <div style={{ fontSize: 30, fontWeight: 600 }}>{siteConfig.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 28, color: "#a5b4fc", marginBottom: 16 }}>{eyebrow}</div>
          <div style={{ fontSize: title.length > 40 ? 62 : 74, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 30, color: "#c7c9e0", marginTop: 22, lineHeight: 1.3 }}>{subtitle}</div>}
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {chips.slice(0, 5).map((c) => (
            <div key={c} style={{ display: "flex", padding: "10px 20px", borderRadius: 999, background: "rgba(255,255,255,0.1)", fontSize: 24 }}>
              {c}
            </div>
          ))}
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
