import { wp } from "./wp";

export const ORGANIZATION_ID = "https://www.sherpafoodtours.com/#organization";
export const WEBSITE_ID = "https://www.sherpafoodtours.com/#website";

/**
 * URL del listing principal de Sherpa Food Tours en TripAdvisor.
 * Solo se usa como fallback: el valor real se edita en la embed section "footer" de WP.
 */
export const TRIPADVISOR_URL = "https://www.tripadvisor.com/Attraction_Review-g312741-d19212033-Reviews-Sherpa_Food_Tours-Buenos_Aires_Capital_Federal_District.html";

export function getBaseUrl(): string {
    return (process.env.NEXT_PUBLIC_BASE_URL || "https://www.sherpafoodtours.com").replace(/\/$/, "");
}

export interface OrganizationData {
    description: string;
    email: string;
    award: string;
    sameAs: string[];
}

/**
 * Perfiles sociales de la marca. La clave es el campo ACF de la embed section "footer";
 * el valor es el fallback que se usa mientras ese campo esté vacío o no exista en WP.
 */
const SOCIAL_PROFILES: Record<string, string> = {
    facebook: "https://www.facebook.com/sherpafoodtours",
    instagram: "https://www.instagram.com/sherpafoodtours",
    tiktok: "https://www.tiktok.com/@sherpafoodtours",
    tripadvisor: TRIPADVISOR_URL,
    linkedin: "https://www.linkedin.com/company/sherpafoodtours",
};

const ORGANIZATION_FALLBACK = {
    description: "Authentic food tours and culinary experiences around the world with local guides",
    email: "info@sherpafoodtours.com",
    // Grafía del documento de referencia de la agencia ("Travelers'", no "Travellers'").
    award: "2026 Tripadvisor Travelers' Choice Award - Food & Drink",
};

/**
 * Lee los datos de identidad de la marca desde la embed section "footer" de WordPress,
 * la misma que ya alimenta los links sociales del footer. El merge es campo por campo:
 * un campo vacío o inexistente en WP cae a su valor por defecto, para no perder perfiles
 * del sameAs mientras la carga en WP esté incompleta.
 */
export async function getOrganizationData(): Promise<OrganizationData> {
    const section = await wp.getEmbedSectionInfo("footer");
    const acf = (section?.acf ?? {}) as Record<string, string | undefined>;

    return {
        description: acf.org_description?.trim() || ORGANIZATION_FALLBACK.description,
        email: acf.org_email?.trim() || ORGANIZATION_FALLBACK.email,
        award: acf.award?.trim() || ORGANIZATION_FALLBACK.award,
        sameAs: Object.entries(SOCIAL_PROFILES).map(
            ([field, fallback]) => acf[field]?.trim() || fallback
        ),
    };
}

/**
 * Nodo Organization canónico del sitio. Sin aggregateRating: Google no soporta
 * review markup a nivel negocio y lo reporta como "Invalid object type for field <parent_node>".
 */
export function buildOrganizationSchema(
    baseUrl: string,
    org: OrganizationData,
    extra: Record<string, unknown> = {}
) {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        "name": "Sherpa Food Tours",
        "alternateName": "Sherpa",
        "url": baseUrl + "/",
        "logo": {
            "@type": "ImageObject",
            "url": baseUrl + "/sherpa-green.webp",
            "contentUrl": baseUrl + "/sherpa-green.webp",
        },
        "image": baseUrl + "/sherpa-main-image.webp",
        "foundingDate": "2019",
        "description": org.description,
        "email": org.email,
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "GB",
        },
        "sameAs": org.sameAs,
        // Google valida las paginas de tour como Merchant listing porque el nodo del tour
        // es ["Product", "TouristTrip"], y ahi reclama hasMerchantReturnPolicy y
        // shippingDetails dentro de offers. Son campos de e-commerce fisico y las dos
        // alertas son no criticas: no bloquean el rich result ni las estrellas.
        //
        // La politica se declara aca y no en cada Offer porque es lo que pide la doc:
        // "we recommend you provide a global return policy for your business under
        // Organization markup instead". A nivel oferta se usa solo para pisar la global.
        //
        // Se declara con merchantReturnLink, que por si solo alcanza como propiedad
        // requerida, en vez de returnPolicyCategory + merchantReturnDays: merchantReturnDays
        // cuenta dias desde la entrega, y la regla real de Sherpa es 24 h antes de que
        // empiece la experiencia. No hay forma de decir eso con ese campo sin mentir, y la
        // pagina de terminos ya lo explica bien.
        //
        // shippingDetails queda sin declarar a proposito: no se envia nada. Poner un envio
        // de USD 0 cerraria la segunda alerta afirmandole a Google un envio inexistente.
        "hasMerchantReturnPolicy": {
            "@type": "MerchantReturnPolicy",
            "merchantReturnLink": baseUrl + "/terms-and-conditions/",
        },
        ...(org.award ? { "award": org.award } : {}),
        ...extra,
    };
}

/**
 * Normaliza los contadores de reseñas que vienen de ACF como texto libre.
 * En WP conviven formatos muy distintos para el mismo campo: "400", "+400", "100+",
 * "487 reviews", "5.341" (punto como separador de miles). `Number()` devuelve NaN en la
 * mitad de los casos y lee "5.341" como 5,341 decimal, así que se descarta todo lo que no
 * sea dígito antes de parsear. Devuelve 0 si no hay ningún dígito.
 */
export function parseReviewCount(value: unknown): number {
    const digits = String(value ?? "").replace(/\D/g, "");
    return digits ? parseInt(digits, 10) : 0;
}

export interface BreadcrumbItem {
    name: string;
    url: string;
}

/**
 * Convierte la URL absoluta de un crumb en una ruta relativa con una sola barra final.
 * El JSON-LD necesita la URL absoluta, pero el <Link> visible no: con href absoluto Next
 * trata el link como externo y cada click es un full page reload en vez de navegación
 * cliente. Normalizar la barra final de paso evita el `/tour/{slug}//` que ya apareció
 * cuando cada página armaba su URL a mano.
 */
export function toSitePath(url: string): string {
    const path = url.replace(/^https?:\/\/[^/]+/, "");
    const clean = `/${path.replace(/^\/+/, "").replace(/\/+$/, "")}`;
    return clean === "/" ? "/" : `${clean}/`;
}

/**
 * Construye el BreadcrumbList a partir del mismo array que consume el componente
 * <Breadcrumbs>, para que el marcado y lo que ve el usuario no puedan divergir.
 */
export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": item.name,
            "item": item.url,
        })),
    };
}
