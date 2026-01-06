import { FormContact } from "@/ui/components/form-contact";
import TallyForm from "@/ui/components/tally-form";
import { Metadata } from "next";
// import "../contact/contact.css";

export const metadata: Metadata = {
    title: "Contáctanos - Ponte en Contacto | Sherpa Food Tours",
    description: "¿Tienes preguntas sobre nuestros tours gastronómicos? Contacta a Sherpa Food Tours hoy. Estamos aquí para ayudarte a planificar tu aventura culinaria perfecta.",
    keywords: [
        "contacto sherpa food tours",
        "consultas tours gastronómicos",
        "preguntas tours culinarios",
        "reserva tours gastronómicos",
        "contacto tours de comida",
        "soporte tours gastronómicos"
    ],
    authors: [{ name: "Sherpa Food Tours" }],
    openGraph: {
        title: "Contáctanos - Ponte en Contacto | Sherpa Food Tours",
        description: "¿Tienes preguntas sobre nuestros tours gastronómicos? Contacta a Sherpa Food Tours hoy. Estamos aquí para ayudarte a planificar tu aventura culinaria perfecta.",
        url: `https://www.sherpafoodtours.com/contacto/`,
        siteName: "Sherpa Food Tours",
        images: [
            {
                url: "/sherpa-complete-logo.webp",
                width: 1200,
                height: 630,
                alt: "Sherpa Food Tours - Contáctanos",
            },
        ],
        locale: "es_ES",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Contáctanos - Ponte en Contacto | Sherpa Food Tours",
        description: "¿Tienes preguntas sobre nuestros tours gastronómicos? Contacta a Sherpa Food Tours hoy.",
        images: ["/sherpa-complete-logo.webp"],
    },
    alternates: {
        canonical: `https://www.sherpafoodtours.com/contacto/`,
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
            <section className="contact-section !max-w-[700px] mx-auto">
                <h2>Got any questions? <span>Contact Us!</span></h2>
                {/* <FormContact /> */}
                <div>
                    <TallyForm />
                </div>
            </section>
        </main>
    );
};