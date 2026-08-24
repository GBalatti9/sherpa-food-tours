import he from "he";

const SITE_NAME = "Sherpa Food Tours";
const TITLE_SUFFIX = ` | ${SITE_NAME}`;

// Límites de la auditoría: title ≤ 60, description entre 70 y 157.
export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 157;

/**
 * Devuelve `${base} | Sherpa Food Tours` sólo si el total entra en los 60
 * caracteres; si no, devuelve el título pelado. El sufijo solo empujaba 33 de
 * los 69 títulos largos que reportó la auditoría: un título de WordPress de 41
 * caracteres ya se pasaba sin que nadie escribiera nada largo. Si el base ya
 * menciona la marca (títulos cargados a mano en ACF), no se duplica.
 */
export function siteTitle(base: string, max = TITLE_MAX): string {
    const clean = he.decode(base).replace(/\s+/g, " ").trim();
    if (clean.includes(SITE_NAME)) return clean;
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
