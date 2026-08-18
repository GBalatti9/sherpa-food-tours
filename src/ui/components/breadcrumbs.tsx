import Link from "next/link";
import "./css/breadcrumbs.css";
import { toSitePath, type BreadcrumbItem } from "@/lib/schema";

/**
 * Migas de pan visibles. Recibe el mismo array que buildBreadcrumbSchema para que
 * el BreadcrumbList del JSON-LD y lo que ve el usuario no puedan divergir.
 */
export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
    if (items.length < 2) return null;

    return (
        <nav className="breadcrumbs" aria-label="Breadcrumb">
            <ol>
                {items.map((item, i) => {
                    const isLast = i === items.length - 1;
                    return (
                        <li key={item.url}>
                            {isLast ? (
                                <span aria-current="page">{item.name}</span>
                            ) : (
                                <Link href={toSitePath(item.url)}>{item.name}</Link>
                            )}
                            {!isLast && <span className="separator" aria-hidden="true">/</span>}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
