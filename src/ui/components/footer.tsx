import { wp } from "@/lib/wp";
import CitiesDropdown from "./cities-dropdown";
import "./css/footer.css"

import Link from "next/link";



export default async function Footer({ cities }: { cities: { id: number; city: string; slug: string; flag: { img: string; alt: string; } }[] }) {

    const socialMedia = await wp.getEmbedSectionInfo('footer');
    const instagram = socialMedia.acf.instagram;
    const tripadvisor = socialMedia.acf.tripadvisor;
    const facebook = socialMedia.acf.facebook;
    const tiktok = socialMedia.acf.tiktok;



    return (
        <footer className="footer">
            <div className="footer-first-section">
                <div className="first-section">
                    <div className="logo">
                        <img src="/sherpa-complete-logo.webp" alt="Shera complete logo" />
                    </div>
                    <div className="social-media">
                        <div className="img-container">
                            {instagram ? (
                                <Link href={instagram} target="_blank">
                                    <img src="/instagram.webp" alt="Instagram" />
                                </Link>
                            ) : <img src="/instagram.webp" alt="Instagram" />}
                        </div>
                        
                        <div className="img-container">
                            {tripadvisor ? (
                                <Link href={tripadvisor} target="_blank">
                                    <img src="/tripadvisor.webp" alt="Tripadvisor" />
                                </Link>
                            ) : <img src="/tripadvisor.webp" alt="Tripadvisor" />}
                        </div>
                        
                        <div className="img-container">
                            {facebook ? (
                                <Link href={facebook} target="_blank">
                                    <img src="/facebook.webp" alt="Facebook" />
                                </Link>
                            ) : <img src="/facebook.webp" alt="Facebook" />}
                        </div>
                        
                        <div className="img-container">
                            {tiktok ? (
                                <Link href={tiktok} target="_blank">
                                    <img src="/tiktok.webp" alt="Tiktok" />
                                </Link>
                            ) : <img src="/tiktok.webp" alt="Tiktok" />}
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
                                {instagram ? (
                                    <Link href={instagram} target="_blank">
                                        <img src="/instagram.webp" alt="Instagram" />
                                    </Link>
                                ) : <img src="/instagram.webp" alt="Instagram" />}
                            </div>
                            <div className="img-container">
                                {tripadvisor ? (
                                    <Link href={tripadvisor} target="_blank">
                                        <img src="/tripadvisor.webp" alt="Tripadvisor" />
                                    </Link>
                                ) : <img src="/tripadvisor.webp" alt="Tripadvisor" />}
                            </div>
                            <div className="img-container">
                                {facebook ? (
                                    <Link href={facebook} target="_blank">
                                        <img src="/facebook.webp" alt="Facebook" />
                                    </Link>
                                ) : <img src="/facebook.webp" alt="Facebook" />}
                            </div>
                            <div className="img-container">
                                {tiktok ? (
                                    <Link href={tiktok} target="_blank">
                                        <img src="/tiktok.webp" alt="Tiktok" />
                                    </Link>
                                ) : <img src="/tiktok.webp" alt="Tiktok" />}
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="separator" />
                <div className="second-section">
                    {/* <Link href="/travel-guide"> Explore Our Cities</Link> */}
                    <CitiesDropdown text="Explore Our Cities" cities={cities} color="#fff" />
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