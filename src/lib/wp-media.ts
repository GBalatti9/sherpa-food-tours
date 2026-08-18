// Las imágenes de WordPress se sirven desde el WP headless (staging), que responde
// `x-robots-tag: noindex, nofollow, noarchive` en cada archivo. Google tiene prohibido
// indexarlas, y por eso Lens atribuye las fotos de Sherpa a Instagram o Viator.
//
// Pasarlas por el optimizador de Next las re-emite desde el dominio público con headers
// propios, sin ese noindex, y además comprimidas. Este módulo construye esas URLs.

const SITE_ORIGIN = "https://www.sherpafoodtours.com";

/**
 * Imagen que viene de WordPress. width/height son las dimensiones reales del archivo:
 * van como atributos en el <img> para fijar el aspect-ratio y evitar CLS, no como
 * tamaño de render (de eso se ocupa el CSS).
 */
export type WpImage = {
    img: string;
    alt: string;
    width?: number;
    height?: number;
};

// El optimizador solo acepta los anchos declarados en images.deviceSizes + images.imageSizes
// de next.config.ts, y solo quality 75 (images.qualities). Cualquier otro valor da 400.
const ALLOWED_WIDTHS = [16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840];
export const IMAGE_QUALITY = 75;

/** Redondea al ancho permitido más chico que cubra el pedido. */
export function snapWidth(width: number): number {
    return ALLOWED_WIDTHS.find((w) => w >= width) ?? ALLOWED_WIDTHS[ALLOWED_WIDTHS.length - 1];
}

/** ¿Es un archivo servido por el WordPress headless? */
export function isWpMedia(url: string): boolean {
    return typeof url === "string" && url.includes("/wp-content/uploads/");
}

/**
 * URL del optimizador para una imagen. Lleva barra final a propósito: con
 * `trailingSlash: true`, pedir `/_next/image?...` devuelve un 308 y agrega un salto
 * de red por imagen.
 */
export function optimizedUrl(src: string, width?: number): string;
export function optimizedUrl(src: string | undefined, width?: number): string | undefined;
export function optimizedUrl(src: string | undefined, width = 1200): string | undefined {
    // Sin src no hay nada que optimizar, y `url=` vacío devuelve 400.
    if (!src) return src;
    // Idempotente: si ya apunta al optimizador, no lo envuelve de nuevo.
    if (src.startsWith("/_next/image")) return src;
    return `/_next/image/?url=${encodeURIComponent(src)}&w=${snapWidth(width)}&q=${IMAGE_QUALITY}`;
}

/** Igual que optimizedUrl pero absoluta, para og:image, twitter:image y JSON-LD. */
export function absoluteOptimizedUrl(src: string, width = 1200): string {
    if (!src) return src;
    if (!isWpMedia(src)) return src.startsWith("/") ? `${SITE_ORIGIN}${src}` : src;
    return `${SITE_ORIGIN}${optimizedUrl(src, width)}`;
}

/**
 * Reescribe los <img> del HTML que llega de WordPress para que apunten al optimizador.
 * `next/image` no sirve acá: el contenido entra como string a dangerouslySetInnerHTML.
 *
 * Reescribe también srcset — si solo se cambiara src, el browser seguiría eligiendo del
 * srcset y bajando la imagen desde staging.
 */
export function rewriteHtmlImages(html: string): string {
    if (!html) return html;

    // srcset: "<url> 300w, <url> 768w" — cada candidato apunta al optimizador con su ancho.
    const withSrcset = html.replace(
        /\bsrcset=(["'])(.*?)\1/gi,
        (match, quote: string, value: string) => {
            if (!isWpMedia(value)) return match;
            const rewritten = value
                .split(",")
                .map((candidate) => {
                    const parts = candidate.trim().split(/\s+/);
                    const url = parts[0];
                    const descriptor = parts[1];
                    if (!url || !isWpMedia(url)) return candidate.trim();
                    const width = descriptor?.endsWith("w") ? parseInt(descriptor, 10) : NaN;
                    return `${optimizedUrl(url, Number.isNaN(width) ? 1200 : width)}${descriptor ? ` ${descriptor}` : ""}`;
                })
                .join(", ");
            return `srcset=${quote}${rewritten}${quote}`;
        }
    );

    // src suelto (y los data-* que usa el lazy load de WP para rehidratar el src).
    return withSrcset.replace(
        /\b(src|data-src|data-full-url|data-large-file)=(["'])(https?:\/\/[^"']*\/wp-content\/uploads\/[^"']*)\2/gi,
        (_match, attr: string, quote: string, url: string) => `${attr}=${quote}${optimizedUrl(url)}${quote}`
    );
}
