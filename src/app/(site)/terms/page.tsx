import { buildMetadata } from "@/lib/seo/metadata";
import { TERMS, LEGAL_UPDATED } from "@/lib/legal";
import { ProsePage } from "@/components/marketing/prose-page";

export const metadata = buildMetadata({
  title: "Terms of Service",
  description: "Terms covering projects, customization, support, documentation templates, licensing and academic responsibility.",
  path: "/terms",
});

export default function Page() {
  return <ProsePage title="Terms of Service" path="/terms" intro="The terms that apply to using our website and our projects, customization and support." updated={LEGAL_UPDATED} blocks={TERMS} />;
}
