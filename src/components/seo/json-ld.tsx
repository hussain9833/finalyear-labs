import { serializeJsonLd } from "@/lib/seo/jsonld";

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] | null }) {
  if (!data) return null;
  // JSON-LD must be inline; serializeJsonLd escapes <, >, & so the payload can't break out of the script tag.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
