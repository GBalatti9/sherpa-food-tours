"use client";

import { slugify } from "@/app/helpers/slugify";
import CitiesDropdown from "@/ui/components/cities-dropdown";
import FiltersDropdown from "@/ui/components/filter-dropdown";
import Link from "next/link";
import { PostWithImage } from "../page";
import { useEffect, useState, useRef } from "react";
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
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
    const [selectedFilterId, setSelectedFilterId] = useState<number | null>(null);
    const [isLoadingCityPosts, setIsLoadingCityPosts] = useState(false);
    const [isLoadingSearch, setIsLoadingSearch] = useState(false);
    const [isLoadingCategory, setIsLoadingCategory] = useState(false);

    const [allArticles, setAllArticles] = useState<PostWithImage[] | null>();
    const [filteredArticles, setFilteredArticles] = useState<PostWithImage[] | null>(null);

    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setAllArticles(formattedPosts);
    }, [formattedPosts])

    // Debounce para la búsqueda
    useEffect(() => {
        // Limpiar el timer anterior si existe
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Si el searchQuery está vacío, resetear inmediatamente
        if (!searchQuery.trim()) {
            setDebouncedSearchQuery("");
            return;
        }

        // Crear un nuevo timer para el debounce (500ms)
        debounceTimerRef.current = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);

        // Cleanup function
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [searchQuery])

    // Efecto para hacer la búsqueda cuando debouncedSearchQuery cambie
    useEffect(() => {
        if (!debouncedSearchQuery.trim()) {
            // Si no hay búsqueda, restaurar los posts originales o los de la ciudad seleccionada
            setIsLoadingSearch(false);
            if (citySelectedId) {
                // Si hay una ciudad seleccionada, recargar los posts de esa ciudad
                // Esto se manejará cuando se seleccione la ciudad, no aquí
                return;
            }
            // Si no hay ciudad seleccionada, restaurar posts originales
            setAllArticles(formattedPosts);
            return;
        }

        const performSearch = async () => {
            setIsLoadingSearch(true);
            try {
                // Si hay una ciudad seleccionada, combinar búsqueda con ciudad
                if (citySelectedId) {
                    // Hacer búsqueda dentro de los posts de la ciudad
                    // Primero obtener los posts de la ciudad, luego filtrar por búsqueda
                    const idsResponse = await wp.getPostsIdsByCityId(citySelectedId);
                    if (idsResponse.ok && idsResponse.data && idsResponse.data.length > 0) {
                        const postsResponse = await wp.getPostsByPostsId(idsResponse.data);
                        if (postsResponse.ok && postsResponse.data) {
                            // Filtrar los posts por búsqueda localmente
                            const searchLower = debouncedSearchQuery.toLowerCase();
                            const filtered = postsResponse.data.filter((post: WPPost) => {
                                const title = post.title.rendered.replace(/<[^>]*>/g, '').toLowerCase();
                                const excerpt = post.excerpt.rendered.replace(/<[^>]*>/g, '').toLowerCase();
                                return title.includes(searchLower) || excerpt.includes(searchLower);
                            });

                            // Formatear los posts filtrados
                            const formattedSearchPosts = await Promise.all(
                                filtered.map(async (post: WPPost) => {
                                    const image = await wp.getPostImage(post.featured_media);
                                    const author = await wp.getAuthor(post.author);
                                    return {
                                        ...post,
                                        image,
                                        author_name: author,
                                    } as PostWithImage;
                                })
                            );

                            const validPosts = formattedSearchPosts.filter(
                                (post: PostWithImage) =>
                                    post.image?.img !== "https://www.sherpafoodtours.com/default-og.jpg" &&
                                    Array.isArray(post.relaciones.ciudades) &&
                                    post.relaciones.ciudades.length > 0 &&
                                    post.relaciones.ciudades[0] !== null
                            ) as PostWithImage[];

                            setAllArticles(validPosts);
                            setIsLoadingSearch(false);
                            return;
                        }
                    }
                }

                // Búsqueda general sin filtro de ciudad
                const response = await wp.getPostsBySearch(debouncedSearchQuery);

                if (response.ok && response.data && response.data.length > 0) {
                    // Formatear los posts con imagen y autor
                    const formattedSearchPosts = await Promise.all(
                        response.data.map(async (post: WPPost) => {
                            const image = await wp.getPostImage(post.featured_media);
                            const author = await wp.getAuthor(post.author);
                            return {
                                ...post,
                                image,
                                author_name: author,
                            } as PostWithImage;
                        })
                    );

                    // Filtrar posts con imágenes válidas y ciudades
                    const validPosts = formattedSearchPosts.filter(
                        (post: PostWithImage) =>
                            post.image?.img !== "https://www.sherpafoodtours.com/default-og.jpg" &&
                            Array.isArray(post.relaciones.ciudades) &&
                            post.relaciones.ciudades.length > 0 &&
                            post.relaciones.ciudades[0] !== null
                    ) as PostWithImage[];

                    setAllArticles(validPosts);
                } else {
                    // Si no hay resultados, mostrar array vacío
                    setAllArticles([]);
                }
            } catch (error) {
                console.error("Error fetching search posts:", error);
                // En caso de error, mantener los posts actuales o restaurar los originales
                if (!citySelectedId) {
                    setAllArticles(formattedPosts);
                }
            } finally {
                setIsLoadingSearch(false);
            }
        };

        performSearch();
    }, [debouncedSearchQuery, citySelectedId, formattedPosts])

    useEffect(() => {
    
        // Si estamos cargando, no hacer nada (evitar conflictos)
        if (isLoadingCategory || isLoadingSearch || isLoadingCityPosts) {
            return;
        }

        // Si hay un selectedFilterId, significa que se hizo fetch por categoría
        // En ese caso, allArticles ya tiene los posts correctos y filteredArticles ya fue establecido en onFilterChange
        // Solo actualizar si allArticles cambió y filteredArticles no coincide
        if (selectedFilterId && allArticles && Array.isArray(allArticles) && allArticles.length > 0) {
            // Verificar si filteredArticles ya está actualizado
            if (filteredArticles && filteredArticles.length === allArticles.length) {
                return;
            }
            // Si no coincide, actualizar
            setFilteredArticles(allArticles);
            return;
        }

        if (!allArticles) {
            setFilteredArticles(null);
            return;
        }

        if (Array.isArray(allArticles) && allArticles.length === 0) {
            // Si no hay artículos pero hay filtros activos, mostrar array vacío
            if (selectedFilter || citySelected || debouncedSearchQuery.trim()) {
                setFilteredArticles([]);
            } else {
                setFilteredArticles(null);
            }
            return;
        }

        // If no filters active, show nothing (default view)
        if (!citySelected && !debouncedSearchQuery.trim() && !selectedFilter) {
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

        // Filter by category - si selectedFilterId está establecido, los posts ya vienen filtrados del API
        // Solo filtrar localmente si no se hizo fetch por categoría
        if (selectedFilter && !selectedFilterId) {
            const filterLower = selectedFilter.toLowerCase();
            results = results.filter(post => {
                // @ts-expect-error - categoryName is added dynamically
                const categoryName = post.categoryName?.toLowerCase();
                return categoryName === filterLower;
            });
        }

        // Filter by search query (title and excerpt) - solo si no se hizo búsqueda por API
        // Si debouncedSearchQuery está vacío, significa que no hay búsqueda activa por API
        if (debouncedSearchQuery.trim() && !isLoadingSearch) {
            // Los posts ya vienen filtrados del API, no necesitamos filtrar de nuevo
            // Pero podemos hacer un filtrado adicional si es necesario
        }

        setFilteredArticles(results.length > 0 ? results : []);
    }, [citySelected, debouncedSearchQuery, selectedFilter, allArticles, isLoadingSearch, selectedFilterId, isLoadingCategory, isLoadingCityPosts])



    const onSelectCity = async (id: number, slug: string, value: string) => {
        setCitySelected(value);
        setCitySelectedId(id);
        setIsLoadingCityPosts(true);

        try {
            // Paso 1: Obtener los IDs de los posts de la ciudad
            const idsResponse = await wp.getPostsIdsByCityId(id);

            if (!idsResponse.ok || !idsResponse.data || idsResponse.data.length === 0) {
                // Si no hay posts, mantener los posts originales
                setAllArticles(formattedPosts);
                setIsLoadingCityPosts(false);
                return;
            }

            // Paso 2: Obtener los posts completos usando los IDs
            const postsResponse = await wp.getPostsByPostsId(idsResponse.data);

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

    const onFilterChange = async (filter: string | null, categoryId?: number | null) => {
        setSelectedFilter(filter);
        setSelectedFilterId(categoryId || null);

        if (!filter || !categoryId) {
            // Si se limpia el filtro, restaurar posts originales o los de la ciudad/búsqueda actual
            if (citySelectedId) {
                // Recargar posts de la ciudad si hay una seleccionada
                const idsResponse = await wp.getPostsIdsByCityId(citySelectedId);
                if (idsResponse.ok && idsResponse.data && idsResponse.data.length > 0) {
                    const postsResponse = await wp.getPostsByPostsId(idsResponse.data);
                    if (postsResponse.ok && postsResponse.data) {
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
                        const validPosts = formattedCityPosts.filter(
                            (post: PostWithImage) =>
                                post.image?.img !== "https://www.sherpafoodtours.com/default-og.jpg" &&
                                Array.isArray(post.relaciones.ciudades) &&
                                post.relaciones.ciudades.length > 0 &&
                                post.relaciones.ciudades[0] !== null
                        ) as PostWithImage[];
                        setAllArticles(validPosts);
                        setFilteredArticles(validPosts.length > 0 ? validPosts : []);
                    }
                }
            } else if (debouncedSearchQuery.trim()) {
                // Si hay búsqueda activa, mantener esos posts
                // El useEffect de búsqueda ya maneja esto
                return;
            } else {
                // Restaurar posts originales y resetear filteredArticles para mostrar vista por defecto
                setAllArticles(formattedPosts);
                setFilteredArticles(null); // null muestra la vista por defecto (InfiniteScroll)
            }
            return;
        }

        // Hacer fetch de posts por categoría
        setIsLoadingCategory(true);
        try {
            const response = await wp.getPostsByCategory(categoryId, 100, 0);

            if (response.ok && response.data && response.data.length > 0) {
                // Formatear los posts con imagen y autor
                const formattedCategoryPosts = await Promise.all(
                    response.data.map(async (post: WPPost) => {
                        const image = await wp.getPostImage(post.featured_media);
                        const author = await wp.getAuthor(post.author);
                        return {
                            ...post,
                            image,
                            author_name: author,
                        } as PostWithImage;
                    })
                );

                // Filtrar posts con imágenes válidas y ciudades
                let validPosts = formattedCategoryPosts.filter(
                    (post: PostWithImage) =>
                        post.image?.img !== "https://www.sherpafoodtours.com/default-og.jpg" &&
                        Array.isArray(post.relaciones.ciudades) &&
                        post.relaciones.ciudades.length > 0 &&
                        post.relaciones.ciudades[0] !== null
                ) as PostWithImage[];

                // Si hay una ciudad seleccionada, filtrar también por ciudad
                if (citySelectedId) {
                    validPosts = validPosts.filter(post => {
                        if (post.relaciones.ciudades && post.relaciones.ciudades.length > 0) {
                            return post.relaciones.ciudades.some(city => city?.id === citySelectedId);
                        }
                        return false;
                    });
                }

                // Si hay búsqueda activa, filtrar también por búsqueda
                if (debouncedSearchQuery.trim()) {
                    const searchLower = debouncedSearchQuery.toLowerCase();
                    validPosts = validPosts.filter(post => {
                        const title = post.title.rendered.replace(/<[^>]*>/g, '').toLowerCase();
                        const excerpt = post.excerpt.rendered.replace(/<[^>]*>/g, '').toLowerCase();
                        return title.includes(searchLower) || excerpt.includes(searchLower);
                    });
                }
                
                // Establecer ambos estados al mismo tiempo
                setAllArticles(validPosts);
                // Forzar actualización inmediata de filteredArticles
                // Esto asegura que los artículos se muestren inmediatamente
                setFilteredArticles(validPosts.length > 0 ? validPosts : []);
                
            } else {
                // Si no hay resultados, mostrar array vacío
                setAllArticles([]);
                setFilteredArticles([]);
            }
        } catch (error) {
            console.error("Error fetching category posts:", error);
            setAllArticles(formattedPosts);
            setFilteredArticles(null);
        } finally {
            setIsLoadingCategory(false);
        }
    }

    const clearFilters = () => {
        setCitySelected(null);
        setCitySelectedId(null);
        setSearchQuery("");
        setDebouncedSearchQuery("");
        setSelectedFilter(null);
        setSelectedFilterId(null);
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

    if (filteredArticles !== null) {
        return (
            <section>
                {interactiveElements()}
                <section className="travel-guide-third-section-main-container">
                    {(isLoadingCityPosts || isLoadingSearch || isLoadingCategory) ? (
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
                                        url = `/travel-guide/${slugify(slug)}/${post.slug}`
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
                                // <div className="category-container">
                                //     <p>{filteredArticles?.length}HOLA selected filter true</p>
                                //     <h2 className="category-title">{selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}</h2>
                                //     <div className="travel-guide-third-section">
                                //         <p>{filteredArticles?.length}</p>
                                //         {filteredArticles?.map((post, postIndex) => {
                                //             let slug;

                                //             if (post.relaciones.ciudades && post.relaciones.ciudades.length > 0) {
                                //                 slug = post.relaciones.ciudades[0]!.title;
                                //             } else {
                                //                 slug = null
                                //             }

                                //             let url = null;

                                //             if (!slug) {
                                //                 url = "/travel-guide"
                                //             } else {
                                //                 url = `/travel-guide/${slugify(post.relaciones.ciudades[0]!.title)}/${post.slug}`
                                //             }

                                //             const cleanTitleCategory = post.title.rendered.replace(/<[^>]*>/g, '');
                                //             const imageAltCategory = `${cleanTitleCategory} - ${slug || 'Sherpa Food Tours'}`;

                                //             return (
                                //                 <div className={`preview-wrapper`} key={post.id}>
                                //                     <Link className="preview-item" href={url}>
                                //                         <div className="preview-image-container">
                                //                             <img
                                //                                 decoding="async"
                                //                                 src={post.image.img}
                                //                                 alt={imageAltCategory}
                                //                                 width="400"
                                //                                 height="300"
                                //                                 loading={postIndex < 3 ? "eager" : "lazy"}
                                //                             />
                                //                             <p className="preview-city">{slug}</p>
                                //                         </div>
                                //                         <div className="preview-data">
                                //                             <h3 dangerouslySetInnerHTML={{ __html: post.title.rendered }}></h3>
                                //                             <p className="preview-author"><span>Por: </span>{post.author_name.name}</p>
                                //                         </div>
                                //                     </Link>
                                //                 </div>
                                //             )
                                //         })}
                                //     </div>
                                // </div>
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
                {(isLoadingCityPosts || isLoadingSearch || isLoadingCategory) ? (
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