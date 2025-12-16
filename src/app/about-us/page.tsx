import { wp } from "@/lib/wp";
// import "./about-us.css";
import { AboutUsInfo, AcfData, LocalGuide, ValueItem } from "./types";
import MeetLocalGuides from "@/ui/components/meet-local-guides";
import OurValues from "./components/our-values";
import type { OurStory } from "@/types/our-story";
import OurStoryComponent from "./components/our-story";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us - Our Story & Values | Sherpa Food Tours",
    description: "Learn about Sherpa Food Tours' mission to provide authentic culinary experiences. Meet our local guides and discover the values that drive us to create unforgettable food tours around the world.",
    keywords: [
        "about sherpa food tours",
        "our story",
        "our values",
        "local food guides",
        "authentic food experiences",
        "culinary mission",
        "food tour company",
        "meet our guides",
        "food tour philosophy",
        "authentic travel experiences",
        "local food experts",
        "food tourism company"
    ],
    authors: [{ name: "Sherpa Food Tours" }],
    openGraph: {
        title: "About Us - Our Story & Values | Sherpa Food Tours",
        description: "Learn about Sherpa Food Tours' mission to provide authentic culinary experiences. Meet our local guides and discover what drives us.",
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.sherpafoodtours.com'}/about-us`,
        siteName: "Sherpa Food Tours",
        images: [
            {
                url: "https://hotpink-whale-908624.hostingersite.com/wp-content/uploads/2025/09/Layer_1.png",
                width: 1200,
                height: 630,
                alt: "Sherpa Food Tours - About Us",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "About Us - Our Story & Values | Sherpa Food Tours",
        description: "Learn about Sherpa Food Tours' mission to provide authentic culinary experiences.",
        images: ["https://hotpink-whale-908624.hostingersite.com/wp-content/uploads/2025/09/Layer_1.png"],
    },
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.sherpafoodtours.com'}/about-us/`,
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
}

export default async function AboutUsPage() {

    const { content, acf }: AboutUsInfo = await wp.getPageInfo("about");

    // Función para obtener entradas de ACF según un filtro
    const getACFEntries = (acf: AcfData, keyIncludes: string, validator: (item: ValueItem) => void) =>
        Object.entries(acf)
            .filter(([key, value]) => key.includes(keyIncludes) && validator(value))
            .map(([, value]) => value);

    const hasTitle = (item: ValueItem) => item?.title?.trim().length > 0;

    const values = getACFEntries(acf, "value", hasTitle);
    const localGuides = getACFEntries(acf, "local_guide", () => true);

    // Carga de imágenes
    const loadValueImages = (items: ValueItem[]) =>
        Promise.all(
            items.map(async (item) => ({
                ...item,
                background_image: await wp.getPostImage(item.background_image),
            }))
        );

    const loadGuideImages = (items: LocalGuide[]) =>
        Promise.all(
            items.map(async (item) => ({
                ...item,
                profile_picture: await wp.getPostImage(item.profile_picture),
            }))
        );

    const [acfData, acfDataLocalGuides] = await Promise.all([
        loadValueImages(values),
        loadGuideImages(localGuides),
    ]);

    const our_story: OurStory = {
        title: "",
        items: []
    }
    
    if (acf.our_story) {
        our_story.title = acf.our_story.title;

        const formattedYears = Object.entries(acf.our_story.years).map(([, value]) => value);
        const completeYears = await Promise.all(formattedYears.map(async (element) => {
            if (!element.image_2019) return {...element, image: null};
            const img = await wp.getPostImage(element.image_2019);
            return {
                ...element,
                image: img
            }
        }))
        our_story.items = completeYears.filter(
            (element) => element.title !== "" && element.title !== null
        );
    }


    const acfLocalGuidesCorrect = await Promise.all(acfDataLocalGuides.map(async (element) => {

        const countryFlag = await wp.getPostImage(element.country_flag)
        return {
            ...element,
            country_flag: countryFlag
        }
    }))



    // Generate structured data for SEO
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.sherpafoodtours.com';
    
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Sherpa Food Tours",
        "url": baseUrl,
        "logo": "https://hotpink-whale-908624.hostingersite.com/wp-content/uploads/2025/09/Layer_1.png",
        "description": "Authentic food tours and culinary experiences around the world with local guides",
        "sameAs": [
            "https://www.facebook.com/sherpafoodtours",
            "https://www.instagram.com/sherpafoodtours",
            "https://www.tiktok.com/@sherpafoodtours"
        ]
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": baseUrl
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "About Us",
                "item": `${baseUrl}/about-us`
            }
        ]
    };

    return (
        <>
            {/* JSON-LD Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            
            <main className="about-us-page">
                <article>
                    <section className="about-us-page-first-section">
                        <h1>The <img src="https://hotpink-whale-908624.hostingersite.com/wp-content/uploads/2025/09/Layer_1.png" alt="Sherpa Food Tours logo" width="120" height="40" /> manifesto</h1>
                        <div dangerouslySetInnerHTML={{ __html: content }} className="render-html"></div>
                    </section>
                    <OurValues items={acfData} />
                    <section className="about-us-page-third-section">
                        <div className="local-guide-container-page">
                            <MeetLocalGuides localGuides={acfLocalGuidesCorrect} />
                        </div>
                    </section>
                    <OurStoryComponent our_story={our_story}/>
                </article>
            </main>
        </>
    )
}

export const revalidate = 86400;