import { buildMetadata } from "@/lib/seo/metadata";
import { ABOUT } from "@/lib/legal";
import { siteConfig } from "@/lib/site";
import { ProsePage } from "@/components/marketing/prose-page";
import { CtaBand } from "@/components/marketing/content-sections";

export const metadata = buildMetadata({
  title: "About Us",
  description: `${siteConfig.name} helps BCA, MCA, BSc IT, MSc IT, B.Tech and M.Tech students find, understand and customize final-year projects — with code, explanations, documentation resources and support.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <ProsePage title={`About ${siteConfig.name}`} path="/about" intro={siteConfig.tagline} blocks={ABOUT}>
      <CtaBand />
    </ProsePage>
  );
}
