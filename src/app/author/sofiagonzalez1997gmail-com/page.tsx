import { wp } from "@/lib/wp";
import { redirect } from "next/navigation";
import AuthorPosts from "../[user]/components/author-posts";
import { WPPost } from "@/types/post";
import { PostWithImage } from "../[user]/components/author-posts";
import "@/app/travel-guide/travel-guide.css";

export default async function SofiaGonzalezPage() {
    // Buscar el usuario con slug "sofia-gonzalez"
    const userResult = await wp.getUserBySlug("sofia-gonzalez");

    if (!userResult.ok || !userResult.data) {
        redirect('/');
    }

    const currentUser = userResult.data as {
        id: number;
        name: string;
        slug: string;
        description?: string;
        avatar_urls?: {
            [key: string]: string;
        };
        url?: string;
        meta?: any;
        acf?: any;
    };

    // Obtener los primeros 10 posts del autor
    const postsResult = await wp.getPostsByAuthorId(currentUser.id, 10, 0);

    if (!postsResult.ok || !postsResult.data || postsResult.data.length === 0) {
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
                    {currentUser.description && <p>{currentUser.description}</p>}
                    <p>No posts found.</p>
                </section>
            </article>
        );
    }

    // Formatear posts con imágenes y autor
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

