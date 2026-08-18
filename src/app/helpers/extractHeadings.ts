import he from "he";

export interface Heading {
    level: 2 | 3;
    text: string;
    id: string;
}

function slugifyHeading(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .trim()
        .replace(/\s+/g, '-');
}

export function extractHeadings(html: string): { headings: Heading[]; htmlWithIds: string } {
    const headings: Heading[] = [];
    const idCount: Record<string, number> = {};

    // El <h1> de la página lo pone la plantilla con el título del post, así que un <h1>
    // dentro del cuerpo que venga del CMS siempre sobra. Se degrada a <h2> antes de
    // recorrer los encabezados: así la página nunca tiene más de un <h1>, escriba lo que
    // escriba el editor en WordPress, y el encabezado degradado entra en el índice en
    // lugar de quedar afuera.
    const demoted = html.replace(
        /<h1([^>]*)>([\s\S]*?)<\/h1>/gi,
        (_match, attrs, inner) => `<h2${attrs}>${inner}</h2>`
    );

    const htmlWithIds = demoted.replace(/<(h[23])([^>]*)>([\s\S]*?)<\/h[23]>/gi, (match, tag, attrs, inner) => {
        const level = parseInt(tag[1], 10) as 2 | 3;
        const text = he.decode(inner.replace(/<[^>]+>/g, '').trim());
        let baseId = slugifyHeading(text);
        if (!baseId) baseId = `heading-${headings.length}`;

        let id = baseId;
        if (idCount[baseId] !== undefined) {
            idCount[baseId]++;
            id = `${baseId}-${idCount[baseId]}`;
        } else {
            idCount[baseId] = 0;
        }

        headings.push({ level, text, id });

        const cleanedAttrs = attrs.replace(/\s*id="[^"]*"/gi, '');
        return `<${tag}${cleanedAttrs} id="${id}">${inner}</${tag}>`;
    });

    return { headings, htmlWithIds };
}
