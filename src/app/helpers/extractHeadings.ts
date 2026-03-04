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

    const htmlWithIds = html.replace(/<(h[23])([^>]*)>([\s\S]*?)<\/h[23]>/gi, (match, tag, attrs, inner) => {
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
