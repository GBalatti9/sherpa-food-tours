#!/usr/bin/env node
/**
 * Verifica, contra el HTML realmente servido, que los tickets mergeados en main sigan
 * cumpliéndose todos a la vez. Cada rama se verificó por separado en su propia sesión;
 * lo que esto cubre es la regresión cruzada — que un ticket no deshaga a otro al juntarse.
 *
 * Uso:
 *   npm run build && npm start   (o npm run dev)
 *   node scripts/verify-merge.js
 *   BASE_URL=https://www.sherpafoodtours.com node scripts/verify-merge.js
 *
 * Sale con código 1 si falla algún chequeo, así sirve en CI.
 */

// El chequeo de GA4 compara contra NEXT_PUBLIC_GA_ID, que vive en .env y que Node no carga
// solo. Se lee acá para no depender de --env-file, que cambia de flag según la versión.
try {
    for (const line of require("fs").readFileSync(require("path").join(__dirname, "..", ".env"), "utf8").split("\n")) {
        const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line);
        if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
    }
} catch {
    // Sin .env el chequeo de GA4 avisa en vez de fallar.
}

const BASE = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const PROD_ORIGIN = "https://www.sherpafoodtours.com";
const WP_ORIGIN = "https://staging.sherpafoodtours.com";

// Una ruta por plantilla. Los slugs concretos salen del sitio real; si alguno se borra en
// WP, el chequeo lo reporta como 404 en vez de fallar en silencio.
const ROUTES = {
    home: "/",
    city: "/city/buenos-aires/",
    tour: "/tour/buenos-aires-local-foodie-experience/",
    travelGuide: "/travel-guide/",
    article: "/travel-guide/cartagena/food-in-cartagena-what-to-eat/",
    aboutUs: "/about-us/",
    contact: "/contact/",
    contacto: "/contacto/",
    terms: "/terms-and-conditions/",
};

// Las que deben mostrar migas de pan. /contacto/ queda afuera a propósito: es la variante
// española y no se incluyó en el ticket de breadcrumbs.
const BREADCRUMB_ROUTES = ["home", "city", "tour", "travelGuide", "article", "aboutUs", "contact", "terms"]
    .filter((k) => k !== "home"); // la home es la raíz del trail, no lleva breadcrumb propio

const colors = { reset: "\x1b[0m", green: "\x1b[32m", red: "\x1b[31m", yellow: "\x1b[33m", cyan: "\x1b[36m", dim: "\x1b[2m" };
const c = (color, s) => `${colors[color]}${s}${colors.reset}`;

const results = [];
const warnings = [];
let currentTicket = "";

function ticket(name) {
    currentTicket = name;
    console.log(`\n${c("cyan", name)}`);
}

function check(ok, description, detail = "") {
    results.push({ ticket: currentTicket, description, ok });
    const mark = ok ? c("green", "  ✓") : c("red", "  ✗");
    console.log(`${mark} ${description}${detail ? c("dim", `  ${detail}`) : ""}`);
}

/** Deuda conocida y aceptada: se reporta pero no rompe el suite. */
function warn(description, detail = "") {
    warnings.push({ ticket: currentTicket, description, detail });
    console.log(`${c("yellow", "  !")} ${description}${detail ? c("dim", `  ${detail}`) : ""}`);
}

/**
 * Atributos de URL del HTML renderizado. Excluye a propósito el payload RSC que Next
 * inyecta en <script>self.__next_f.push(...)</script>: ahí van las props serializadas de
 * los componentes, con las URLs crudas de WordPress. No son recursos que el browser pida
 * ni que Google indexe, así que buscar el dominio de staging en el documento entero da
 * cientos de falsos positivos.
 */
function renderedUrls(html) {
    const withoutFlight = html.replace(/<script[^>]*>self\.__next_f\.push[\s\S]*?<\/script>/g, "");
    return [...withoutFlight.matchAll(/\b(?:src|srcset|imageSrcSet|href|content)="([^"]*)"/g)].map((m) => m[1]);
}

/** Cuenta ocurrencias de un regex global. */
function count(html, regex) {
    return (html.match(regex) || []).length;
}

