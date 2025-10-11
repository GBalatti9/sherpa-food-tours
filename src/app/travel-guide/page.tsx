
import { wp } from "@/lib/wp";
import "./travel-guide.css";
import Link from "next/link";
import Image from "next/image";
import { slugify } from "../helpers/slugify";
import { WPPost } from "@/types/post";
import { Category } from "@/types/category";
import React from "react";
import CitiesDropdown from "@/ui/components/cities-dropdown";
import FiltersDropdown from "@/ui/components/filter-dropdown";
import { Metadata } from "next";

interface CompletePost {
    category: string;
    posts: PostWithImage[]
}

interface PostWithImage extends WPPost {
    image: {
        img: string;
        alt: string;
    }
}

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
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.sherpafoodtours.com'}/travel-guide`,
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

    let categories = await wp.getAllCategories();
    categories = categories.filter((category: Category) => category.name !== "Uncategorized");

    let cities = await wp.getAllCities();
    cities = cities.map((city: { slug: string; title: { rendered: string } }) => { return { slug: city.slug, city: city.title.rendered } });

    const data = await Promise.all(categories.map(async (category: Category) => {
        const posts = await wp.getPostsByCategory(category.id, 6);
        if (!posts.ok) {
            return {
                category: category.name,
                posts: [],
            }
        }

        const postsWithImage = await Promise.all(
            posts.data.map(async (post: WPPost) => {
                const image = await wp.getPostImage(post.featured_media);
                return {
                    ...post,
                    image,
                };
            })
        ).then((results) =>
            results.filter(
                (post) => post.image?.img !== "https://www.sherpafoodtours.com/default-og.jpg" &&
                    Array.isArray(post.relaciones.ciudades) &&
                    post.relaciones.ciudades.length > 0 &&
                    post.relaciones.ciudades[0] !== null
            )
        ) as PostWithImage[];

        return {
            category: category.name,
            posts: postsWithImage,
        }
    }))

    let formattedPosts = await wp.getAllPost(9);
    formattedPosts = await Promise.all(formattedPosts.map(async (post: WPPost) => {
        const image = await wp.getPostImage(post.featured_media);
        return {
            ...post,
            image,
        }
    }))

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
            <section className="travel-guide-second-section" id="travel-guide">
                <div className="second-section-main-container">
                    <CitiesDropdown cities={cities} />
                    <div className="input-container">
                        <div className="input">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                                <path d="M8.2181 14.1691C11.5433 14.1691 14.2389 11.4735 14.2389 8.14827C14.2389 4.82307 11.5433 2.12744 8.2181 2.12744C4.8929 2.12744 2.19727 4.82307 2.19727 8.14827C2.19727 11.4735 4.8929 14.1691 8.2181 14.1691Z" stroke="#0A4747" strokeWidth="1.41667" strokeLinejoin="round" />
                                <path d="M10.2218 5.79079C9.70905 5.27806 9.00072 4.96094 8.21829 4.96094C7.4359 4.96094 6.72757 5.27806 6.21484 5.79079" stroke="#0A4747" strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12.5469 12.4771L15.5521 15.4823" stroke="#0A4747" strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <input type="text" name="search" id="search" placeholder="Best bars in Mexico City" aria-label="Search travel guide articles" />
                        </div>
                    </div>
                    <div className="filter-container">
                        <button aria-label="Filter travel guide articles">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                                <path d="M6.44727 13.8149L15.6556 13.8149" stroke="#0A4747" strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M11.0527 9.21094L15.6569 9.21094" stroke="#0A4747" strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M7.51042 9.21094L2.90625 9.21094" stroke="#0A4747" strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2.90625 4.60693L12.1146 4.60693" stroke="#0A4747" strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M6.44792 13.8151C6.44792 12.8371 5.65508 12.0443 4.67708 12.0443C3.69908 12.0443 2.90625 12.8371 2.90625 13.8151C2.90625 14.7931 3.69908 15.5859 4.67708 15.5859C5.65508 15.5859 6.44792 14.7931 6.44792 13.8151Z" stroke="#0A4747" strokeWidth="1.41667" strokeLinejoin="round" />
                                <path d="M11.0514 9.2111C11.0514 8.2331 10.2586 7.44027 9.2806 7.44027C8.3026 7.44027 7.50977 8.2331 7.50977 9.2111C7.50977 10.1891 8.3026 10.9819 9.2806 10.9819C10.2586 10.9819 11.0514 10.1891 11.0514 9.2111Z" stroke="#0A4747" strokeWidth="1.41667" strokeLinejoin="round" />
                                <path d="M15.6569 4.60661C15.6569 3.62861 14.8641 2.83577 13.8861 2.83577C12.9081 2.83577 12.1152 3.62861 12.1152 4.60661C12.1152 5.5846 12.9081 6.37744 13.8861 6.37744C14.8641 6.37744 15.6569 5.5846 15.6569 4.60661Z" stroke="#0A4747" strokeWidth="1.41667" strokeLinejoin="round" />
                            </svg>
                            Filtrar
                        </button>
                    </div>
                    <div className="icons">
                        <FiltersDropdown />
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-label="Search icon">
                            <path d="M8.2181 14.1691C11.5433 14.1691 14.2389 11.4735 14.2389 8.14827C14.2389 4.82307 11.5433 2.12744 8.2181 2.12744C4.8929 2.12744 2.19727 4.82307 2.19727 8.14827C2.19727 11.4735 4.8929 14.1691 8.2181 14.1691Z" stroke="#0A4747" strokeWidth="1.41667" strokeLinejoin="round" />
                            <path d="M10.2218 5.79079C9.70905 5.27806 9.00072 4.96094 8.21829 4.96094C7.4359 4.96094 6.72757 5.27806 6.21484 5.79079" stroke="#0A4747" strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12.5469 12.4771L15.5521 15.4823" stroke="#0A4747" strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </section>
            <hr className="travel-guide-separator" />
            <section className="travel-guide-third-section-main-container">

                {/* First Section */}
                <>
                    <div className="travel-guide-third-section">
                        {formattedPosts.map((post: PostWithImage, i: number) => {
                            let slug;

                            if (post.relaciones.ciudades && post.relaciones.ciudades.length > 0) {
                                slug = post.relaciones.ciudades[0]!.title;

                            } else {
                                slug = null
                            }

                            let url = null;

                            if (!slug) {
                                url = "/travel-guide"
                            } else {
                                url = `/travel-guide/${slugify(post.relaciones.ciudades[0]!.title)}/${post.slug}`
                            }

                            // Clean title for better SEO
                            const cleanTitle = post.title.rendered.replace(/<[^>]*>/g, '');
                            const imageAlt = `${cleanTitle} - ${slug || 'Sherpa Food Tours'}`;

                            // ------------------
                            // SOLO PARA MOBILE
                            // ------------------

                            // Render del primer elemento
                            if (i === 0) {
                                return (
                                    <div className={`preview-wrapper element-${i}`} key={post.id}>
                                        <Link className="preview-item" href={url}>
                                            <div className="preview-image-container">
                                                <img 
                                                    decoding="async" 
                                                    src={post.image.img} 
                                                    alt={imageAlt}
                                                    width="400" 
                                                    height="300"
                                                    loading="eager"
                                                />
                                                <p className="preview-city">{slug}</p>
                                            </div>
                                            <div className="preview-data">
                                                <h3 dangerouslySetInnerHTML={{ __html: post.title.rendered }}></h3>
                                                <div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} className="description"></div>
                                                <p className="preview-author"><span>Por: </span>{post.author}</p>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            }

                            // // Render del grupo de i === 1 y i === 2
                            if (i === 1) {
                                return (
                                    <div className="preview-wrapper-group" key="group-1-2">
                                        {[formattedPosts[1], formattedPosts[2]].map((p) => {
                                            const s = p.relaciones?.ciudades?.[0]?.title || null;
                                            const u = s
                                                ? `/travel-guide/${slugify(s)}/${p.slug}`
                                                : "/travel-guide";
                                            const cleanTitleGroup = p.title.rendered.replace(/<[^>]*>/g, '');
                                            const imageAltGroup = `${cleanTitleGroup} - ${s || 'Sherpa Food Tours'}`;

                                            return (
                                                <div className="preview-wrapper" key={p.id}>
                                                    <Link className="preview-item" href={u}>
                                                        <div className="preview-image-container">
                                                            <img 
                                                                decoding="async" 
                                                                src={p.image.img} 
                                                                alt={imageAltGroup}
                                                                width="400" 
                                                                height="300"
                                                                loading="eager"
                                                            />
                                                            <p className="preview-city">{s}</p>
                                                        </div>
                                                        <div className="preview-data">
                                                            <h3 dangerouslySetInnerHTML={{ __html: p.title.rendered }}></h3>
                                                            <p className="preview-author"><span>Por: </span>{p.author}</p>
                                                        </div>
                                                    </Link>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            }

                            // // Elementos con i > 2
                            if (i > 2) {
                                return (
                                    <div className="preview-wrapper list" key={post.id}>
                                        <Link className="preview-item" href={url}>
                                            <div className="preview-image-container">
                                                <img 
                                                    decoding="async" 
                                                    src={post.image.img} 
                                                    alt={imageAlt}
                                                    width="400" 
                                                    height="300"
                                                    loading="lazy"
                                                />
                                                <p className="preview-city">{slug}</p>
                                            </div>
                                            <div className="preview-data">
                                                <h3>{cleanTitle}</h3>
                                                <p className="preview-author"><span>Por: </span>{post.author}</p>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            }

                            return null;
                        })}
                    </div>
                    <Link href="#travel-guide" className="show-more" aria-label="Show more travel guide articles">Show more</Link>
                </>

                {/* Second Section */}
                {data.map((element, i) => (
                    <div className="category-container" key={element.category + i}>
                        <h2 className="category-title">{element.category}</h2>
                        <div className="travel-guide-third-section">
                            {element.posts.map((post: PostWithImage, postIndex: number) => {
                                let slug;

                                if (post.relaciones.ciudades && post.relaciones.ciudades.length > 0) {
                                    slug = post.relaciones.ciudades[0]!.title;
                                } else {
                                    slug = null
                                }

                                let url = null;

                                if (!slug) {
                                    url = "/travel-guide"
                                } else {
                                    url = `/travel-guide/${slugify(post.relaciones.ciudades[0]!.title)}/${post.slug}`
                                }

                                const cleanTitleCategory = post.title.rendered.replace(/<[^>]*>/g, '');
                                const imageAltCategory = `${cleanTitleCategory} - ${slug || 'Sherpa Food Tours'}`;

                                return (
                                    <div className={`preview-wrapper`} key={post.id}>
                                        <Link className="preview-item" href={url}>
                                            <div className="preview-image-container">
                                                <img 
                                                    decoding="async" 
                                                    src={post.image.img} 
                                                    alt={imageAltCategory}
                                                    width="400" 
                                                    height="300"
                                                    loading={postIndex < 3 ? "eager" : "lazy"}
                                                />
                                                <p className="preview-city">{slug}</p>
                                            </div>
                                            <div className="preview-data">
                                                <h3 dangerouslySetInnerHTML={{ __html: post.title.rendered }}></h3>
                                                <p className="preview-author"><span>Por: </span>{post.author}</p>
                                            </div>
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>
                        <Link href={`/travel-guide#${slugify(element.category)}`} className="show-more" aria-label={`Show more ${element.category} articles`}>Show more</Link>
                    </div>
                ))}
            </section>
            </article>
        </>
    )
}


export const revalidate = 86400;