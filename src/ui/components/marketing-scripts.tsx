"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Cookiebot?: {
      consent?: {
        preferences?: boolean;
        statistics?: boolean;
        marketing?: boolean;
      };
    };
    rdt?: (...args: unknown[]) => void;
    ttq?: {
      page: (...args: unknown[]) => void;
      track: (...args: unknown[]) => void;
      [key: string]: unknown;
    };
  }
}

function isContentPage(path: string): boolean {
  return (
    path.startsWith("/tour/") ||
    (path.startsWith("/travel-guide/") &&
      path.split("/").filter(Boolean).length >= 3)
  );
}

export default function MarketingScripts() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasMounted = useRef(false);

  // Consent Mode maneja el nivel de recoleccion; nosotros solo informamos los cambios de ruta.
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (typeof window === "undefined") return;

    const url =
      pathname + (searchParams.toString() ? `?${searchParams}` : "");

    if (window.gtag) {
      window.gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
        page_path: url,
      });
    }

    // Reddit Pixel – SPA navigation tracking
    if (typeof window.rdt === "function") {
      window.rdt("track", "PageVisit");
      if (isContentPage(pathname)) {
        window.rdt("track", "ViewContent");
      }
    }

    // TikTok Pixel – SPA navigation tracking
    if (typeof window.ttq?.page === "function") {
      window.ttq.page();
      if (isContentPage(pathname)) {
        window.ttq.track("ViewContent");
      }
    }
  }, [pathname, searchParams]);

  // Marketing Pixels – ViewContent en primera carga (PageVisit ya lo hace cada base code)
  useEffect(() => {
    const timer = setTimeout(() => {
      const path = window.location.pathname;
      if (isContentPage(path)) {
        if (typeof window.rdt === "function") {
          window.rdt("track", "ViewContent");
        }
        if (typeof window.ttq?.track === "function") {
          window.ttq.track("ViewContent");
        }
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

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

      {/* --------------------------------------------
          Reddit Pixel (MARKETING) – Bloqueado
         -------------------------------------------- */}
      <Script
        id="reddit-pixel"
        type="text/plain"
        data-cookieconsent="marketing"
        dangerouslySetInnerHTML={{
          __html: `
            !function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?
            p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};
            p.callQueue=[];var t=d.createElement("script");
            t.src="https://www.redditstatic.com/ads/pixel.js";t.async=!0;
            var s=d.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(t,s)}}(window,document);
            rdt('init','${process.env.NEXT_PUBLIC_REDDIT_PIXEL_ID}');
            rdt('track','PageVisit');
          `,
        }}
      />

      {/* --------------------------------------------
          TikTok Pixel (MARKETING) – Bloqueado
         -------------------------------------------- */}
      <Script
        id="tiktok-pixel"
        type="text/plain"
        data-cookieconsent="marketing"
        dangerouslySetInnerHTML={{
          __html: `
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
              var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
              ttq.load('${process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID}');
              ttq.page();
            }(window, document, 'ttq');
          `,
        }}
      />
    </>
  );
}
