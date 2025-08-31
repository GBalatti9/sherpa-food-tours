import Link from "next/link";



export default function Footer() {
    return (
        <section className="footer">
            <div className="footer-first-section">
                <div className="first-section">
                    <div className="logo">
                        <img src="/sherpa-complete-logo.png" alt="Shera complete logo" />
                    </div>
                    <div className="social-media">
                        <img src="/instagram.png" alt="Instagram" />
                        <img src="/tripadvisor.png" alt="Tripadvisor" />
                        <img src="/facebook.png" alt="Facebook" />
                        <img src="/tiktok.png" alt="Tiktok" />
                    </div>
                </div>
                <hr />
                <div className="second-section">
                    <Link href="/travel-guide"> Explore Our Cities</Link>
                    <Link href="/partners" >Partner With Us</Link>
                    <Link href="/careers" >Careers</Link>
                </div>
            </div>

            <div className="footer-second-section">
                <p>Sherpa Food Tours LLC & Sherpa Food Tours International LTD - Sherpa Food Tours is a trading name and registered trademark of Sherpa Food Tours International ltd. Registered in Great Britain and Northern Ireland no UK00004135333.</p>
            </div>
        </section>
    )
}