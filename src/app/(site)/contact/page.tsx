import Link from "next/link";
import { FileText, Mail, MessageCircle } from "lucide-react";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { WhatsAppButton } from "@/components/whatsapp/whatsapp-button";

export const metadata = buildMetadata({
  title: "Contact Us",
  description: `Contact ${siteConfig.name} on WhatsApp or email about final-year projects, pricing, customization or support.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="container-page py-8 md:py-12">
      <Breadcrumbs items={[{ name: "Contact", path: "/contact" }]} />
      <header className="mt-6 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">Contact us</h1>
        <p className="mt-4 text-lg text-muted-foreground">The fastest way to reach us is WhatsApp. Pick what you need help with.</p>
      </header>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <ContactCard icon={MessageCircle} title="Project enquiry" body="Questions about a project, pricing or what's included.">
          <WhatsAppButton intent="general" cta="contact_page">
            Chat on WhatsApp
          </WhatsAppButton>
        </ContactCard>
        <ContactCard icon={FileText} title="Custom project" body="Share your synopsis or requirements and get a plan and quote.">
          <Link href="/custom-project" className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground">
            Request a custom project
          </Link>
        </ContactCard>
        <ContactCard icon={Mail} title="Support" body="Already have a project and need help setting it up?">
          <WhatsAppButton intent="support" cta="contact_page" variant="outline">
            Get support
          </WhatsAppButton>
          {siteConfig.contactEmail && (
            <a href={`mailto:${siteConfig.contactEmail}`} className="mt-3 block text-sm font-medium text-primary hover:underline">
              {siteConfig.contactEmail}
            </a>
          )}
        </ContactCard>
      </div>
      {!siteConfig.whatsappEnabled && (
        <p className="mt-8 rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          WhatsApp chat is temporarily unavailable. Please use the custom project form{siteConfig.contactEmail ? " or email us" : ""}.
        </p>
      )}
    </div>
  );
}

function ContactCard({ icon: Icon, title, body, children }: { icon: typeof Mail; title: string; body: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col rounded-2xl border border-border bg-card p-6">
      <Icon className="size-6 text-primary" aria-hidden />
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      <p className="mt-1 mb-6 flex-1 text-sm text-muted-foreground">{body}</p>
      <div>{children}</div>
    </section>
  );
}
