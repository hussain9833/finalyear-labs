import { buildMetadata } from "@/lib/seo/metadata";
import { PRIVACY, LEGAL_UPDATED } from "@/lib/legal";
import { ProsePage } from "@/components/marketing/prose-page";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How FinalYear Labs collects, uses and protects your information, including analytics, cookies and enquiry data.",
  path: "/privacy-policy",
});

export default function Page() {
  return <ProsePage title="Privacy Policy" path="/privacy-policy" intro="How we collect, use and protect information when you use our website." updated={LEGAL_UPDATED} blocks={PRIVACY} />;
}
