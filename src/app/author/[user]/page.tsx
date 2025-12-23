import { wp } from "@/lib/wp";
import { redirect } from "next/navigation";
import AuthorPosts from "./components/author-posts";
import { WPPost } from "@/types/post";
import { PostWithImage } from "./components/author-posts";
import { Metadata } from "next";
// import "@/app/travel-guide/travel-guide.css";

export async function generateMetadata({ params }: { params: Promise<{ user: string }> }): Promise<Metadata> {
    const { user } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.sherpafoodtours.com';
    
    const allUsers = await wp.getAllUsers();
    const currentUser = allUsers.ok && allUsers.data.length 
        ? allUsers.data.find((author: { slug?: string; name: string }) => {
            const authorSlug = author.slug || author.name?.toLowerCase().replace(/\s+/g, '-');
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
    const authorDescription = currentUser.description 
        ? currentUser.description.replace(/<[^>]+>/g, '').substring(0, 160) + '...'
        : `Read articles and travel guides by ${authorName} on Sherpa Food Tours.`;

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
            url: `${baseUrl}/author/${user}`,
            siteName: "Sherpa Food Tours",
            type: "profile",
            images: [
                {
                    url: "/sherpa-complete-logo.webp",
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
            images: ["/sherpa-complete-logo.webp"],
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

        return nonAdminUsers.map((author: { slug?: string; name?: string }) => ({
            user: author.slug || author.name?.toLowerCase().replace(/\s+/g, '-') || "user"
        }));
    } catch (err) {
        console.warn("No se pudo obtener author para static params:", err);
        return [];
    }
}

export default async function AuthorPage({ params }: { params: Promise<{ user: string }> }) {
    const { user } = await params;

    const allUsers = await wp.getAllUsers();

    if (!allUsers.ok || !allUsers.data.length) {
        redirect('/');
    }

    const currentUser = allUsers.data.find((author: { slug?: string; name: string }) => {
        const authorSlug = author.slug || author.name?.toLowerCase().replace(/\s+/g, '-');
        return authorSlug === user && author.name?.toLowerCase() !== "admin";
    });

    if (!currentUser || currentUser.name?.toLowerCase() === "admin" || !currentUser.description.length) {
        redirect('/');
    }


    const postsResult = await wp.getPostsByAuthorId(currentUser.id, 10, 0);

    if (!postsResult.ok || !postsResult.data || postsResult.data.length === 0) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h1>Posts by {currentUser.name}</h1>
                <p>No posts found.</p>
            </div>
        );
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

    return (
        <article>
            <section style={{ padding: '2rem', textAlign: 'center' }}>
                <h1 style={{
                    fontFamily: 'var(--font-dk-otago)',
                    fontSize: '2.5rem',
                    marginBottom: '1rem'
                }}
                    className="pt-20">
                    {currentUser.name || 'Sofia Gonzalez'}
                </h1>
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