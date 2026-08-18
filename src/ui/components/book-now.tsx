"use client";

import { generateEventId, sendServerEvent } from "@/lib/tiktok-client";

// El parámetro ga4t le dice a FareHarbor a qué propiedad GA4 atribuir la reserva. Estaba
// hardcodeado con G-KJV962ZQ3V, una propiedad distinta de la que mide el sitio, así que las
// sesiones iban a una y las reservas a otra. Ahora sale de NEXT_PUBLIC_GA_ID, la misma
// variable que carga gtag en layout.tsx: no pueden volver a separarse.
//
// Sin la variable definida se omite ga4t por completo, en vez de mandar "undefined" y que
// FareHarbor no pueda parsearlo.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GA4_TRACKING = GA_ID
  ? `ga4t=${GA_ID},1083513053.1749557566__1758810037;AW-16551382136,undefined__undefined;&`
  : "";

const FAREHARBOR_BOOK_URL =
  `https://fareharbor.com/embeds/book/sherpafoodtours_argentina/?flow=1413860&${GA4_TRACKING}language=en-us&full-items=yes&back=https://www.sherpafoodtours.com/&g4=yes`;

/**
 * Fuerza el ga4t de cualquier URL de FareHarbor a la propiedad con la que mide el sitio.
 *
 * Arreglar el literal de este archivo no alcanzaba: la URL está copiada en al menos un
 * lugar más — NEXT_PUBLIC_DEFAULT_FAREHARBOR_LINK, que el navbar pasa como `link` y que
 * por lo tanto le gana a FAREHARBOR_BOOK_URL — y además cada tour y cada ciudad pueden
 * traer la suya desde ACF. Cualquiera de esas copias puede quedar con una propiedad vieja
 * y mandar las reservas a otro lado sin que se note, porque el botón arma la URL recién
 * en el click y nunca aparece en el DOM.
 *
 * Se reemplaza solo el measurement id; el clientId y el sessionId que vienen detrás, y el
 * resto de la URL, quedan byte a byte como estaban.
 */
function withSiteGa4Property(url: string): string {
  if (!GA_ID) return url;
  return url.replace(/([?&]ga4t=)G-[A-Z0-9]+/i, `$1${GA_ID}`);
}

export default function BookNowButton({ link, data_tour }: { link?: string; data_tour?: string }) {
  const href = withSiteGa4Property(link || FAREHARBOR_BOOK_URL);

  return (
    <button
      className="book-now-button cursor-pointer"
      type="button"
      data-fareharbor-lightframe={data_tour}
      onClick={(e) => {
        e.preventDefault();
        const eventId = generateEventId();
        if (typeof window.rdt === "function") {
          window.rdt("track", "AddToCart");
        }
        if (typeof window.ttq?.track === "function") {
          window.ttq.track("AddToCart", { event_id: eventId });
        }
        sendServerEvent("AddToCart", eventId, {
          content_type: "product",
          content_id: data_tour || "general",
        });
        const tempAnchor = document.createElement("a");
        tempAnchor.href = href;
        if (data_tour) {
          tempAnchor.setAttribute("data-fareharbor-lightframe", data_tour);
        }
        tempAnchor.style.display = "none";
        document.body.appendChild(tempAnchor);
        tempAnchor.click();
        tempAnchor.remove();
      }}
    >
      Book Now
    </button>
  );
}
