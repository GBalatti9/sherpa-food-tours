"use client";

import { NavBarLink } from "@/types/nav-bar";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function MobileMenu({ items, currentPath }: { items: NavBarLink[], currentPath: string }) {
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
                className="relative z-50 transition-transform duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
            >
                <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
                <div className="transition-transform duration-300">
                    {isOpen ? <X className="h-6 w-6 rotate-90" aria-hidden /> : <Menu className="h-8 w-8" aria-hidden style={{color: currentPath === '/' ? 'var(--background)' : '#333'}}/>}
                </div>
            </button>

            {/* Mobile Menu Overlay */}
            <div
                id="mobile-menu"
                ref={menuRef}
                className={`fixed inset-0 z-40 bg-background/95 backdrop-blur-sm transition-all duration-300 ${
                    isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                }`}
                role="dialog"
                aria-modal="true"
                aria-label="Mobile navigation"
            >
                <nav className="flex h-full flex-col items-center justify-center space-y-8" role="menu">
                    {items.map((item, index) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`text-2xl font-medium text-foreground hover:text-primary transition-all duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                                isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                            }`}
                            style={{
                                transitionDelay: isOpen ? `${index * 100}ms` : "0ms",
                            }}
                            role="menuitem"
                            tabIndex={isOpen ? 0 : -1}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
}