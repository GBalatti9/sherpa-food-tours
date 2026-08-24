import { wp } from "@/lib/wp";
import { metaDescription } from "@/app/helpers/seo";
import { notFound } from "next/navigation";
import AuthorPosts from "./components/author-posts";
import { WPPost } from "@/types/post";
import { PostWithImage } from "./components/author-posts";
import { Metadata } from "next";
import { buildBreadcrumbSchema, getBaseUrl, ORGANIZATION_ID } from "@/lib/schema";
import Breadcrumbs from "@/ui/components/breadcrumbs";
// import "@/app/travel-guide/travel-guide.css";

export async function generateMetadata({ params }: { params: Promise<{ user: string }> }): Promise<Metadata> {
    const { user: userParam } = await params;
    const user = (userParam ?? "").replace(/\/$/, ""); // quitar trailing slash (ej. anarodriguez/ → anarodriguez)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.sherpafoodtours.com';
    const allUsers = await wp.getAllUsers();

    const currentUser = allUsers.ok && allUsers.data.length 
        ? allUsers.data.find((author: { slug?: string; name: string }) => {
            const authorSlug = author.slug || author.name?.toLowerCase().replace(/\s+/g, "");
            return authorSlug === user && author.name?.toLowerCase() !== "admin";
        })
        : null;

    if (!currentUser) {
        return {
            title: "Author Not Found | Sherpa Food Tours",
            description: "Author page not found",
        };
    }

    const authorName = currentUser.name || 'Author';
    const authorDescription = metaDescription(
        currentUser.description
            || `Read articles and travel guides by ${authorName} on Sherpa Food Tours.`
    );

    return {
        title: `${authorName} - Author | Sherpa Food Tours`,
        description: authorDescription,
        keywords: [
            authorName,
            `${authorName} author`,
            'travel guide author',
            'food tour writer',
            'culinary guide author',
            'Sherpa Food Tours author'
        ],
        authors: [{ name: authorName }],
        openGraph: {
            title: `${authorName} - Author | Sherpa Food Tours`,
            description: authorDescription,
            url: `${baseUrl}/author/${user}/`,
            siteName: "Sherpa Food Tours",
            type: "profile",
            images: [
                {
                    url: "/sherpa-main-image.webp",
                    width: 1200,
                    height: 630,
                    alt: `${authorName} - Sherpa Food Tours Author`,
                },
            ],
            locale: "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title: `${authorName} - Author | Sherpa Food Tours`,
            description: authorDescription,
            images: ["/sherpa-main-image.webp"],
        },
        alternates: {
            canonical: `${baseUrl}/author/${user}/`,
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

export async function generateStaticParams() {
    try {
        const authors = await wp.getAllUsers();

        if (!authors.ok || !authors.data.length) return [];

        const nonAdminUsers = authors.data.filter((author: { name: string; slug?: string }) =>
            author.name?.toLowerCase() !== "admin"
        );

        // Sólo prerenderizar autores que publicaron algo: los usuarios del CMS sin
        // artículos caen en el notFound() de la página y devuelven 404.
        const withPosts = await Promise.all(
            nonAdminUsers.map(async (author: { id: number; slug?: string; name?: string }) => {
                const posts = await wp.getPostsByAuthorId(author.id, 1, 0);
                return posts.ok && posts.data.length > 0 ? author : null;
            })
        );

        return withPosts
            .filter((author): author is { id: number; slug?: string; name?: string } => author !== null)
            .map((author) => ({
                user: author.slug || author.name?.toLowerCase().replace(/\s+/g, "") || "user"
            }));
    } catch (err) {
        console.warn("No se pudo obtener author para static params:", err);
        return [];
    }
}

export default async function AuthorPage({ params }: { params: Promise<{ user: string }> }) {
    const { user: userParam } = await params;
    const user = (userParam ?? "").replace(/\/$/, ""); // quitar trailing slash (ej. anarodriguez/ → anarodriguez)

    const allUsers = await wp.getAllUsers();

    // WP caído no es un 404: propagar el error da 500, que Google reintenta
    // en vez de desindexar las páginas de autores legítimos.
    if (!allUsers.ok || !allUsers.data.length) {
        throw new Error("WP users endpoint unavailable");
    }

    const currentUser = allUsers.data.find((author: { slug?: string; name: string }) => {
        const authorSlug = author.slug || author.name?.toLowerCase().replace(/\s+/g, "");
        return authorSlug === user && author.name?.toLowerCase() !== "admin";
    });

    // El autor no existe: 404 legítimo (antes hacía 307 al home, que Google marca como soft 404).
    if (!currentUser || currentUser.name?.toLowerCase() === "admin") {
        notFound();
    }

    const postsResult = await wp.getPostsByAuthorId(currentUser.id, 10, 0);

    if (!postsResult.ok) {
        throw new Error(`WP posts endpoint unavailable for author ${currentUser.id}`);
    }

    // Usuario del CMS que nunca publicó: la página no tiene razón de existir.
    // Devolver 200 con "No posts found" es lo que Google reporta como soft 404.
    if (postsResult.data.length === 0) {
        notFound();
    }

    const formattedPosts = await Promise.all(
        postsResult.data.map(async (post: WPPost) => {
            const image = await wp.getPostImage(post.featured_media);
            const author = await wp.getAuthor(post.author);
            return {
                ...post,
                image,
                author_name: author,
            };
        })
    ) as PostWithImage[];

    const avatarUrl = currentUser.avatar_urls?.["96"] || currentUser.avatar_urls?.["48"] || currentUser.avatar_urls?.["24"];

    // ProfilePage + Person schema for E-E-A-T
    const baseUrl = getBaseUrl();
    const authorUrl = `${baseUrl}/author/${user}/`;

    const profilePageSchema = {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "mainEntity": {
            "@type": "Person",
            "@id": `${authorUrl}#person`,
            "name": currentUser.name,
            "url": authorUrl,
            ...(currentUser.description ? { "description": currentUser.description.replace(/<[^>]+>/g, '').substring(0, 200) } : {}),
            ...(avatarUrl ? { "image": avatarUrl } : {}),
            "worksFor": {
                "@type": "Organization",
                "@id": ORGANIZATION_ID,
                "name": "Sherpa Food Tours"
            }
        }
    };

    const breadcrumbItems = [
        { name: "Home", url: baseUrl + "/" },
        { name: currentUser.name, url: authorUrl }
    ];

    const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbItems);

    return (
        <article>
            {/* JSON-LD Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <Breadcrumbs items={breadcrumbItems} />
            <section style={{ padding: '2rem', textAlign: 'center' }}>
                <h1 style={{
                    fontFamily: 'var(--font-dk-otago)',
                    fontSize: '2.5rem',
                    marginBottom: '1rem'
                }}
                    className="pt-20">
                    {currentUser.name || 'Sofia Gonzalez'}
                </h1>
                {avatarUrl && (
                    <div style={{ marginBottom: '1rem' }} className="mx-auto max-w-fit">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={avatarUrl}
                            alt={currentUser.name || "Author"}
                            width={96}
                            height={96}
                            style={{ borderRadius: '50%', objectFit: 'cover' }}
                        />
                    </div>
                )}
                {currentUser.description && (
                    <div
                        style={{
                            maxWidth: '800px',
                            margin: '0 auto',
                            fontSize: '1.1rem',
                            lineHeight: '1.6',
                            color: '#333'
                        }}
                        dangerouslySetInnerHTML={{ __html: currentUser.description }}
                    />
                )}
            </section>
            <section className="travel-guide-third-section-main-container">
                <AuthorPosts
                    initialPosts={formattedPosts}
                    authorId={currentUser.id}
                />
            </section>
        </article>
    );
}