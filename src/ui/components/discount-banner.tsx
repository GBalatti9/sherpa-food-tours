

export default function DiscountBanner() {
    return (
        <div className="cyber-sale-container">
            <div className="cyber-sale-wrapper">
                <div className="cyber-sale-border-top"></div>

                <div className="cyber-sale-content">
                    <div className="cyber-sale-glow"></div>

                    <div className="cyber-sale-inner">
                        <h1 className="cyber-sale-title">
                            CYBER SALE
                        </h1>

                        <p className="cyber-sale-subtitle">
                            ALL TOURS <span className="cyber-sale-subtitle-discount"> 15%</span> OFF
                        </p>

                        <p className="cyber-sale-promo">
                            PROMO CODE = CYBERSHERPA15
                        </p>
                    </div>
                </div>

                <div className="cyber-sale-border-bottom"></div>
            </div>
        </div>
    );
}