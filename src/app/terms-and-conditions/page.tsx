import { Metadata } from "next";
import Link from "next/link";
import "./terms.css";

export const metadata: Metadata = {
    title: "Terms and Conditions | Sherpa Food Tours",
    description: "Read the Terms and Conditions for Sherpa Food Tours. Learn about our booking, cancellation, refund policies, tour participation guidelines, and more.",
    openGraph: {
        title: "Terms and Conditions | Sherpa Food Tours",
        description: "Read the Terms and Conditions for Sherpa Food Tours. Learn about our booking, cancellation, refund policies, and tour participation guidelines.",
        url: "https://www.sherpafoodtours.com/terms-and-conditions/",
        siteName: "Sherpa Food Tours",
        images: [
            {
                url: "https://www.sherpafoodtours.com/sherpa-main-image.webp",
                width: 1200,
                height: 630,
                alt: "Sherpa Food Tours - Terms and Conditions",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Terms and Conditions | Sherpa Food Tours",
        description: "Read the Terms and Conditions for Sherpa Food Tours.",
        images: ["https://www.sherpafoodtours.com/sherpa-main-image.webp"],
    },
    alternates: {
        canonical: "https://www.sherpafoodtours.com/terms-and-conditions/",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export default function TermsAndConditionsPage() {
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.sherpafoodtours.com/" },
            { "@type": "ListItem", "position": 2, "name": "Terms and Conditions", "item": "https://www.sherpafoodtours.com/terms-and-conditions/" }
        ]
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

            <main className="terms-page">
                <article className="terms-content">
                    <h1>Terms and Conditions</h1>
                    <p className="terms-updated">Last Updated: June 2026</p>

                    <section>
                        <h2>1. Introduction</h2>
                        <p>
                            Welcome to Sherpa Food Tours (&ldquo;Sherpa&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). These Terms and Conditions govern your use of the website{" "}
                            <Link href="https://www.sherpafoodtours.com" target="_blank">www.sherpafoodtours.com</Link>{" "}
                            and your participation in any of our culinary experiences, tours, and events. By accessing our website or booking a tour, you agree to be bound by these Terms.
                        </p>
                    </section>

                    <section>
                        <h2>2. Bookings, Cancellations, and Refunds</h2>
                        <p>
                            All bookings and payments are processed securely through our third-party partner, FareHarbor. By booking, you also agree to FareHarbor&apos;s Terms of Service.
                        </p>
                        <ul>
                            <li>
                                <strong>Cancellation Policy:</strong> You can cancel your booking up to 24 hours before the experience starts to receive a full refund.
                            </li>
                            <li>
                                <strong>Late Cancellations:</strong> If you cancel less than 24 hours before the start time, or if you fail to show up, no refund will be given. Changes to your booking are not accepted within 24 hours of the experience start time.
                            </li>
                            <li>
                                <strong>Minimum Travelers & Weather:</strong> A minimum number of travelers is required to run our experiences. If the minimum is not met, or if a tour must be canceled due to extreme weather, you will be offered a new date, an alternative experience, or a full refund.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. Tour Participation and Liability</h2>
                        <p>
                            Our goal is to provide a safe, immersive, and enjoyable experience for all guests. By participating, you acknowledge and agree to the following:
                        </p>
                        <ul>
                            <li>
                                <strong>Assumption of Risk:</strong> Guests participate voluntarily and acknowledge that walking food tours may involve uneven surfaces, street activity, and the consumption of food or beverages at their own discretion. Please let us know if you have any mobility issues prior to booking.
                            </li>
                            <li>
                                <strong>Third-Party Venues:</strong> Sherpa acts as a coordinator between guests and independent partner venues (restaurants, markets, bars). These independent partners are solely responsible for food preparation, safety, and service.
                            </li>
                            <li>
                                <strong>Alcohol Consumption:</strong> Alcoholic beverages may be served in small portions by licensed venues. Guests must be of legal drinking age in the tour&apos;s jurisdiction and are expected to drink responsibly.
                            </li>
                            <li>
                                <strong>Right of Refusal:</strong> We want everyone to have a great time. Sherpa reserves the right to remove any guest whose behavior is unsafe, disruptive, or inappropriate, without refund.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. Dietary Restrictions and Allergies</h2>
                        <p>
                            Guests with food allergies or medical conditions must inform Sherpa prior to the tour so reasonable accommodations can be explored. While we and our partners do our best to accommodate dietary needs, cross-contamination is always a possibility in working kitchens.
                        </p>
                        <p>
                            <strong>Note:</strong> Unfortunately, due to the traditional nature of the local cuisines we explore, we are generally unable to accommodate strict vegan dietary needs.
                        </p>
                    </section>

                    <section>
                        <h2>5. Media Release</h2>
                        <p>
                            We love capturing the joy of the shared table. Photos or short videos may be taken during the experience for documentation or marketing purposes. If you prefer not to be included in these materials, please simply notify your guide at the beginning of the tour.
                        </p>
                    </section>

                    <section>
                        <h2>6. Website Use and Intellectual Property</h2>
                        <p>
                            All content on{" "}
                            <Link href="https://www.sherpafoodtours.com" target="_blank">www.sherpafoodtours.com</Link>,{" "}
                            including but not limited to the Travel Guides, text, graphics, logos, and images, is the property of Sherpa Food Tours and is protected by copyright laws. You may not reproduce, distribute, or use our content for commercial purposes without our express written consent.
                        </p>
                    </section>

                    <section>
                        <h2>7. Governing Law</h2>
                        <p>
                            These terms are governed by the laws of the jurisdiction in which the relevant Sherpa Food Tours operating entity (Sherpa Food Tours LLC or Sherpa Food Tours International LTD) is registered, without regard to its conflict of law provisions. Where applicable, mandatory national consumer protection laws of your country of residence will remain unaffected.
                        </p>
                    </section>

                    <section>
                        <h2>8. Contact Us</h2>
                        <p>
                            If you have any questions about these Terms, please contact us at{" "}
                            <a href="mailto:hola@sherpafoodtours.com">hola@sherpafoodtours.com</a>.
                        </p>
                        <p className="terms-address">
                            Sherpa Food Tours<br />
                            2625 Weston Road, Suite 105<br />
                            Florida, USA 33331
                        </p>
                    </section>
                </article>
            </main>
        </>
    );
}
