/**
 * Fecha de última actualización visible de un artículo.
 *
 * La auditoría pide mostrarla debajo del título y en las tarjetas del listado, para que
 * la frescura del contenido se vea sin tener que abrir el JSON-LD. Hasta ahora la fecha
 * existía sólo en `dateModified` del schema y en el OpenGraph: correcta para Google,
 * invisible para el lector.
 *
 * Dos cuidados que no son opcionales acá:
 *
 * - WordPress devuelve `modified` sin zona horaria ("2026-08-25T14:30:00"). Sin agregarle
 *   el offset, cada runtime lo interpreta en su propia zona y la fecha puede correrse un
 *   día. Es el mismo ensureTimezone que ya usa el JSON-LD del artículo.
 * - El formato se fija en en-US y UTC a propósito. Las tarjetas del listado se renderizan
 *   en el cliente (infinite-scroll) y el artículo en el servidor: si el formato dependiera
 *   de la locale o de la zona del visitante, el HTML del server y el del browser no
 *   coincidirían y React tiraría un error de hidratación.
 */

const FORMATTER = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
});

function withTimezone(value: string): string {
    if (/[Zz]$/.test(value) || /[+-]\d{2}:\d{2}$/.test(value)) return value;
    return value + "+00:00";
}

/** ISO completo para el atributo `datetime` de <time>. "" si la fecha no sirve. */
export function articleDateTime(value?: string | null): string {
    if (!value) return "";
    const d = new Date(withTimezone(value));
    return isNaN(d.getTime()) ? "" : d.toISOString();
}

/** Texto legible: "August 25, 2026". "" si la fecha no sirve, para no renderizar nada. */
export function formatArticleDate(value?: string | null): string {
    if (!value) return "";
    const d = new Date(withTimezone(value));
    return isNaN(d.getTime()) ? "" : FORMATTER.format(d);
}
