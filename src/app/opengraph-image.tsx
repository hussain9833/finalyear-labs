import { OG_SIZE, renderOgCard } from "@/lib/seo/og";

export const alt = "Final-year projects for BCA, MCA, BSc IT, MSc IT, B.Tech and M.Tech";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgCard({
    eyebrow: "BCA · MCA · BSc IT · MSc IT · B.Tech · M.Tech",
    title: "Your Final-Year Project Starts Here.",
    subtitle: "Web, AI & E-Commerce projects with source code, demos, documentation and support.",
  });
}
