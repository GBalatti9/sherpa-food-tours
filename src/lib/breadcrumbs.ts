// El trail de cada página se declara una sola vez y alimenta tanto el BreadcrumbList
// JSON-LD como el <Breadcrumbs> visible. Google pide que coincidan, y tenerlos como
// dos listas separadas es lo que hizo que divergieran: la hoja de los tours emitía
// `/tour/{slug}//` y el nivel de ciudad de los artículos apuntaba a una ruta inexistente.

const SITE_ORIGIN = "https://www.sherpafoodtours.com";

export type Crumb = {
    name: string;
    /** Ruta relativa con barra final, p. ej. "/city/amsterdam/". */
    href: string;
};

/** Resuelve una ruta relativa contra el dominio de producción, con una sola barra final. */
function absolute(href: string): string {
    const path = `/${href.replace(/^\/+/, "").replace(/\/+$/, "")}`;
    return `${SITE_ORIGIN}${path === "/" ? "/" : `${path}/`}`;
}

/** BreadcrumbList de schema.org a partir del mismo trail que se renderiza. */
export function breadcrumbListSchema(crumbs: Crumb[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": crumbs.map((crumb, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": crumb.name,
            "item": absolute(crumb.href),
        })),
    };
}
