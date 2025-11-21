export default function MarqueeBanner({ bannerTitle }: { bannerTitle: string | null }) {
    const marqueeText = bannerTitle ? bannerTitle : "TOURS 15% OFF - CODE: CYBERSHERPA      CYBERSALE: ALL TOURS 15% OFF - CODE: CYBERSHERPA      ";

    return (
        <div className="marquee-wrapper">
            <div className="marquee">
                <div className="marquee-content">
                    <span className="marquee-text">{marqueeText}</span>
                    <span className="marquee-text">{marqueeText}</span>
                </div>
            </div>
        </div>
    );
}