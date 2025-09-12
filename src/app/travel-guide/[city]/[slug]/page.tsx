
import { slugify } from "@/app/helpers/slugify";
import { wp } from "@/lib/wp";
import { WPPost } from "@/types/post";
import "./travel-guide-slug.css";
import { getNotReadyToBookSection } from "@/app/utils/getNotReadyToBookSection";
import NotReadyToBook from "@/app/components/not-ready-to-book";
import TravelGuideCardsSection from "@/ui/components/travel-guide-cards-section";
import { TourRelationship } from "@/types/tour";


// ----------------------
// SEO
// ----------------------
export async function generateMetadata({ params }: { params: Promise<{ city: string; slug: string }> }) {
    const { city, slug } = await params;  // <-- await aquí
    const post = await wp.getPostInfo(slug);
    const { img, alt } = await wp.getPostImage(post.featured_media);

    const description = post.excerpt?.replace(/<[^>]+>/g, "") || post.content.replace(/<[^>]+>/g, "").slice(0, 150);
    const imageUrl = img || "https://www.sherpafoodtours.com/default-og.jpg";
    const title = post.title.rendered;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `https://www.sherpafoodtours.com/travel-guide/${city}/${slug}`,
            type: "article",
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: alt?.trim().length > 0 ? alt : title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [imageUrl],
        },
        alternates: {
            canonical: `https://www.sherpafoodtours.com/travel-guide/${city}/${slug}`,
        },
    };
}



// ----------------------
// BUILD TIME
// ----------------------
export async function generateStaticParams() {
    const posts = await wp.getAllPost();


    return posts.map((post: WPPost) => ({
        slug: post.slug,
        city: post.relaciones.ciudades[0]?.title ? slugify(post.relaciones.ciudades[0].title) : "default-city",
    }));
}

// ----------------------
// DATA
// ----------------------
export default async function BlogPost({ params }: { params: Promise<{ city: string, slug: string }> }) {

    const { city, slug } = await params;

    const { title, content, featured_media, excerpt, date, modified, relaciones } = await wp.getPostInfo(slug);
    const { img, alt } = await wp.getPostImage(featured_media);

    const { tours } = relaciones;

    const toursData = await Promise.all(tours.map(async (tour: TourRelationship) => {
        const { id } = tour;
        const tourData = await wp.getTourById(id);
        const tourImage = await wp.getPostImage(tourData.featured_media)

        console.log({ tourData, tourImage });

        return {
            ...tourData,
            image: tourImage
        }
    }))



    const imageUrl = img || "https://www.sherpafoodtours.com/default-og.jpg";
    const description = excerpt?.replace(/<[^>]+>/g, "") || content.replace(/<[^>]+>/g, "").slice(0, 150);

    const not_ready_to_book_section = await getNotReadyToBookSection();

    const renderContent = () => {
        const parts = content.split(/(\[tours-cards-section\])/g);
        return parts.map(async (part: string, index: number) => {
            // Detectamos [custom-cards-section]
            if (part === '[tours-cards-section]') {
                const toursData = await Promise.all(tours.map(async (tour: TourRelationship) => {
                    const { id } = tour;
                    const tourData = await wp.getTourById(id);
                    const tourImage = await wp.getPostImage(tourData.featured_media)

                    console.log({ tourData, tourImage });

                    return {
                        ...tourData,
                        image: tourImage
                    }
                }))

                return <TravelGuideCardsSection key={index} tours={toursData} />;
            }

            // Todo lo demás es HTML normal
            return <div key={index} dangerouslySetInnerHTML={{ __html: part }} />;
        });
    }


    return (
        <>
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        headline: title,
                        description: description,
                        image: [imageUrl],
                        author: {
                            "@type": "Person",
                            name: "Sherpa Food Tours",
                        },
                        datePublished: date,
                        dateModified: modified,
                        mainEntityOfPage: {
                            "@type": "WebPage",
                            "@id": `https://www.sherpafoodtours.com/travel-guide/${city}/${slug}`,
                        },
                    }),
                }}
            />

            {/* ARTICLE */}
            <article className="sherpa-article">
                <div className="main-img-container">
                    <img src={img} alt={alt} loading="eager" />
                </div>
                <div className="article-content">
                    <h1>{title}</h1>
                    {renderContent()}
                    {/* <div dangerouslySetInnerHTML={{ __html: content }}></div> */}
                </div>
                <TravelGuideCardsSection tours={toursData} />
                <div style={{ marginTop: '4rem', marginBottom: '4rem' }}>

                    <NotReadyToBook
                        titles={not_ready_to_book_section.titles}
                        posts={not_ready_to_book_section.posts}
                    />
                </div>
            </article>
        </>
    )

}

// export const revalidate = 86400; 


export const revalidate = false; // Completamente estático
export const dynamic = 'force-static';
export const fetchCache = 'force-cache'; // Cachea todos los fetch
export const dynamicParams = false; // No genera rutas dinámicas