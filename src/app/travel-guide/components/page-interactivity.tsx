"use client";

import { slugify } from "@/app/helpers/slugify";
import CitiesDropdown from "@/ui/components/cities-dropdown";
import FiltersDropdown from "@/ui/components/filter-dropdown";
import Link from "next/link";
import { PostWithImage } from "../page";
import { useEffect, useState } from "react";
import "./page-interactivity.css";
import InfiniteScroll from "./infinite-scroll";
import { wp } from "@/lib/wp";
import { WPPost } from "@/types/post";

interface Props {
    cities: {
        id: number
        slug: string
        city: string
        flag?: {
            alt?: string;
            img?: string;
        }
    }[],
    formattedPosts: PostWithImage[],
}

const CITIES = {
    'paris': 199,
    'amsterdam': 200,
    'mexico-city': 201,
    'london': 202,
    'buenos-aires': 29,
}

export default function PageInteractivity({ cities, formattedPosts }: Props) {
    const [citySelected, setCitySelected] = useState<string | null>(null);
    const [citySelectedId, setCitySelectedId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
    const [isLoadingCityPosts, setIsLoadingCityPosts] = useState(false);

    const [allArticles, setAllArticles] = useState<PostWithImage[] | null>();
    const [filteredArticles, setFilteredArticles] = useState<PostWithImage[] | null>(null);

    useEffect(() => {
        setAllArticles(formattedPosts);
    }, [formattedPosts])

    useEffect(() => {
        if (!allArticles) return;

        // If no filters active, show nothing (default view)
        if (!citySelected && !searchQuery.trim() && !selectedFilter) {
            setFilteredArticles(null);
            return;
        }

        let results = allArticles;

        // Filter by city (only if we haven't already fetched city-specific posts)
        // When citySelectedId is set, allArticles already contains only that city's posts
        if (citySelected && !citySelectedId) {
            results = results.filter(post => {
                if (post.relaciones.ciudades && post.relaciones.ciudades.length > 0) {
                    return post.relaciones.ciudades.some(city =>
                        city?.title.toLowerCase() === citySelected.toLowerCase()
                    );
                }
                return false;
            });
        }

        // Filter by category (Drink, Eat, Explore)
        if (selectedFilter) {
            const filterLower = selectedFilter.toLowerCase();
            results = results.filter(post => {
                // @ts-expect-error - categoryName is added dynamically
                const categoryName = post.categoryName?.toLowerCase();
                return categoryName === filterLower;
            });
        }

        // Filter by search query (title and excerpt)
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            results = results.filter(post => {
                const title = post.title.rendered.replace(/<[^>]*>/g, '').toLowerCase();
                const excerpt = post.excerpt.rendered.replace(/<[^>]*>/g, '').toLowerCase();
                return title.includes(q) || excerpt.includes(q);
            });
        }

        setFilteredArticles(results.length > 0 ? results : []);
    }, [citySelected, searchQuery, selectedFilter, allArticles])



    const onSelectCity = async (id: number, slug: string, value: string) => {
        setCitySelected(value);
        setCitySelectedId(id);
        setIsLoadingCityPosts(true);

        try {
            // Paso 1: Obtener los IDs de los posts de la ciudad
            const idsResponse = await wp.getPostsIdsByCityId(id);
            console.log({ idsResponse });

            if (!idsResponse.ok || !idsResponse.data || idsResponse.data.length === 0) {
                // Si no hay posts, mantener los posts originales
                setAllArticles(formattedPosts);
                setIsLoadingCityPosts(false);
                return;
            }

            // Paso 2: Obtener los posts completos usando los IDs
            const postsResponse = await wp.getPostsByPostsId(idsResponse.data);
            console.log({ postsResponse });
            
            if (!postsResponse.ok || !postsResponse.data || postsResponse.data.length === 0) {
                // Si no se pudieron obtener los posts, mantener los posts originales
                setAllArticles(formattedPosts);
                setIsLoadingCityPosts(false);
                return;
            }

            // Paso 3: Formatear los posts con imagen y autor
            const formattedCityPosts = await Promise.all(
                postsResponse.data.map(async (post: WPPost) => {
                    const image = await wp.getPostImage(post.featured_media);
                    const author = await wp.getAuthor(post.author);
                    return {
                        ...post,
                        image,
                        author_name: author,
                    } as PostWithImage;
                })
            );

            // Paso 4: Filtrar posts con imágenes válidas y ciudades
            const validPosts = formattedCityPosts.filter(
                (post: PostWithImage) =>
                    post.image?.img !== "https://www.sherpafoodtours.com/default-og.jpg" &&
                    Array.isArray(post.relaciones.ciudades) &&
                    post.relaciones.ciudades.length > 0 &&
                    post.relaciones.ciudades[0] !== null
            ) as PostWithImage[];

            setAllArticles(validPosts);
        } catch (error) {
            console.error("Error fetching city posts:", error);
            setAllArticles(formattedPosts);
        } finally {
            setIsLoadingCityPosts(false);
        }
    }

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }

    const onFilterChange = (filter: string | null) => {
        setSelectedFilter(filter);
    }

    const clearFilters = () => {
        setCitySelected(null);
        setCitySelectedId(null);
        setSearchQuery("");
        setSelectedFilter(null);
        setAllArticles(formattedPosts);
    }



    const interactiveElements = () => {
        return (<>
            <section className="travel-guide-second-section" id="travel-guide">
                <div className="second-section-main-container">
                    <CitiesDropdown
                        cities={cities}
                        onSelectCity={onSelectCity}
                        text={isLoadingCityPosts ? "Loading..." : "Explore Our Cities"}
                    />
                    <div className="input-container">
                        <div className="input">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                                <path d="M8.2181 14.1691C11.5433 14.1691 14.2389 11.4735 14.2389 8.14827C14.2389 4.82307 11.5433 2.12744 8.2181 2.12744C4.8929 2.12744 2.19727 4.82307 2.19727 8.14827C2.19727 11.4735 4.8929 14.1691 8.2181 14.1691Z" stroke="#0A4747" strokeWidth="1.41667" strokeLinejoin="round" />
                                <path d="M10.2218 5.79079C9.70905 5.27806 9.00072 4.96094 8.21829 4.96094C7.4359 4.96094 6.72757 5.27806 6.21484 5.79079" stroke="#0A4747" strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12.5469 12.4771L15.5521 15.4823" stroke="#0A4747" strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <input
                                type="text"
                                name="search"
                                id="search"
                                placeholder="Best bars in Mexico City"
                                aria-label="Search travel guide articles"
                                value={searchQuery}
                                onChange={onSearchChange}
                            />
                        </div>
                    </div>
                    <div className="filter-container">
                        <FiltersDropdown
                            selectedFilter={selectedFilter}
                            onFilterChange={onFilterChange}
                        />
                    </div>
                    <div className="icons">
                        <FiltersDropdown
                            selectedFilter={selectedFilter}
                            onFilterChange={onFilterChange}
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-label="Search icon">
                            <path d="M8.2181 14.1691C11.5433 14.1691 14.2389 11.4735 14.2389 8.14827C14.2389 4.82307 11.5433 2.12744 8.2181 2.12744C4.8929 2.12744 2.19727 4.82307 2.19727 8.14827C2.19727 11.4735 4.8929 14.1691 8.2181 14.1691Z" stroke="#0A4747" strokeWidth="1.41667" strokeLinejoin="round" />
                            <path d="M10.2218 5.79079C9.70905 5.27806 9.00072 4.96094 8.21829 4.96094C7.4359 4.96094 6.72757 5.27806 6.21484 5.79079" stroke="#0A4747" strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12.5469 12.4771L15.5521 15.4823" stroke="#0A4747" strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
                {(citySelected || selectedFilter) && (
                    <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        maxWidth: "950px",
                        margin: "2rem auto",
                        marginTop: '0rem',
                    }}>
                        {citySelected && (
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                backgroundColor: 'var(--main-color)',
                                color: 'white',
                                borderRadius: '20px',
                                fontSize: '0.875rem',
                                fontFamily: 'var(--font-excelsior)',
                            }}>
                                <span>{citySelected}</span>
                                <button
                                    onClick={() => {
                                        setCitySelected(null);
                                        setCitySelectedId(null);
                                        setAllArticles(formattedPosts);
                                    }}
                                    aria-label={`Remove ${citySelected} filter`}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'white',
                                        cursor: 'pointer',
                                        padding: '0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: '1.2rem',
                                        lineHeight: '1',
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        )}
                        {selectedFilter && (
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                backgroundColor: 'var(--main-color)',
                                color: 'white',
                                borderRadius: '20px',
                                fontSize: '0.875rem',
                                fontFamily: 'var(--font-excelsior)',
                            }}>
                                <span>{selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}</span>
                                <button
                                    onClick={() => setSelectedFilter(null)}
                                    aria-label={`Remove ${selectedFilter} filter`}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'white',
                                        cursor: 'pointer',
                                        padding: '0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: '1.2rem',
                                        lineHeight: '1',
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        )}
                        {(searchQuery.trim() || (citySelected && selectedFilter)) && (
                            <button
                                className="show-more"
                                onClick={clearFilters}
                                aria-label="Clear all filters"
                                style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                            >
                                Clear All
                            </button>
                        )}
                    </div>
                )}
            </section>
            <hr className="travel-guide-separator" />
        </>)
    }

    if (filteredArticles !== null) {
        return (
            <section>
                {interactiveElements()}
                <section className="travel-guide-third-section-main-container">
                    {isLoadingCityPosts ? (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '4rem 2rem',
                            gap: '1rem'
                        }}>
                            <div className="loader-spinner" style={{
                                width: '48px',
                                height: '48px',
                                border: '4px solid #f3f3f3',
                                borderTop: '4px solid var(--main-color)',
                                borderRadius: '50%'
                            }}></div>
                            <p style={{
                                fontFamily: 'var(--font-excelsior)',
                                color: 'var(--title-color)',
                                fontSize: '1rem',
                                margin: 0
                            }}>Loading articles...</p>
                        </div>
                    ) : (
                        <>
                            {selectedFilter && (
                                <div className="category-container">
                                    <h2 className="category-title">{selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}</h2>
                                    <div className="travel-guide-third-section">
                                {filteredArticles?.map((post, postIndex) => {
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
                                                    <p className="preview-author"><span>Por: </span>{post.author_name.name}</p>
                                                </div>
                                            </Link>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                    {!selectedFilter && (
                        <div className="travel-guide-third-section">
                            {filteredArticles?.map((post, postIndex) => {
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
                                                <p className="preview-author"><span>Por: </span>{post.author_name.name}</p>
                                            </div>
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                        </>
                    )}
                </section>
            </section>
        )
    }

    return (
        <>
            {interactiveElements()}
            <section className="travel-guide-third-section-main-container">
                {isLoadingCityPosts ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4rem 2rem',
                        gap: '1rem'
                    }}>
                        <div className="loader-spinner" style={{
                            width: '48px',
                            height: '48px',
                            border: '4px solid #f3f3f3',
                            borderTop: '4px solid var(--main-color)',
                            borderRadius: '50%'
                        }}></div>
                        <p style={{
                            fontFamily: 'var(--font-excelsior)',
                            color: 'var(--title-color)',
                            fontSize: '1rem',
                            margin: 0
                        }}>Loading articles...</p>
                    </div>
                ) : (
                    <InfiniteScroll initialPosts={formattedPosts} />
                )}
            </section>
        </>
    );
};