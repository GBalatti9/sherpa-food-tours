"use client";

import { slugify } from "@/app/helpers/slugify";
import CitiesDropdown from "@/ui/components/cities-dropdown";
import FiltersDropdown from "@/ui/components/filter-dropdown";
import Link from "next/link";
import { PostWithImage } from "../page";
import { useEffect, useState } from "react";
import { handleNewData } from "../actions";
import "./page-interactivity.css";

interface Props {
    cities: {
        slug: string
        city: string
        flag?: {
            alt?: string;
            img?: string;
        }
    }[],
    formattedPosts: PostWithImage[],
    data: {
        category: string;
        id: number;
        posts: PostWithImage[];
    }[],
}

export default function PageInteractivity({ cities, formattedPosts, data }: Props) {
    const [loading, setLoading] = useState<boolean>(false);
    const [articles, setArticles] = useState(data);
    const [citySelected, setCitySelected] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

    const [allArticles, setAllArticles] = useState<PostWithImage[] | null>();
    const [filteredArticles, setFilteredArticles] = useState<PostWithImage[] | null>(null);

    useEffect(() => {
        const articlesFromData = data.flatMap(item => 
            item.posts.map(post => ({
                ...post,
                categoryName: item.category // Agregar el nombre de la categoría a cada post
            }))
        );
        const uniqueArticles = articlesFromData.filter((article, index, self) =>
            index === self.findIndex(a => a.id === article.id)
        );
        setAllArticles(uniqueArticles);
    }, [])

    useEffect(() => {
        if (!allArticles) return;

        // If no filters active, show nothing (default view)
        if (!citySelected && !searchQuery.trim() && !selectedFilter) {
            setFilteredArticles(null);
            return;
        }

        let results = allArticles;

        // Filter by city
        if (citySelected) {
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
                // @ts-ignore - categoryName is added dynamically
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


    const handleClick = async (category: number) => {
        setLoading(true)

        const totalArticles = (articles.find((item) => item.id === category)?.posts.length || 0) + 1;

        const { success, data } = await handleNewData(category, 6, totalArticles);

        if (data && success) {
            setArticles((prevData) => {
                return prevData.map((item) =>
                    item.id === category
                        ? { ...item, posts: [...item.posts, ...data] }
                        : item
                );
            });
        }
        setLoading(false);
    }

    const onSelectCity = (slug: string, value: string) => {
        setCitySelected(value);
    }

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }

    const onFilterChange = (filter: string | null) => {
        setSelectedFilter(filter);
    }

    const clearFilters = () => {
        setCitySelected(null);
        setSearchQuery("");
        setSelectedFilter(null);
    }



    const interactiveElements = () => {
        return (<>
            <section className="travel-guide-second-section" id="travel-guide">
                <div className="second-section-main-container">
                    <CitiesDropdown cities={cities} onSelectCity={onSelectCity} />
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
                                    onClick={() => setCitySelected(null)}
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
                </section>
            </section>
        )
    }

    return (
        <>
            {interactiveElements()}
            <section className="travel-guide-third-section-main-container">

                {/* First Section */}
                <>
                    <div className="travel-guide-third-section">
                        {formattedPosts.map((post: PostWithImage, i: number) => {
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

                            // Clean title for better SEO
                            const cleanTitle = post.title.rendered.replace(/<[^>]*>/g, '');
                            const imageAlt = `${cleanTitle} - ${slug || 'Sherpa Food Tours'}`;

                            // ------------------
                            // SOLO PARA MOBILE
                            // ------------------

                            // Render del primer elemento
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

                            // // Render del grupo de i === 1 y i === 2
                            if (i === 1) {
                                return (
                                    <div className="preview-wrapper-group" key="group-1-2">
                                        {[formattedPosts[1], formattedPosts[2]].map((p) => {
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

                            // // Elementos con i > 2
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
                    <Link href="#travel-guide" className="show-more" aria-label="Show more travel guide articles">Show more</Link>
                </>

                {/* Second Section */}
                {articles.map((element, i) => (
                    <div className="category-container" key={element.category + i}>
                        <h2 className="category-title">{element.category}</h2>
                        <div className="travel-guide-third-section">
                            {element.posts.map((post: PostWithImage, postIndex: number) => {
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
                        <button
                            className="show-more"
                            aria-label={`Show more ${element.category} articles`}
                            onClick={() => handleClick(element.id)}>
                            {loading ? "Loading..." : "Show more"}
                        </button>
                    </div>
                ))}
            </section>
        </>
    );
};