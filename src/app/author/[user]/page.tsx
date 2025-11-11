import { wp } from "@/lib/wp";
import { redirect } from "next/navigation";
import AuthorPosts from "./components/author-posts";
import { WPPost } from "@/types/post";
import { PostWithImage } from "./components/author-posts";
// import "@/app/travel-guide/travel-guide.css";

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