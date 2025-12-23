import { FormContact } from "@/ui/components/form-contact";
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
                url: "/sherpa-complete-logo.webp",
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
        images: ["/sherpa-complete-logo.webp"],
    },
    alternates: {
        canonical: `https://www.sherpafoodtours.com/contact/`,
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

  return (
    <main className="contact-page" style={{ minHeight: "80vh" }}>
      <section className="contact-section">
        <h2>Got any questions? <span>Contact Us!</span></h2>
        <FormContact />
      </section>
    </main>
  );
};