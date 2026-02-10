
import { wp } from "@/lib/wp";
// import "./travel-guide.css";
import Link from "next/link";
import { slugify } from "../helpers/slugify";
import React from "react";
import { Metadata } from "next";
import PageInteractivity from "./components/page-interactivity";
import { formatPostFromEmbed, filterValidPosts, type PostWithImageData } from "../utils/formatPostWithEmbed";

export type PostWithImage = PostWithImageData;

export const metadata: Metadata = {
    title: "Travel Guide - Food, Drinks & Experiences | Sherpa Food Tours",
    description: "Discover the ultimate travel guide for food, drinks, and unique experiences around the world. Explore authentic flavors, hidden gems, and the best places to eat, drink, and explore with Sherpa Food Tours.",
    keywords: [
        "travel guide",
        "food travel guide",
        "culinary travel guide",
        "best restaurants",
        "food experiences",
        "travel tips",
        "food and drink guide",
        "local food recommendations",
        "authentic food experiences",
        "world food guide",
        "culinary destinations",
        "food tourism",
        "restaurant recommendations",
        "local cuisine guide"
    ],
    authors: [{ name: "Sherpa Food Tours" }],
    openGraph: {
        title: "Travel Guide - Food, Drinks & Experiences | Sherpa Food Tours",
        description: "Discover the ultimate travel guide for food, drinks, and unique experiences around the world. Explore authentic flavors, hidden gems, and the best places to eat, drink, and explore.",
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.sherpafoodtours.com'}/travel-guide`,
        siteName: "Sherpa Food Tours",
        images: [
            {
                url: "https://hotpink-whale-908624.hostingersite.com/wp-content/uploads/2025/09/Imagen-de-portada.png",
                width: 1200,
                height: 630,
                alt: "Sherpa Food Tours Travel Guide",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Travel Guide - Food, Drinks & Experiences | Sherpa Food Tours",
        description: "Discover the ultimate travel guide for food, drinks, and unique experiences around the world.",
        images: ["https://hotpink-whale-908624.hostingersite.com/wp-content/uploads/2025/09/Imagen-de-portada.png"],
    },
    alternates: {
        canonical: `https://www.sherpafoodtours.com/travel-guide/`,
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

export default async function TravelGuidePage() {

    // Get cities for dropdown
    let cities = await wp.getAllCities();
    cities = cities.map((city: { id: number; slug: string; title: { rendered: string } }) => { 
        return { id: city.id, slug: city.slug, city: city.title.rendered } 
    });

    // Get 10 articles with _embed (single API call includes image + author data)
    const apiUrl = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2`;
    const postsRes = await fetch(`${apiUrl}/posts?per_page=10&_embed`, {
        next: { revalidate: 3600 }
    });
    const rawPosts = postsRes.ok ? await postsRes.json() : [];
    const formattedPosts = filterValidPosts(rawPosts.map(formatPostFromEmbed));
    
    // Generate JSON-LD structured data for SEO
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.sherpafoodtours.com';

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
                "name": "Travel Guide",
                "item": `${baseUrl}/travel-guide`
            }
        ]
    };

    const webPageSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Travel Guide - Food, Drinks & Experiences",
        "description": "Discover the ultimate travel guide for food, drinks, and unique experiences around the world.",
        "url": `${baseUrl}/travel-guide`,
        "publisher": {
            "@type": "Organization",
            "name": "Sherpa Food Tours",
            "logo": {
                "@type": "ImageObject",
                "url": "https://hotpink-whale-908624.hostingersite.com/wp-content/uploads/2025/09/Layer_1-1.png"
            }
        },
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": formattedPosts.slice(0, 9).map((post: PostWithImage, index: number) => {
                const citySlug = post.relaciones?.ciudades?.[0]?.title ? slugify(post.relaciones.ciudades[0].title) : null;
                const postUrl = citySlug ? `${baseUrl}/travel-guide/${citySlug}/${post.slug}` : `${baseUrl}/travel-guide`;

                return {
                    "@type": "ListItem",
                    "position": index + 1,
                    "url": postUrl,
                    "name": post.title.rendered.replace(/<[^>]*>/g, ''),
                    "image": post.image?.img
                };
            })
        }
    };




    return (
        <>
            {/* JSON-LD Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
            />

            <article>
                <section className="travel-guide-first-section">
                    <div
                        className="imgs-galleries"
                        style={{
                            backgroundImage: "url('https://hotpink-whale-908624.hostingersite.com/wp-content/uploads/2025/09/Imagen-de-portada.png')",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                        }}
                        role="img"
                        aria-label="Sherpa Food Tours Travel Guide header image"
                    >
                    </div>
                    <div className="titles-container">
                        <h1>The <img src="https://hotpink-whale-908624.hostingersite.com/wp-content/uploads/2025/09/Layer_1-1.png" alt="Sherpa Food Tours logo" width="120" height="40" /> <br /> travel guide</h1>
                        <h2>Experiences made to be remembered</h2>
                        <Link href="#travel-guide" className="btn-cta" aria-label="Explore the Sherpa Food Tours travel guide">Explore The Guide</Link>
                    </div>
                </section>
                <PageInteractivity
                    cities={cities}
                    formattedPosts={formattedPosts}
                />
            </article>
        </>
    )
}


export const revalidate = 86400;