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
        <header className="bg-[#0A4747] text-white" role="banner">
            <nav className="flex justify-between items-center border-b border-gray-300 px-6 sm:px-8 lg:px-16" aria-label="Main navigation">
                <div className="flex items-center py-4 md:py-0">
                    {/* Mobile menu button */}
                    <div className="md:hidden h-10 mr-2">
                        <MobileMenu items={items} />
                    </div>
                    <a href="/" aria-label="Go to homepage" className="p-0 h-12 w-30 md:h-auto overflow-hidden flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
                        <img src="/sherpa.png" alt="Sherpa Food Tours Logo" loading="eager" width={40} height={40} className="w-full h-full object-cover" />
                    </a>
                </div>
                <ul className="flex gap-0 md:gap-6 lg:gap-8 p-0 md:py-4 lg:py-6 justify-center items-center" role="menubar">
                    {items.map((item) => (
                        <li key={item.href} className="hover:underline hidden md:block text-sm lg:text-base" role="none">
                            <a
                                href={item.href}
                                className="block px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                role="menuitem"
                                tabIndex={0}
                            >
                                {item.label}
                            </a>
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