import he from "he";
import Link from "next/link";

export default function MarqueeBanner({ bannerTitle, bannerLink }: { bannerTitle: string | null, bannerLink: string | null }) {
    const marqueeText = bannerTitle ? he.decode(bannerTitle) : "BLACK FRIDAY SALE! ALL TOURS 15% OFF - USE CODE: 'CYBERSHERPA' ***";

    return (
        bannerLink ? (
            <Link href={bannerLink} target="_blank" className="marquee-wrapper">
                <div className="marquee">
                    <div className="marquee-content">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <span key={index} className="marquee-text">{marqueeText}</span>
                        ))}
                    </div>
                </div>
            </Link>
        )
            : (
                <div className="marquee-wrapper">
                    <div className="marquee">
                        <div className="marquee-content">
                            {Array.from({ length: 10 }).map((_, index) => (
                                <span key={index} className="marquee-text">{marqueeText}</span>
                            ))}
                        </div>
                    </div>
                </div>
            )
    );
}