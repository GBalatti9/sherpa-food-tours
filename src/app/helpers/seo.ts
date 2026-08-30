import he from "he";

const SITE_NAME = "Sherpa Food Tours";
const TITLE_SUFFIX = ` | ${SITE_NAME}`;

// Límites de la auditoría: title ≤ 60, description entre 70 y 157.
export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 157;

/**
 * Normaliza cualquier title a los 60 caracteres de la auditoría.
 *
 * El sufijo de marca se agrega sólo si entra. Al revés también: si el título ya viene
 * con la marca y se pasa de 60, lo que se cae es el sufijo y no la redacción — los ocho
 * títulos de ciudad cargados a mano en WP ("Cartagena Food Tours & Local Culinary
 * Experiences | Sherpa Food Tours", 69) entran holgados apenas se les saca. Es la parte
 * redundante: Google ya muestra el sitio aparte.
 *
 * Lo que NO se hace es truncar. Un título de artículo que se pasa de 60 sin tener marca
 * que sacarle es texto que escribió un editor, y cortarlo en la palabra 58 lo deja colgado
 * sin el sustantivo final. Google recorta la visualización igual, pero usa el texto entero
 * para relevancia. Esos casos salen como aviso en verify-merge.js: se corrigen redactando
 * en WordPress, no acá.
 *
 * Ojo con el orden de las guardas: `clean.includes(SITE_NAME)` tiene que evaluarse antes
 * de agregar el sufijo, o los títulos de ACF que ya nombran la marca la llevarían dos veces.
 */
export function siteTitle(base: string, max = TITLE_MAX): string {
    const clean = he.decode(base).replace(/\s+/g, " ").trim();

    if (clean.includes(SITE_NAME)) {
        if (clean.length <= max) return clean;
        return clean.endsWith(TITLE_SUFFIX)
            ? clean.slice(0, -TITLE_SUFFIX.length).trim()
            : clean;
    }

    if (clean.length + TITLE_SUFFIX.length <= max) return clean + TITLE_SUFFIX;
    return clean;
}

/**
 * Normaliza una meta description venga de donde venga (excerpt, content o un
 * campo ACF cargado a mano): saca HTML, decodifica entidades, colapsa espacios
 * y trunca en límite de palabra sin pasarse de los 157 — el "…" cuenta.
 */
export function metaDescription(text: string, max = DESCRIPTION_MAX): string {
    const clean = he.decode(text.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
    if (clean.length <= max) return clean;
    const cut = clean.lastIndexOf(" ", max - 1);
    return clean.slice(0, cut > 0 ? cut : max - 1).replace(/[\s,;:.!?]+$/, "") + "…";
}