/** Todos los bloques JSON-LD parseados de una página. Un bloque roto se reporta como null. */
function jsonLd(html) {
    const blocks = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
    return blocks.map((m) => {
        try {
            return JSON.parse(m[1]);
        } catch {
            return null;
        }
    });
}

/** Aplana los @graph para poder buscar nodos por @type sin importar cómo estén anidados. */
function ldNodes(html) {
    return jsonLd(html).flatMap((block) => {
        if (!block) return [];
        return Array.isArray(block["@graph"]) ? block["@graph"] : [block];
    });
}

function hasType(node, type) {
    const t = node?.["@type"];
    return Array.isArray(t) ? t.includes(type) : t === type;
}

async function get(path) {
    const res = await fetch(BASE + path, { redirect: "manual" });
    const body = await res.text();
    return { status: res.status, headers: res.headers, body };
}

async function main() {
    console.log(c("cyan", `Verificando ${BASE}`));

    // Se bajan todas las rutas una sola vez; los chequeos leen de acá.
    const pages = {};
    for (const [key, path] of Object.entries(ROUTES)) {
        try {
            pages[key] = await get(path);
        } catch (err) {
            pages[key] = { status: 0, headers: new Headers(), body: "", error: String(err) };
        }
    }

    ticket("Rutas alcanzables (precondición de todo lo demás)");
    for (const [key, path] of Object.entries(ROUTES)) {
        check(pages[key].status === 200, `${path} → 200`, `status ${pages[key].status}${pages[key].error ? ` ${pages[key].error}` : ""}`);
    }

    // ---------------------------------------------------------------- robots.txt
    ticket("Robot txt best practices (GBalatti9/tickets)");
    const robots = await get("/robots.txt");
    check(robots.status === 200, "/robots.txt responde 200", `status ${robots.status}`);
    check(!/^host:/im.test(robots.body), "sin la directiva obsoleta Host:");
    check(/^sitemap:\s*https?:\/\//im.test(robots.body), "conserva la línea Sitemap:");
    check(count(robots.body, /^user-agent:/gim) >= 5, "conserva las reglas de user-agent", `${count(robots.body, /^user-agent:/gim)} encontradas`);
    for (const bot of ["GPTBot", "Google-Extended", "CCBot", "anthropic-ai"]) {
        check(robots.body.includes(bot), `la política de bots de IA sigue declarando ${bot}`);
    }

    // ------------------------------------------------- links internos relativos
    ticket("Links internos relativos (GBalatti9/tickets)");
    for (const [key, path] of Object.entries(ROUTES)) {
        const anchors = [...pages[key].body.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map((m) => m[1]);
        const absolute = anchors.filter((h) => h.startsWith(PROD_ORIGIN));

        // terms-and-conditions: los dos links son texto legal que muestra la dirección del
        // sitio como su propio anchor y abre en pestaña nueva. Quedan absolutos a propósito.
        if (key === "terms") {
            check(absolute.every((h) => h === PROD_ORIGIN || h === `${PROD_ORIGIN}/`),
                `${path} — los únicos <a> absolutos son los dos legales`, absolute.join(" "));
            continue;
        }

        // El artículo inyecta el cuerpo de WordPress con dangerouslySetInnerHTML. Los links
        // absolutos que quedan los escribió un editor en el CMS, no el código: son tarea de
        // contenido (ticket 7, Internal links + Anchor text) y no se pueden arreglar acá.
        if (key === "article") {
            if (absolute.length) warn(`${path} — ${absolute.length} <a> absolutos vienen del cuerpo en WP, no del código`, absolute.slice(0, 3).join(" "));
            else check(true, `${path} sin <a> al dominio absoluto`);
            continue;
        }

        check(absolute.length === 0, `${path} sin <a> al dominio absoluto`, absolute.slice(0, 3).join(" "));
    }

    // ------------------------------------------------------------- un H1 por página
    ticket("H1 único por página (GBalatti9/tickets)");
    for (const [key, path] of Object.entries(ROUTES)) {
        const n = count(pages[key].body, /<h1\b/gi);
        check(n === 1, `${path} tiene exactamente un <h1>`, `${n} encontrados`);
    }

    // ------------------------------------------------------------------ breadcrumbs
    ticket("Breadcrumbs visibles + BreadcrumbList (GBalatti9/features)");
    for (const key of BREADCRUMB_ROUTES) {
        const html = pages[key].body;
        const nav = /<nav[^>]*aria-label="Breadcrumb"[^>]*>([\s\S]*?)<\/nav>/.exec(html);
        check(Boolean(nav), `${ROUTES[key]} renderiza el <nav aria-label="Breadcrumb">`);
        if (!nav) continue;

        // El fix de merge: el <Link> visible va relativo. Con href absoluto Next lo trata
        // como externo y cada click es un full page reload.
        const hrefs = [...nav[1].matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
        const absolute = hrefs.filter((h) => /^https?:\/\//.test(h));
        check(absolute.length === 0, `${ROUTES[key]} — links del breadcrumb relativos`, absolute.join(" "));
        check(hrefs.every((h) => !h.includes("//", 1)), `${ROUTES[key]} — sin barra doble en los hrefs`, hrefs.join(" "));

        // El último crumb es la página actual y va como texto, no como link.
        check(/aria-current="page"/.test(nav[1]), `${ROUTES[key]} — el crumb actual lleva aria-current="page"`);

        const list = ldNodes(html).find((n) => hasType(n, "BreadcrumbList"));
        check(Boolean(list), `${ROUTES[key]} — emite BreadcrumbList en JSON-LD`);
        if (!list) continue;

        const items = list.itemListElement || [];
        // Google pide que el marcado y lo visible coincidan.
        check(items.length === hrefs.length + 1,
            `${ROUTES[key]} — el BreadcrumbList tiene los mismos niveles que lo visible`,
            `schema ${items.length} vs visible ${hrefs.length + 1}`);
        const bad = items.map((i) => i.item).filter((u) => typeof u === "string" && /[^:]\/\//.test(u.replace(/^https?:\/\//, "x")));
        check(bad.length === 0, `${ROUTES[key]} — sin barra doble en los item del schema`, bad.join(" "));
    }

    // -------------------------------------------------------------- structured data
    ticket("Google search console: structured data (GBalatti9/features)");
    const homeNodes = ldNodes(pages.home.body);
    const org = homeNodes.find((n) => hasType(n, "Organization"));
    check(Boolean(org), "la home emite Organization");
    check(!homeNodes.some((n) => hasType(n, "TourOperator") && n["@id"]?.includes("#organization")),
        "la home ya no declara TourOperator como la entidad #organization");
    check(!JSON.stringify(homeNodes).includes("aggregateRating"),
        "la home no cuelga aggregateRating de la Organization (era el error de Search Console)");
    check(Boolean(org?.award), "Organization declara award", org?.award || "");
    check(Array.isArray(org?.sameAs) && org.sameAs.length > 0, "Organization declara sameAs", `${org?.sameAs?.length ?? 0} perfiles`);
    check(!JSON.stringify(homeNodes).includes("d23715647"),
        "el sameAs apunta al listing principal de TripAdvisor, no al viejo d23715647");

    const tourNodes = ldNodes(pages.tour.body);
    const product = tourNodes.find((n) => hasType(n, "Product"));
    check(Boolean(product), "el tour emite Product");
    check(hasType(product, "TouristTrip"), "el tour conserva TouristTrip junto a Product");
    check(Boolean(product?.aggregateRating), "el aggregateRating cuelga del Product, que sí lo soporta");
    check(Boolean(product?.offers), "el tour emite offers (sin offers no es elegible para rich results)");

    // El reviewCount del schema tiene que coincidir con el número visible en la página:
    // Google descarta el marcado si declara un total que el usuario no puede ver.
    if (product?.aggregateRating?.reviewCount) {
        const reviewCount = String(product.aggregateRating.reviewCount);
        const visible = pages.tour.body.replace(/<[^>]*>/g, " ").replace(/[.,](?=\d{3}\b)/g, "");
        check(visible.includes(reviewCount),
            "el reviewCount del schema aparece visible en la página",
            `reviewCount ${reviewCount}`);
    }

    // ------------------------------------------------------------ imágenes indexables
    ticket("Multimedia Issues — imágenes indexables (GBalatti9/fix-wp-images-not-indexable)");
    for (const [key, path] of Object.entries(ROUTES)) {
        const html = pages[key].body;
        // Las URLs de staging responden x-robots-tag: noindex. Ninguna debe quedar en un
        // atributo que el browser pida o que Google lea.
        const staged = renderedUrls(html).filter((u) => u.includes(`${WP_ORIGIN}/wp-content`));
        check(staged.length === 0, `${path} sin URLs de imagen apuntando a staging`, staged.slice(0, 2).join(" "));

        // Y las que vienen de WP tienen que ir por el optimizador.
        const imgs = [...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map((m) => m[1]);
        const unoptimized = imgs.filter((s) => s.includes("/wp-content/uploads/") && !s.includes("/_next/image"));
        check(unoptimized.length === 0, `${path} — todas las imágenes de WP pasan por /_next/image`, unoptimized.slice(0, 2).join(" "));
    }

    // width/height explícitos: son el aspect-ratio que evita CLS. El único <img> que puede
    // no tenerlos es el que genera next/image con fill.
    for (const [key, path] of Object.entries(ROUTES)) {
        const tags = [...pages[key].body.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
        const missing = tags.filter((t) => !/\bwidth=/.test(t) || !/\bheight=/.test(t)).filter((t) => !/object-fit|position:\s*absolute/.test(t));
        check(missing.length === 0, `${path} — sin <img> sin width/height`, `${missing.length} sin dimensiones`);
    }

    // El JSON-LD tampoco puede declarar imágenes que Google no puede indexar.
    for (const [key, path] of Object.entries(ROUTES)) {
        const ld = JSON.stringify(jsonLd(pages[key].body));
        check(!ld.includes(`${WP_ORIGIN}/wp-content`), `${path} — el JSON-LD no declara imágenes de staging`);
    }

    // -------------------------------------------------------------------- sitemap
    ticket("Sitemap de imágenes (GBalatti9/fix-wp-images-not-indexable)");
    const sitemap = await get("/sitemap.xml");
    check(sitemap.status === 200, "/sitemap.xml responde 200", `status ${sitemap.status}`);
    check(sitemap.body.includes("xmlns:image"), "declara el namespace image:");
    check(count(sitemap.body, /<image:loc>/g) > 0, "incluye imágenes", `${count(sitemap.body, /<image:loc>/g)} <image:loc>`);
    check(!sitemap.body.includes(`${WP_ORIGIN}/wp-content`), "ninguna imagen del sitemap apunta a staging");
    // Next no escapa el & de las URLs del optimizador; sin escapar, el XML es inválido y
    // Google descarta el sitemap entero.
    const unescaped = sitemap.body.replace(/&(amp|lt|gt|quot|apos|#\d+);/g, "");
    check(!unescaped.includes("&"), "todos los & están escapados (XML bien formado)");

    // ------------------------------------------------------------------------- LCP
    ticket("Page speed — preload del LCP (GBalatti9/fix-lcp-preload)");
    const preloads = [...pages.home.body.matchAll(/<link[^>]*rel="preload"[^>]*>/g)].map((m) => m[0]);
    const imagePreloads = preloads.filter((p) => /as="image"/.test(p));

    // El preload viejo apuntaba a la URL cruda de WordPress: distinta de la que después
    // pedía el <img>, así que el browser bajaba la imagen dos veces y ninguna era el LCP.
    const stale = imagePreloads.filter((p) => p.includes("/wp-content/uploads/") && !p.includes("/_next/image"));
    check(stale.length === 0, "no queda el preload manual del hero apuntando a la URL cruda de WordPress", stale.join(" "));

    // El que sí tiene que estar es el que emite <Image priority>: con imageSrcSet, para que
    // el browser preload-ee exactamente el candidato que va a usar.
    const heroPreload = imagePreloads.filter((p) => /imageSrcSet=/i.test(p) && /fetchPriority="high"/i.test(p));
    check(heroPreload.length === 1, "el hero emite un único preload con imageSrcSet y fetchPriority=high", `${heroPreload.length} encontrados`);
    check(heroPreload.every((p) => p.includes("/_next/image")), "el preload del hero pasa por el optimizador");

    // React 19 convierte cada <img loading="eager"> en un preload. Los badges de reseñas
    // están arriba del fold, así que es defendible, pero compiten con el LCP por ancho de
    // banda: si el LCP se queda corto en PageSpeed, son los primeros candidatos a diferir.
    const eager = imagePreloads.length - heroPreload.length;
    if (eager > 0) warn(`${eager} preloads de imagen además del hero (los badges con loading="eager")`);

    // Las imágenes que no están en el primer viewport se difieren.
    const lazyCount = count(pages.home.body, /loading="lazy"/g);
    check(lazyCount > 0, "la home difiere imágenes fuera de pantalla", `${lazyCount} con loading="lazy"`);

    // --------------------------------------------------------------------- analytics
    ticket("Analytics tagging GA4/FareHarbor (GBalatti9/fix-ga4-fareharbor-client-ids)");
    // El botón arma la URL en el click, así que no aparece en el DOM: se verifica que la
    // propiedad vieja no esté hardcodeada en ningún bundle servido.
    // El botón arma la URL recién en el click, con un anchor temporal que nunca queda en el
    // DOM, así que desde el HTML no se puede leer la URL final. Lo que sí se puede verificar
    // es que el measurement id que el sitio usa esté definido, y qué copias viejas siguen
    // dando vueltas en los bundles.
    //
    // El chequeo de la URL final es de runtime y se hace en el browser, parcheando
    // HTMLAnchorElement.prototype.click para capturar el href sin dispararlo:
    //
    //   window.__c = [];
    //   HTMLAnchorElement.prototype.click = function () { window.__c.push(this.href) };
    //   document.querySelector("button.book-now-button").click();
    //
    const expected = process.env.NEXT_PUBLIC_GA_ID;
    check(Boolean(expected), "NEXT_PUBLIC_GA_ID está definido", expected || "");

    const bundles = [...pages.tour.body.matchAll(/<script[^>]*src="([^"]+)"/g)].map((m) => m[1]).filter((s) => s.startsWith("/_next/"));
    const found = new Set();
    for (const src of bundles.slice(0, 40)) {
        const js = await get(src);
        for (const m of js.body.matchAll(/ga4t=(G-[A-Z0-9]+)/g)) found.add(m[1]);
    }
    const staleIds = [...found].filter((id) => id !== expected);
    // No rompe el suite porque withSiteGa4Property() reescribe el measurement id en el click,
    // venga la URL de donde venga. Pero la copia vieja sigue existiendo y conviene limpiarla:
    // hoy vive en NEXT_PUBLIC_DEFAULT_FAREHARBOR_LINK, que además hay que corregir en el
    // entorno de producción, no solo en el .env local.
    if (staleIds.length) warn(`sigue habiendo copias con una propiedad GA4 vieja (${staleIds.join(", ")}); el código las normaliza en el click, pero la fuente está sin corregir`);
    else check(true, "ninguna copia declara una propiedad GA4 distinta de la del sitio");

    // ---------------------------------------------------------------------- resumen
    const failed = results.filter((r) => !r.ok);
    console.log(`\n${"─".repeat(60)}`);
    console.log(`${results.length} chequeos · ${c("green", `${results.length - failed.length} ok`)} · ${failed.length ? c("red", `${failed.length} fallan`) : c("green", "0 fallan")} · ${warnings.length ? c("yellow", `${warnings.length} avisos`) : "0 avisos"}`);
    if (warnings.length) {
        console.log(c("yellow", "\nAvisos (deuda conocida, no rompen el suite):"));
        for (const w of warnings) console.log(c("yellow", `  · [${w.ticket}] ${w.description}`));
    }
    if (failed.length) {
        console.log(c("red", "\nFallan:"));
        for (const f of failed) console.log(c("red", `  · [${f.ticket}] ${f.description}`));
    }
    process.exit(failed.length ? 1 : 0);
}

main().catch((err) => {
    console.error(c("red", `\nEl script no pudo terminar: ${err.stack || err}`));
    console.error(c("yellow", "¿Está levantado el servidor? npm run build && npm start"));
    process.exit(1);
});
