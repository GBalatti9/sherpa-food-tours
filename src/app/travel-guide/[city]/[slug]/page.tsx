
import { slugify } from "@/app/helpers/slugify";
import { wp } from "@/lib/wp";
import { WPPost } from "@/types/post";
// import "./travel-guide-slug.css";
import { getNotReadyToBookSection } from "@/app/utils/getNotReadyToBookSection";
import NotReadyToBook from "@/app/components/not-ready-to-book";
import TravelGuideCardsSection from "@/ui/components/travel-guide-cards-section";
import { TourRelationship } from "@/types/tour";
import { cleanExcerpt } from "@/app/helpers/cleanExcerpt";
import { Metadata } from "next";


// ----------------------
// SEO
// ----------------------
export async function generateMetadata({ params }: { params: Promise<{ city: string; slug: string }> }): Promise<Metadata> {
    const { city, slug } = await params;  
    const post = await wp.getPostInfo(slug);
    const { img, alt } = await wp.getPostImage(post.featured_media);

    const rawDescription = post.excerpt?.replace(/<[^>]+>/g, "") || post.content.replace(/<[^>]+>/g, "").slice(0, 150);
    const description = cleanExcerpt(rawDescription);
    
    const imageUrl = img || "https://www.sherpafoodtours.com/default-og.jpg";
    const title = post.title;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.sherpafoodtours.com';
    const articleUrl = `${baseUrl}/travel-guide/${city}/${slug}`;

    // Get city name for keywords
    const cityName = post.relaciones?.ciudades?.[0]?.title || city;

    // Extract main topics from content for keywords
    const contentText = post.content.replace(/<[^>]+>/g, '').toLowerCase();
    const foodRelatedKeywords = [];
    
    // Add contextual keywords based on content
    if (contentText.includes('restaurant')) foodRelatedKeywords.push('restaurants');
    if (contentText.includes('bar') || contentText.includes('drink')) foodRelatedKeywords.push('bars', 'drinks');
    if (contentText.includes('cafe') || contentText.includes('coffee')) foodRelatedKeywords.push('cafes', 'coffee');
    if (contentText.includes('food')) foodRelatedKeywords.push('food guide', 'local food');
    if (contentText.includes('market')) foodRelatedKeywords.push('food markets');
    if (contentText.includes('street food')) foodRelatedKeywords.push('street food');

    return {
        title: `${title} | Sherpa Food Tours`,
        description,
        keywords: [
            cityName,
            `${cityName} guide`,
            `${cityName} food`,
            `${cityName} travel`,
            'travel guide',
            'food guide',
            'culinary guide',
            'local experiences',
            ...foodRelatedKeywords,
            'authentic experiences',
            'local recommendations',
            'travel tips'
        ].filter(Boolean),
        authors: [{ name: "Sherpa Food Tours" }],
        openGraph: {
            title: `${title} | Sherpa Food Tours`,
            description,
            url: articleUrl,
            siteName: "Sherpa Food Tours",
            type: "article",
            publishedTime: post.date,
            modifiedTime: post.modified,
            authors: ["Sherpa Food Tours"],
            section: "Travel Guide",
            tags: [cityName, 'food', 'travel', 'guide'],
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: alt?.trim().length > 0 ? alt : title,
                },
            ],
            locale: "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title: `${title} | Sherpa Food Tours`,
            description,
            images: [imageUrl],
            creator: "@sherpafoodtours",
        },
        alternates: {
            canonical: articleUrl,
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
}



// ----------------------
// BUILD TIME
// ----------------------
export async function generateStaticParams() {
    const posts = await wp.getAllPost();


    const formattedPosts = posts.map((post: WPPost) => ({
        slug: post.slug,
        city: post.relaciones.ciudades[0]?.title ? slugify(post.relaciones.ciudades[0].title) : "default-city",
    }));

    return formattedPosts
}

// ----------------------
// DATA
// ----------------------
export default async function BlogPost({ params }: { params: Promise<{ city: string, slug: string }> }) {

    const { city, slug } = await params;

    const { title, content, featured_media, excerpt, date, modified, relaciones } = await wp.getPostInfo(slug);
    const { img, alt } = await wp.getPostImage(featured_media);

    const { tours } = relaciones;

    const toursData = (await Promise.all(
        tours.map(async (tour: TourRelationship) => {
            if (!tour || !tour.id) return null; // ⬅️ devolvés null

            try {
                const tourData = await wp.getTourById(tour.id);
                const tourImage = await wp.getPostImage(tourData.featured_media);

                return {
                    ...tourData,
                    image: tourImage
                };
            } catch (error) {
                console.error("Error fetching tour:", tour?.id, error);
                return null;
            }
        })
    )).filter(Boolean); 





    const imageUrl = img || "https://www.sherpafoodtours.com/default-og.jpg";
    const description = excerpt?.replace(/<[^>]+>/g, "") || content.replace(/<[^>]+>/g, "").slice(0, 150);
    const cleanDescription = cleanExcerpt(description);

    const not_ready_to_book_section = await getNotReadyToBookSection();

    // Generate structured data for SEO
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.sherpafoodtours.com';
    const articleUrl = `${baseUrl}/travel-guide/${city}/${slug}`;
    const cityDisplayName = relaciones?.ciudades?.[0]?.title || city.replace(/-/g, ' ');

    // Enhanced Article Schema with more details
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": cleanDescription,
        "image": [imageUrl],
        "datePublished": date,
        "dateModified": modified,
        "author": {
            "@type": "Person",
            "name": "Sherpa Food Tours",
            "url": baseUrl
        },
        "publisher": {
            "@type": "Organization",
            "name": "Sherpa Food Tours",
            "logo": {
                "@type": "ImageObject",
                "url": `${baseUrl}/sherpa-complete-logo.png`
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": articleUrl,
        },
        "articleSection": "Travel Guide",
        "keywords": `${cityDisplayName}, food guide, travel guide, restaurants, local experiences`,
        "about": {
            "@type": "Place",
            "name": cityDisplayName,
            "description": `Food and travel guide for ${cityDisplayName}`
        }
    };

    // Breadcrumb Schema
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
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": cityDisplayName,
                "item": `${baseUrl}/travel-guide/${city}`
            },
            {
                "@type": "ListItem",
                "position": 4,
                "name": title,
                "item": articleUrl
            }
        ]
    };


    return (
        <>
            {/* JSON-LD Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            {/* ARTICLE */}
            <article className="sherpa-article" itemScope itemType="https://schema.org/Article">
                <meta itemProp="headline" content={title} />
                <meta itemProp="datePublished" content={date} />
                <meta itemProp="dateModified" content={modified} />
                <meta itemProp="author" content="Sherpa Food Tours" />
                
                <header className="main-img-container">
                    <img 
                        src={img} 
                        alt={alt || `${title} - ${cityDisplayName}`}
                        loading="eager"
                        width="1200"
                        height="600"
                        itemProp="image"
                    />
                </header>
                
                <div className="article-content" itemProp="articleBody">
                    <h1 itemProp="name">{title}</h1>
                    <div dangerouslySetInnerHTML={{ __html: content }}></div>
                </div>
                
                {(toursData && toursData.length > 0) && (
                    <section aria-label="Related tours">
                        <TravelGuideCardsSection tours={toursData} />
                    </section>
                )}
                
                <aside style={{ marginTop: '4rem', marginBottom: '4rem' }} aria-label="More travel guides">
                    <NotReadyToBook
                        titles={not_ready_to_book_section.titles}
                        posts={not_ready_to_book_section.posts}
                    />
                </aside>
            </article>
        </>
    )

}

export const revalidate = 86400;