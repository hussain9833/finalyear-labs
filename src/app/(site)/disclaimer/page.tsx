import { buildMetadata } from "@/lib/seo/metadata";
import { DISCLAIMER, LEGAL_UPDATED } from "@/lib/legal";
import { ProsePage } from "@/components/marketing/prose-page";

export const metadata = buildMetadata({
  title: "Disclaimer",
  description: "Our projects and documentation templates are learning and customization resources; we do not guarantee academic outcomes.",
  path: "/disclaimer",
});

export default function Page() {
  return <ProsePage title="Disclaimer" path="/disclaimer" intro="Important information about how our projects and resources should be used." updated={LEGAL_UPDATED} blocks={DISCLAIMER} />;
}
