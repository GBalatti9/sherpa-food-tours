import { FormContact } from "@/ui/components/form-contact";
import TallyForm from "@/ui/components/tally-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us - Get in Touch | Sherpa Food Tours",
    description: "Have questions about our food tours? Contact Sherpa Food Tours today. We're here to help you plan your perfect culinary adventure.",
    keywords: [
        "contact sherpa food tours",
        "food tour inquiries",
        "culinary tour questions",
        "food tour booking",
        "contact food tours",
        "food tour support"
    ],
    authors: [{ name: "Sherpa Food Tours" }],
    openGraph: {
        title: "Contact Us - Get in Touch | Sherpa Food Tours",
        description: "Have questions about our food tours? Contact Sherpa Food Tours today. We're here to help you plan your perfect culinary adventure.",
        url: `https://www.sherpafoodtours.com/contact/`,
        siteName: "Sherpa Food Tours",
        images: [
            {
                url: "/sherpa-main-image.webp",
                width: 1200,
                height: 630,
                alt: "Sherpa Food Tours - Contact Us",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Contact Us - Get in Touch | Sherpa Food Tours",
        description: "Have questions about our food tours? Contact Sherpa Food Tours today.",
        images: ["/sherpa-main-image.webp"],
    },
    alternates: {
        canonical: `https://www.sherpafoodtours.com/contact/`,
        languages: {
            'en': 'https://www.sherpafoodtours.com/contact/',
            'es': 'https://www.sherpafoodtours.com/contacto/',
            'x-default': 'https://www.sherpafoodtours.com/contact/',
        },
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

export default async function ContactPage() {
    const contactPageSchema = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "@id": "https://www.sherpafoodtours.com/contact/#webpage",
        "name": "Contact Sherpa Food Tours",
        "description": "Have questions about our food tours? Contact Sherpa Food Tours today.",
        "url": "https://www.sherpafoodtours.com/contact/",
        "isPartOf": { "@id": "https://www.sherpafoodtours.com/#website" },
        "publisher": { "@id": "https://www.sherpafoodtours.com/#organization" }
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.sherpafoodtours.com/" },
            { "@type": "ListItem", "position": 2, "name": "Contact", "item": "https://www.sherpafoodtours.com/contact/" }
        ]
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <main className="contact-page" style={{ minHeight: "80vh" }}>
                <section className="contact-section !max-w-[700px] mx-auto">
                    <h1>Got any questions? <span>Contact Us!</span></h1>
                    <p style={{ textAlign: 'center', marginBottom: '1.5rem', opacity: 0.8 }}>
                        Email us at <a href="mailto:info@sherpafoodtours.com">info@sherpafoodtours.com</a>
                    </p>
                    {/* <FormContact /> */}
                    <div>
                        <TallyForm />
                    </div>
                </section>
            </main>
        </>
    );
};