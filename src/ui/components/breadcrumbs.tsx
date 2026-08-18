import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Crumb } from "@/lib/breadcrumbs";
import "./css/breadcrumbs.css";

/**
 * Trail visible que espeja el BreadcrumbList de la página. Recibe el mismo array de
 * crumbs que alimenta al JSON-LD, así no pueden divergir.
 *
 * El último crumb es la página actual: se renderiza como texto, no como link.
 */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
    if (items.length < 2) return null;

    return (
        <nav className="breadcrumbs" aria-label="Breadcrumb">
            <ol>
                {items.map((item, index) => {
                    const isCurrent = index === items.length - 1;
                    return (
                        <li key={item.href}>
                            {isCurrent ? (
                                <span aria-current="page">{item.name}</span>
                            ) : (
                                <>
                                    <Link href={item.href}>{item.name}</Link>
                                    <ChevronRight className="breadcrumbs-separator" aria-hidden="true" />
                                </>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
