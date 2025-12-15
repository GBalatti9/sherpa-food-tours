"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    Cookiebot?: {
      consent?: {
        statistics?: boolean;
        marketing?: boolean;
      };
    };
  }
}

export default function MarketingScripts() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // --------------------------------------------------
  // GA4 – Track pageviews SOLO si hay consentimiento
  // --------------------------------------------------
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !window.gtag ||
      !window.Cookiebot?.consent?.statistics
    ) {
      return;
    }

    const url =
      pathname + (searchParams.toString() ? `?${searchParams}` : "");

    window.gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    });
  }, [pathname, searchParams]);

  return (
    <>
      {/* --------------------------------------------
          Facebook Pixel (MARKETING) – Bloqueado
         -------------------------------------------- */}
      <Script
        id="facebook-pixel"
        type="text/plain"
        data-cookieconsent="marketing"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL}');
            fbq('track', 'PageView');
          `,
        }}
      />
    </>
  );
}
