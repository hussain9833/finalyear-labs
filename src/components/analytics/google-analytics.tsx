import Script from "next/script";
import { siteConfig } from "@/lib/site";

/** Loads GA4 only when a measurement ID is configured. Events go through lib/analytics/client.ts. */
export function GoogleAnalytics() {
  const id = siteConfig.gaMeasurementId;
  if (!id || !/^G-[A-Z0-9]+$/.test(id)) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${id}',{anonymize_ip:true});`}
      </Script>
    </>
  );
}
