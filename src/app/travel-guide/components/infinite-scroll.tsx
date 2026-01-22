"use client";

import { useState, useEffect, useCallback } from "react";
import { PostWithImage } from "../page";
import { wp } from "@/lib/wp";
import { slugify } from "@/app/helpers/slugify";
import Link from "next/link";
import { WPPost } from "@/types/post";

interface InfiniteScrollProps {
    initialPosts: PostWithImage[];
}

export default function InfiniteScroll({ initialPosts }: InfiniteScrollProps) {
    const [posts, setPosts] = useState<PostWithImage[]>(initialPosts);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    const loadMorePosts = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const nextPage = page + 1;
            const newPosts = await wp.getAllPostPaginated(10, nextPage);
            
            if (newPosts.length === 0) {
                setHasMore(false);
                setLoading(false);
                return;
            }

            const postsWithImage = await Promise.all(
                newPosts.map(async (post: WPPost) => {
                    const image = await wp.getPostImage(post.featured_media);
                    const author = await wp.getAuthor(post.author);
                    return {
                        ...post,
                        image,
                        author_name: author,
                    };
                })
            );

            const filteredPosts = postsWithImage.filter(
                (post) => post.image?.img !== "https://www.sherpafoodtours.com/default-og.jpg" &&
                    Array.isArray(post.relaciones.ciudades) &&
                    post.relaciones.ciudades.length > 0 &&
                    post.relaciones.ciudades[0] !== null
            ) as PostWithImage[];

            if (filteredPosts.length === 0) {
                // Si no hay posts válidos, intentar la siguiente página
                setPage(nextPage);
                setLoading(false);
                return;
            }

            setPosts(prev => [...prev, ...filteredPosts]);
            setPage(nextPage);
        } catch (error) {
            console.error("Error loading more posts:", error);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore, page]);

    // Removed automatic scroll detection - now using manual "Show More" button

    return (
        <>
            <div className="travel-guide-third-section">
                {posts.map((post: PostWithImage, i: number) => {
                    let slug;

                    if (post.relaciones.ciudades && post.relaciones.ciudades.length > 0 && post.relaciones.ciudades[0]?.title) {
                        slug = post.relaciones.ciudades[0].title;
                    } else {
                        slug = null;
                    }

                    let url = null;

                    if (!slug) {
                        url = "https://www.sherpafoodtours.com/travel-guide";
                    } else {
                        url = `https://www.sherpafoodtours.com/travel-guide/${slugify(slug)}/${post.slug}`;
                    }

                    const cleanTitle = post.title.rendered.replace(/<[^>]*>/g, '');
                    const imageAlt = `${cleanTitle} - ${slug || 'Sherpa Food Tours'}`;

                    // First element - full width with description
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
                                        <p className="preview-author"><span>Por: </span>{post.author_name.name}</p>
                                    </div>
                                </Link>
                            </div>
                        );
                    }

                    // Second element - group with third element
                    if (i === 1) {
                        return (
                            <div className="preview-wrapper-group" key="group-1-2">
                                {[posts[1], posts[2]].map((p) => {
                                    if (!p) return null;
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
                                                    <p className="preview-author"><span>Por: </span>{p.author_name.name}</p>
                                                </div>
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    }

                    // Elements after index 2 - list format
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
                                        <p className="preview-author"><span>Por: </span>{post.author_name.name}</p>
                                    </div>
                                </Link>
                            </div>
                        );
                    }

                    return null;
                })}
            </div>
            
            {hasMore && (
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    padding: '2rem'
                }}>
                    <button
                        className="show-more"
                        onClick={loadMorePosts}
                        disabled={loading}
                        aria-label="Load more travel guide articles"
                        style={{
                            background: 'none',
                            border: 'none',
                            padding: '0',
                            fontSize: '1rem',
                            color: loading ? '#ccc' : 'var(--main-color)',
                            textDecoration: 'underline',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'color 0.3s ease',
                            fontFamily: 'var(--font-excelsior)',
                            textAlign: 'center'
                        }}
                    >
                        {loading ? 'Loading...' : 'Show More'}
                    </button>
                </div>
            )}
            
            {!hasMore && posts.length > 10 && (
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    padding: '2rem',
                    fontSize: '1rem',
                    color: '#666'
                }}>
                    No more articles to load
                </div>
            )}
        </>
    );
}
