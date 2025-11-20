export default function MarqueeBanner() {
    const marqueeText = "TOURS 15% OFF - CODE: CYBERSHERPA15      CYBERSALE: ALL TOURS 15% OFF - CODE: CYBERSHERPA15      ";

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