// Los links internos que los editores dejan en el cuerpo de los posts llegan con cuatro
// defectos que se midieron sobre los 72 artículos publicados (302 links internos):
//
//   - 11 apuntan a staging.sherpafoodtours.com, o sea que el artículo publicado manda
//     al visitante al entorno de staging, que además está noindexado.
//   - 20 vienen sin barra final, y con trailingSlash: true cada uno cuesta un 308.
//   -  2 arrastran ?utm_source=chatgpt.com de un copy/paste: en un link interno el UTM
//     corta la sesión en Analytics y genera una URL duplicada de la misma página.
//   - 12 son <a> sin texto ni imagen adentro: invisibles para el visitante y sin ningún
//     contexto para Google. Uno de ellos apuntaba a /wp-admin/edit.php.
//
// El anchor text en sí está bien (los 302 son descriptivos), así que acá no se toca: esto
// normaliza el destino, no la redacción.
//
// Se arregla en el render y no en WordPress porque cubre los 72 posts de una y no depende
// de que nadie edite nada. El dato en WP sigue mal: la lista para corregir el origen está
// en la bitácora.

const SITE_ORIGIN = "https://www.sherpafoodtours.com";

// Todo lo que representa al mismo sitio, escrito de tres formas distintas por los editores.
const INTERNAL_HOSTS = new Set([
    "www.sherpafoodtours.com",
    "sherpafoodtours.com",
    "staging.sherpafoodtours.com",
]);

/** Normaliza el href de un link interno. Devuelve null si no hay que tocarlo. */
function normalizeInternalHref(href: string): string | null {
    let url: URL;
    try {
        url = new URL(href, SITE_ORIGIN);
    } catch {
        return null;
    }
    if (!INTERNAL_HOSTS.has(url.hostname)) return null;

    url.protocol = "https:";
    url.hostname = "www.sherpafoodtours.com";

    // Los UTM sólo tienen sentido cruzando de un dominio a otro.
    [...url.searchParams.keys()]
        .filter((k) => k.toLowerCase().startsWith("utm_"))
        .forEach((k) => url.searchParams.delete(k));

    // Barra final, salvo que la ruta apunte a un archivo (.pdf, .jpg…).
    const esArchivo = /\.[a-z0-9]{2,5}$/i.test(url.pathname);
    if (!url.pathname.endsWith("/") && !esArchivo) url.pathname += "/";

    return url.toString();
}

/** ¿El <a> no aporta nada? Ni texto, ni imagen, ni ícono. */
function anchorVacio(interior: string): boolean {
    if (/<(img|picture|svg|video|iframe)\b/i.test(interior)) return false;
    return interior.replace(/<[^>]*>/g, "").replace(/&nbsp;|\s/g, "") === "";
}

/**
 * Normaliza los links internos del HTML que llega de WordPress. Idempotente: correr esto
 * dos veces da el mismo resultado que correrlo una.
 */
export function rewriteInternalLinks(html: string): string {
    if (!html) return html;

    return html.replace(
        /<a\b([^>]*?)href=(["'])(.*?)\2([^>]*)>([\s\S]*?)<\/a>/gi,
        (match, antes: string, comilla: string, href: string, despues: string, interior: string) => {
            const nuevoHref = normalizeInternalHref(href);
            // Externo: se deja intacto, incluso si viene vacío.
            if (nuevoHref === null) return match;
            // Interno y vacío: el link entero sobra.
            if (anchorVacio(interior)) return "";
            return `<a${antes}href=${comilla}${nuevoHref}${comilla}${despues}>${interior}</a>`;
        }
    );
}
