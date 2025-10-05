import CitiesDropdown from "./cities-dropdown";
import "./css/footer.css"

import Link from "next/link";



export default function Footer({ cities }: { cities: { city: string; slug: string; flag: { img: string; alt: string; } }[] }) {
    return (
        <footer className="footer">
            <div className="footer-first-section">
                <div className="first-section">
                    <div className="logo">
                        <img src="/sherpa-complete-logo.png" alt="Shera complete logo" />
                    </div>
                    <div className="social-media">
                        <div className="img-container">
                            <img src="/instagram.png" alt="Instagram" />
                        </div>
                        <div className="img-container">

                            <img src="/tripadvisor.png" alt="Tripadvisor" />
                        </div>
                        <div className="img-container">

                            <img src="/facebook.png" alt="Facebook" />
                        </div>
                        <div className="img-container">

                            <img src="/tiktok.png" alt="Tiktok" />
                        </div>
                    </div>

                    <div className="cities-desktop">
                        <h6>EXPLORE OUR CITIES</h6>
                        <div className="cities-links">
                            {cities.map((city) => (
                                <Link key={city.slug} href={`/city/${city.slug}`}>{city.city}</Link>
                            ))}
                        </div>
                    </div>

                    <div className="positions-desktop">
                        <div className="positions">
                            <Link href="/contact" >Partner With Us</Link>
                            <Link href="/contact" >Careers</Link>
                        </div>
                        <div className="social-media">
                            <div className="img-container">
                                <img src="/instagram.png" alt="Instagram" />
                            </div>
                            <div className="img-container">

                                <img src="/tripadvisor.png" alt="Tripadvisor" />
                            </div>
                            <div className="img-container">

                                <img src="/facebook.png" alt="Facebook" />
                            </div>
                            <div className="img-container">

                                <img src="/tiktok.png" alt="Tiktok" />
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="separator" />
                <div className="second-section">
                    {/* <Link href="/travel-guide"> Explore Our Cities</Link> */}
                    <CitiesDropdown text="Explore Our Cities" cities={cities} color="#fff"/>
                    <Link href="/contact" >Partner With Us</Link>
                    <Link href="/contact" >Careers</Link>
                </div>
            </div>

            <div className="footer-second-section">
                <p>Sherpa Food Tours LLC & Sherpa Food Tours International LTD - Sherpa Food Tours is a trading name and registered trademark of Sherpa Food Tours International ltd. Registered in Great Britain and Northern Ireland no UK00004135333.</p>
            </div>
        </footer>
    )
}