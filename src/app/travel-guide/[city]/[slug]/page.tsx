
import { slugify } from "@/app/helpers/slugify";
import { wp } from "@/lib/wp";
import { WPPost } from "@/types/post";
import "./travel-guide.css";

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

    const { title, content, featured_media, excerpt, date, modified } = await wp.getPostInfo(slug);
    const { img } = await wp.getPostImage(featured_media);

    const imageUrl = img || "https://www.sherpafoodtours.com/default-og.jpg";
    const description = excerpt?.replace(/<[^>]+>/g, "") || content.replace(/<[^>]+>/g, "").slice(0, 150);


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
                <h1>{title}</h1>
                <div dangerouslySetInnerHTML={{ __html: content }}></div>
            </article>
        </>
    )

}

export const revalidate = 86400; // 24h en segundos, literal
