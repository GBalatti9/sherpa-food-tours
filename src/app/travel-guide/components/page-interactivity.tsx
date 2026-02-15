"use client";

import { slugify } from "@/app/helpers/slugify";
import CitiesDropdown from "@/ui/components/cities-dropdown";
import FiltersDropdown from "@/ui/components/filter-dropdown";
import Link from "next/link";
import { PostWithImage } from "../page";
import { useEffect, useState, useRef } from "react";
import "./page-interactivity.css";
import InfiniteScroll from "./infinite-scroll";

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

async function fetchPosts(params: Record<string, string>): Promise<PostWithImage[]> {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/travel-guide/posts?${query}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
}

export default function PageInteractivity({ cities, formattedPosts }: Props) {
    const [citySelected, setCitySelected] = useState<string | null>(null);
    const [citySelectedId, setCitySelectedId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
    const [selectedFilterId, setSelectedFilterId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [allArticles, setAllArticles] = useState<PostWithImage[] | null>();
    const [filteredArticles, setFilteredArticles] = useState<PostWithImage[] | null>(null);

    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setAllArticles(formattedPosts);
    }, [formattedPosts])

    // Debounce for search
    useEffect(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        if (!searchQuery.trim()) {
            setDebouncedSearchQuery("");
            return;
        }

        debounceTimerRef.current = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [searchQuery])

    // Single effect to handle all filter/search/city combinations
    useEffect(() => {
        const hasCity = !!citySelectedId;
        const hasSearch = debouncedSearchQuery.trim().length > 0;
        const hasCategory = !!selectedFilterId;

        // No active filters - show default view
        if (!hasCity && !hasSearch && !hasCategory) {
            setAllArticles(formattedPosts);
            setFilteredArticles(null);
            return;
        }

        // Build API params based on active filters
        const params: Record<string, string> = {};
        if (hasCity) params.cityId = String(citySelectedId);
        if (hasSearch) params.search = debouncedSearchQuery;
        if (hasCategory) params.categoryId = String(selectedFilterId);

        let cancelled = false;
        setIsLoading(true);

        fetchPosts(params).then((posts) => {
            if (cancelled) return;
            setAllArticles(posts);
            setFilteredArticles(posts.length > 0 ? posts : []);
        }).catch(() => {
            if (cancelled) return;
            setAllArticles(formattedPosts);
            setFilteredArticles(null);
        }).finally(() => {
            if (!cancelled) setIsLoading(false);
        });

        return () => { cancelled = true; };
    }, [citySelectedId, debouncedSearchQuery, selectedFilterId, formattedPosts])


    const onSelectCity = (id: number, _slug: string, value: string) => {
        setCitySelected(value);
        setCitySelectedId(id);
    }

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }

    const onFilterChange = (filter: string | null, categoryId?: number | null) => {
        setSelectedFilter(filter);
        setSelectedFilterId(categoryId || null);
    }

    const clearFilters = () => {
        setCitySelected(null);
        setCitySelectedId(null);
        setSearchQuery("");
        setDebouncedSearchQuery("");
        setSelectedFilter(null);
        setSelectedFilterId(null);
        setAllArticles(formattedPosts);
        setFilteredArticles(null);
    }


    const interactiveElements = () => {
        return (<>
            <section className="travel-guide-second-section" id="travel-guide">
                <div className="second-section-main-container">
                    <CitiesDropdown
                        cities={cities}
                        onSelectCity={onSelectCity}
                        text={isLoading ? "Loading..." : "Explore Our Cities"}
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
                                    onClick={() => onFilterChange(null, null)}
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
                        {(debouncedSearchQuery.trim() || (citySelected && selectedFilter)) && (
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

    const renderPostCard = (post: PostWithImage, postIndex: number) => {
        let slug: string | null = null;
        if (post.relaciones.ciudades && post.relaciones.ciudades.length > 0) {
            slug = post.relaciones.ciudades[0]!.title;
        }

        const url = slug
            ? `https://www.sherpafoodtours.com/travel-guide/${slugify(slug)}/${post.slug}`
            : "https://www.sherpafoodtours.com/travel-guide";

        const cleanTitle = post.title.rendered.replace(/<[^>]*>/g, '');
        const imageAlt = `${cleanTitle} - ${slug || 'Sherpa Food Tours'}`;

        return (
            <div className="preview-wrapper" key={post.id}>
                <Link className="preview-item" href={url}>
                    <div className="preview-image-container">
                        <img
                            decoding="async"
                            src={post.image.img}
                            alt={imageAlt}
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
        );
    };

    if (filteredArticles !== null) {
        return (
            <section>
                {interactiveElements()}
                <section className="travel-guide-third-section-main-container">
                    {isLoading ? (
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
                        <div className="travel-guide-third-section">
                            {filteredArticles.map((post, i) => renderPostCard(post, i))}
                        </div>
                    )}
                </section>
            </section>
        )
    }

    return (
        <>
            {interactiveElements()}
            <section className="travel-guide-third-section-main-container">
                {isLoading ? (
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
