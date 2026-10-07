import { buildMetadata } from "@/lib/seo/metadata";
import { REFUND, LEGAL_UPDATED } from "@/lib/legal";
import { ProsePage } from "@/components/marketing/prose-page";

export const metadata = buildMetadata({
  title: "Refund Policy",
  description: "Refund conditions for final-year projects, customization work and documentation resources.",
  path: "/refund-policy",
});

export default function Page() {
  return <ProsePage title="Refund Policy" path="/refund-policy" intro="When refunds are and aren't available for digital projects and custom work." updated={LEGAL_UPDATED} blocks={REFUND} />;
}
