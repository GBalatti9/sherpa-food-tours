"use client";

import "./css/mobile-menu.css";

import { NavBarLink } from "@/types/nav-bar";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function MobileMenu({ items, currentPath, cities }: { items: NavBarLink[], currentPath: string, cities: { id: number; city: string; slug: string; flag: { img: string; alt: string } }[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu on outside click or Escape key
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") setIsOpen(false);
        }
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);


    return (
        <div className="md:hidden">
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen((v) => !v)}
                className={`relative z-50 transition-transform duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${isOpen ? "close" : ""}`}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
            >
                <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
                <div className="transition-transform duration-300">
                    {isOpen ? <X className="h-6 w-6 rotate-90" aria-hidden /> :
                        <Menu
                            className="h-8 w-8"
                            aria-hidden
                            style={{ color: currentPath.includes("travel-guide") ? "#333" : "var(--background)" }}
                        />
                    }
                </div>
            </button>

            {/* Mobile Menu Overlay */}
            <div
                id="mobile-menu"
                ref={menuRef}
                className={`fixed inset-0 z-40 bg-background/95 backdrop-blur-sm transition-all duration-300 ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                    }`}
                role="dialog"
                aria-modal="true"
                aria-label="Mobile navigation"
            >
                <nav className="nav-menu-mobile" role="menu">
                    {items.map((item, index) =>
                        item.label.toLowerCase() === "cities" ? (
                            <div key={item.href} role="none">
                                {/* Título del grupo, no es clickeable */}
                                <span className={`menu-item text-2xl font-medium text-foreground transition-all duration-300 ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                                    {item.label}
                                </span>

                                <div className="cities-child" role="none">
                                    {cities.map((city) => (
                                        <Link
                                            key={city.slug}
                                            href={`/city/${city.slug}`}
                                            onClick={() => setIsOpen(false)}
                                            className="menu-link"
                                            role="menuitem"
                                            tabIndex={isOpen ? 0 : -1}
                                        >
                                            <img src={city.flag.img} alt={city.flag.alt} />
                                            {city.city}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`menu-item text-2xl font-medium text-foreground hover:text-primary transition-all duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                    }`}
                                style={{
                                    transitionDelay: isOpen ? `${index * 100}ms` : "0ms",
                                }}
                                role="menuitem"
                                tabIndex={isOpen ? 0 : -1}
                            >
                                {item.label}
                            </Link>
                        )
                    )}
                </nav>

                <ul className="social-menu">

                    <li id="menu-item-329" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-329"><a className="socialItem" title="Instagram" target="_blank" href="https://www.instagram.com/sherpafoodtoursba/"><svg className="svg-icon" aria-hidden="true" role="img" focusable="false" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12,4.622c2.403,0,2.688,0.009,3.637,0.052c0.877,0.04,1.354,0.187,1.671,0.31c0.42,0.163,0.72,0.358,1.035,0.673 c0.315,0.315,0.51,0.615,0.673,1.035c0.123,0.317,0.27,0.794,0.31,1.671c0.043,0.949,0.052,1.234,0.052,3.637 s-0.009,2.688-0.052,3.637c-0.04,0.877-0.187,1.354-0.31,1.671c-0.163,0.42-0.358,0.72-0.673,1.035 c-0.315,0.315-0.615,0.51-1.035,0.673c-0.317,0.123-0.794,0.27-1.671,0.31c-0.949,0.043-1.233,0.052-3.637,0.052 s-2.688-0.009-3.637-0.052c-0.877-0.04-1.354-0.187-1.671-0.31c-0.42-0.163-0.72-0.358-1.035-0.673 c-0.315-0.315-0.51-0.615-0.673-1.035c-0.123-0.317-0.27-0.794-0.31-1.671C4.631,14.688,4.622,14.403,4.622,12 s0.009-2.688,0.052-3.637c0.04-0.877,0.187-1.354,0.31-1.671c0.163-0.42,0.358-0.72,0.673-1.035 c0.315-0.315,0.615-0.51,1.035-0.673c0.317-0.123,0.794-0.27,1.671-0.31C9.312,4.631,9.597,4.622,12,4.622 M12,3 C9.556,3,9.249,3.01,8.289,3.054C7.331,3.098,6.677,3.25,6.105,3.472C5.513,3.702,5.011,4.01,4.511,4.511 c-0.5,0.5-0.808,1.002-1.038,1.594C3.25,6.677,3.098,7.331,3.054,8.289C3.01,9.249,3,9.556,3,12c0,2.444,0.01,2.751,0.054,3.711 c0.044,0.958,0.196,1.612,0.418,2.185c0.23,0.592,0.538,1.094,1.038,1.594c0.5,0.5,1.002,0.808,1.594,1.038 c0.572,0.222,1.227,0.375,2.185,0.418C9.249,20.99,9.556,21,12,21s2.751-0.01,3.711-0.054c0.958-0.044,1.612-0.196,2.185-0.418 c0.592-0.23,1.094-0.538,1.594-1.038c0.5-0.5,0.808-1.002,1.038-1.594c0.222-0.572,0.375-1.227,0.418-2.185 C20.99,14.751,21,14.444,21,12s-0.01-2.751-0.054-3.711c-0.044-0.958-0.196-1.612-0.418-2.185c-0.23-0.592-0.538-1.094-1.038-1.594 c-0.5-0.5-1.002-0.808-1.594-1.038c-0.572-0.222-1.227-0.375-2.185-0.418C14.751,3.01,14.444,3,12,3L12,3z M12,7.378 c-2.552,0-4.622,2.069-4.622,4.622S9.448,16.622,12,16.622s4.622-2.069,4.622-4.622S14.552,7.378,12,7.378z M12,15 c-1.657,0-3-1.343-3-3s1.343-3,3-3s3,1.343,3,3S13.657,15,12,15z M16.804,6.116c-0.596,0-1.08,0.484-1.08,1.08 s0.484,1.08,1.08,1.08c0.596,0,1.08-0.484,1.08-1.08S17.401,6.116,16.804,6.116z"></path></svg></a></li>
                    <li id="menu-item-327" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-327"><a className="socialItem" title="Facebook" target="_blank" href="https://www.facebook.com/sherpafoodtours/"><svg className="svg-icon" aria-hidden="true" role="img" focusable="false" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.5 2 2 6.5 2 12c0 5 3.7 9.1 8.4 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7C18.3 21.1 22 17 22 12c0-5.5-4.5-10-10-10z"></path></svg></a></li>
                    <li id="menu-item-328" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-328"><a className="socialItem" title="Tripadvisor" target="_blank" href="https://www.tripadvisor.com/Attraction_Review-g312741-d19212033-Reviews-Sherpa_Food_Tours-Buenos_Aires_Capital_Federal_District.html"><svg className="svg-icon" aria-hidden="true" role="img" focusable="false" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24,6.7h-4.3c-2.2-1.5-4.8-2.4-7.7-2.4S6.5,5.2,4.3,6.7H0l1.9,2.1C0.7,9.9,0,11.5,0,13.2c0,3.3,2.7,6,6,6 c1.6,0,3-0.6,4.1-1.6l1.9,2.1l1.9-2.1c1.1,1,2.5,1.6,4.1,1.6c3.3,0,6-2.7,6-6c0-1.8-0.7-3.4-1.9-4.4L24,6.7z M6,17.3 c-2.3,0-4.1-1.8-4.1-4.1S3.8,9.1,6,9.1s4.1,1.8,4.1,4.1C10.1,15.4,8.2,17.3,6,17.3z M12,13.1c0-2.7-1.9-5-4.5-5.9 c1.4-0.6,2.9-0.9,4.5-0.9s3.1,0.3,4.5,0.9C13.9,8.2,12,10.4,12,13.1z M18,17.3c-2.3,0-4.1-1.8-4.1-4.1s1.8-4.1,4.1-4.1 s4.1,1.8,4.1,4.1S20.2,17.3,18,17.3z"></path><path d="M18,11.1c-1.2,0-2.1,1-2.1,2.1c0,1.2,1,2.1,2.1,2.1c1.2,0,2.1-1,2.1-2.1S19.2,11.1,18,11.1"></path><path d="M8.2,13.2c0,1.2-1,2.1-2.1,2.1s-2.1-1-2.1-2.1c0-1.2,1-2.1,2.1-2.1S8.2,12,8.2,13.2"></path></svg></a></li>

                </ul>
            </div>
        </div>
    );
}