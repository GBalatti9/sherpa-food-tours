import { Heading } from "@/app/helpers/extractHeadings";

interface TableOfContentsProps {
    headings: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
    if (headings.length < 2) return null;

    const items: { number: string; text: string; id: string; level: 2 | 3 }[] = [];
    let h2Counter = 0;
    let h3Counter = 0;

    for (const heading of headings) {
        if (heading.level === 2) {
            h2Counter++;
            h3Counter = 0;
            items.push({ number: `${h2Counter}`, text: heading.text, id: heading.id, level: 2 });
        } else {
            h3Counter++;
            items.push({ number: `${h2Counter}.${h3Counter}`, text: heading.text, id: heading.id, level: 3 });
        }
    }

    return (
        <nav className="toc-container" aria-label="Table of contents">
            <p className="toc-title">TABLE OF CONTENTS</p>
            <ol className="toc-list">
                {items.map((item, index) => (
                    <li key={index} className={`toc-item toc-h${item.level}`}>
                        <a href={`#${item.id}`}>
                            <span className="toc-number">{item.number}.</span>
                            <span className="toc-text">{item.text}</span>
                        </a>
                    </li>
                ))}
            </ol>
        </nav>
    );
}
