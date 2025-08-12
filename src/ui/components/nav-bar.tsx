import Link from "next/link";
import BookNowButton from "./book-now";
import MobileMenu from "./mobile-menu";

export default function NavBar() {
    const items = [
        { label: 'Cities', href: '/' },
        { label: 'Travel Guide', href: '/tours' },
        { label: 'About us', href: '/about' },
        { label: 'Contact', href: '/contact' }
    ];
    return (
        <header className="bg-[#0A4747] text-white fixed w-full font-excelsior" role="banner">
            <nav className="flex justify-between items-center border-b border-gray-300 px-6 sm:px-8 lg:px-16" aria-label="Main navigation">
                <div className="flex items-center py-4 md:py-0">
                    {/* Mobile menu button */}
                    <div className="md:hidden h-10 mr-2">
                        <MobileMenu items={items} />
                    </div>
                    <Link href="/" aria-label="Go to homepage" className="p-0 h-12 w-30 md:h-auto overflow-hidden flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
                        <img src="/sherpa.png" alt="Sherpa Food Tours Logo" loading="eager" width={40} height={40} className="w-full h-full object-cover" />
                    </Link>
                </div>
                <ul className="flex gap-0 md:gap-6 lg:gap-8 p-0 md:py-4 justify-center items-center" role="menubar">
                    {items.map((item) => (
                        <li
                            key={item.href}
                            className="hidden md:block text-sm 2xl:text-base group"
                            role="none"
                        >
                            <Link
                                href={item.href}
                                className="relative block focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                role="menuitem"
                                tabIndex={0}
                            >
                                {item.label}
                                <span
                                    className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 ease-out group-hover:w-full"
                                />
                            </Link>
                        </li>

                    ))}
                    <li role="none">
                        <BookNowButton />
                    </li>
                </ul>
            </nav>
        </header>
    );
}