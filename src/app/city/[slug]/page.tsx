// Optimizado: usar ISR (Incremental Static Regeneration) en lugar de force-dynamic
// Esto reduce significativamente el uso de CPU al cachear las páginas
export const revalidate = 3600; // Revalidar cada hora (1 hora = 3600 segundos)


import OurExperiencesSection from "@/app/components/our-experiences";
// import "./city.css";
import { fetchImages } from "@/app/utils/fetchImages";
import { wp } from "@/lib/wp";
import AsFeaturedIn from "@/ui/components/as-featured-in";
import BookNowButton from "@/ui/components/book-now";
import MainImage from "@/ui/components/main-image";
import JustRelax from "@/ui/components/just-relax";
import TravelGuideCardsSection from "@/ui/components/travel-guide-cards-section";
import CommentElement from "@/ui/components/comment";
import MeetLocalGuides from "@/ui/components/meet-local-guides";
import Link from "next/link";
import { formatFaqs } from "@/app/utils/formatFaqs";
import FaqSection from "@/ui/components/faq-section";
import NextAdventure from "@/ui/components/redy-next-adventure";
import { LocalGuide, LocalGuideRaw } from "@/types/local-guide";
import { extractDescription } from "@/app/helpers/extractDescription";
import ShowMoreBtn from "./show-more";
import { FormContact } from "@/ui/components/form-contact";
import { slugify } from "@/app/helpers/slugify";
import NotReadyToBook from "@/app/components/not-ready-to-book";
import { FormattedWpPost } from "@/types/post";
import TallyForm from "@/ui/components/tally-form";
import { redirect } from "next/navigation";
import FareHarborSetter from "@/context/fareharbor-setter";


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const cityBySlug = await wp.getCityBySlug(slug);

    // Si no hay datos válidos, retornar metadata por defecto
    if (!cityBySlug.acf || !cityBySlug.city_name || cityBySlug.city_name.trim() === "") {
        return {
            title: "City Not Found | Sherpa Food Tours",
            description: "City page not found",
        };
    }

    const title = cityBySlug.acf.metadata?.title?.trim().length > 0 ? cityBySlug.acf.metadata.title : `${cityBySlug.city_name} | Sherpa Food Tour`;
    const image = await wp.getPostImage(cityBySlug.featured_media);
    const description = cityBySlug.acf.metadata?.description?.trim().length > 0 ? cityBySlug.acf.metadata.description : extractDescription(cityBySlug.content)
    
    // Generate SEO keywords with focus on city name + food tours
    const cityName = cityBySlug.city_name;
    const keywords = [
        cityName, // "Buenos Aires"
        `${cityName} food tours`, // "Buenos Aires food tours" ⭐
        `food tours ${cityName}`, // "food tours Buenos Aires" ⭐
        `${cityName} culinary tours`,
        `best food tours ${cityName}`,
        `walking food tours ${cityName}`,
        `${cityName} local food`,
        `${cityName} street food`,
        `authentic food experiences ${cityName}`,
        `${cityName} food guide`,
        "food tours",
        "culinary tours",
        "local food tours",
        "authentic food experiences",
        "walking food tours",
        "street food tours",
        "food and culture tours"
    ];

    return {
        title,
        description,
        keywords,
        openGraph: {
            title,
            description,
            url: `https://www.sherpafoodtours.com/city/${slug}/`,
            type: "article",
            images: [
                {
                    url: image.img,
                    width: 1200,
                    height: 630,
                    alt: image.alt?.trim().length > 0 ? image.alt : title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [image.img],
        },
        alternates: {
            canonical: `https://www.sherpafoodtours.com/city/${slug}/`,
        },
    }

}
export async function generateStaticParams() {
    // Traer todos los slugs de las ciudades desde WP
    const cities = await wp.getAllCities(); // <--- función que devuelva [{slug: 'mexico-city'}, ...]

    const citiesFormatted = cities.map((city: { slug: string }) => ({
        slug: city.slug
    }));

    return citiesFormatted
}


export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {

    const { slug } = await params;

    const cityData = await wp.getCityBySlug(slug);
    const { acf, featured_media, content } = cityData;

    // Si no hay datos válidos, redirigir a home
    if (!acf || !cityData.city_name || cityData.city_name.trim() === "") {
        redirect('/');
    }


    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.sherpafoodtours.com';
    const cityUrl = `${baseUrl}/city/${slug}`;

    const asFeatureInImagesId = [
        acf?.first_img,
        acf?.second_img,
        acf?.third_img
    ]

    const mainImageId = [featured_media]

    const mainImage = await fetchImages(mainImageId);
    const asFeatureInImages = await fetchImages(asFeatureInImagesId);


    let embedSectionsData = null;
    if (acf?.embed_section) {
        embedSectionsData = await Promise.all(acf.embed_section.map((id: number) => wp.getEmbedSectionInfoById(id)))
    }

    let data_our_experiences_section = null;

    if (embedSectionsData && embedSectionsData.length > 0) {
        const data = embedSectionsData[0];

        const formattedData = {
            title: data.acf.title,
            items: [
                {
                    title: data.acf.first_item.title,
                    description: data.acf.first_item.description,
                    image: await wp.getPostImage(data.acf.first_item.image),
                },
                {
                    title: data.acf.second_item.title,
                    description: data.acf.second_item.description,
                    image: await wp.getPostImage(data.acf.second_item.image),
                },
                {
                    title: data.acf.third_item.title,
                    description: data.acf.third_item.description,
                    image: await wp.getPostImage(data.acf.third_item.image),
                }],
        }

        data_our_experiences_section = formattedData;
    }


    let tours = [];

    if (acf?.tour) {

        tours = await Promise.all(acf.tour.map((tour_id: number) => wp.getTourById(tour_id)))

        tours = await Promise.all(tours.map(async (tour) => {
            const tour_image = tour.featured_media;
            const tour_image_data = await wp.getPostImage(tour_image);
            return {
                ...tour,
                image: tour_image_data
            }


        }))
    }


    let comments: { stars: number; title: string; content: string; author: string; date: string; }[] = [];
    let localGuidesRaw = []
    let localGuides: LocalGuide[] = [];

    if (acf) {
        comments = Object.entries(acf).filter(([key]) => key.includes("review")).map(([, value]) => value as { stars: number; title: string; content: string; author: string; date: string; }).filter((v) => v.title && v.title.trim().length > 0).slice(0, 6);
        localGuidesRaw = await Promise.all(
            Object.entries(acf)
                .filter(([key]) => key.includes("local_guide"))
                .map(([, value]) => value as LocalGuideRaw)
                .filter(Boolean)
                .map(async (localGuide) => {
                    if (!localGuide.profile_picture || !localGuide.country_flag) return null;

                    const profile_picture = await wp.getPostImage(localGuide.profile_picture) as { img: string; alt: string };

                    const countryFlag = await wp.getPostImage(localGuide.country_flag) as { img: string; alt: string };

                    return {
                        ...localGuide,
                        profile_picture,
                        country_flag: countryFlag
                    };
                })
        ) as LocalGuide[];

        localGuides = localGuidesRaw.filter(Boolean);
    }

    let posts = [];

    let getToKnowTheCity: { titles: { title: string; content?: string; featured_media?: number }; posts: FormattedWpPost[] } = { titles: { title: "" }, posts: [] }


    if (acf?.posts) {
        // const info = await Promise.all(acf.posts.map(async (id: number) => {            
        //     const postInfo = await wp.getPostInfoById(id);
        //     const postImage = await wp.getPostImage(postInfo.featured_media);
        //     const author = await wp.getAuthor(postInfo.author);

        //     if (!postInfo.acf.ciudades) {
        //         return null;
        //     }
        //     const city_name = await wp.getCity(postInfo.acf.ciudades[0])


        //     return {
        //         ...postInfo,
        //         featured_media: postImage,
        //         author: author,
        //         city: city_name,
        //     }

        // }));

        const info = await Promise.all(acf.posts.map(async (id: number) => {
            try {
                const postInfo = await wp.getPostInfoById(id);
                if (!postInfo) return null;

                const postImage = await wp.getPostImage(postInfo.featured_media).catch(() => null);
                const author = await wp.getAuthor(postInfo.author).catch(() => null);

                const ciudades = postInfo?.acf?.ciudades;
                if (!Array.isArray(ciudades) || ciudades.length === 0) return null;

                const city_name = await wp.getCity(ciudades[0]).catch(() => null);
                if (!city_name) return null;

                return {
                    ...postInfo,
                    featured_media: postImage,
                    author,
                    city: city_name,
                };
            } catch (e) {
                console.warn("❗ Error cargando post", id, e);
                return null;
            }
        }));
        posts = info.filter(Boolean);

    }

    if (posts.length > 0) {
        getToKnowTheCity = {
            titles: { title: "Get to know the city" },
            posts: posts.map((post) => {
                return {
                    ...post,
                    title: { rendered: post.title },
                    author_name: post.author,
                    image: post.featured_media,
                    city: post.city_name,
                    city_slug: post.relaciones.ciudades[0]?.title ? slugify(post.relaciones.ciudades[0]?.title) : "sin-ciudad",
                    key: post.acf.key
                }
            }).slice(0, 3)
        }
    }



    let faqs = null;

    if (acf?.faq) {

        const { acf: faqRaw } = await wp.getFaqById(acf.faq);

        faqs = formatFaqs(faqRaw);
    }



    let fareharborLink = null;

    if (acf?.fareharbor_city_link) {
        fareharborLink = acf.fareharbor_city_link;
    }





    if (acf?.title === "") {
        return (
            <main>
                <section className="city-not-found">
                    <div className="main-section-container">
                        <div className="image-container">
                            <MainImage src={mainImage[0].img} alt={mainImage[0].alt} />
                        </div>
                    </div>
                    <div className="data-container">
                        <div className="data">
                            <div className="data-info">
                                <h1>Ciudad en construcción...</h1>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        )
    }

    // Generate structured data for SEO
    const cityImageData = await wp.getPostImage(featured_media);

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": baseUrl
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Cities",
                "item": `${baseUrl}/city`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": acf.title || cityData.city_name,
                "item": cityUrl
            }
        ]
    };

    const cityPageSchema = {
        "@context": "https://schema.org",
        "@type": "TouristDestination",
        "name": acf?.title || cityData.city_name,
        "description": acf.subheadline || extractDescription(content),
        "url": cityUrl,
        "image": cityImageData.img,
        "touristType": "Food Lovers",
    };

    return (
        <>
            <FareHarborSetter link={fareharborLink} />
            {/* JSON-LD Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(cityPageSchema) }}
            />

            <main>
                <section>
                    <div className="main-section-container">
                        <div className="image-container">
                            <MainImage src={mainImage[0].img} alt={mainImage[0].alt} />
                        </div>
                        <div className="data-container">
                            <div className="data">
                                <div className="data-info">
                                    <h1>{acf.title}</h1>
                                    <p>{acf.subheadline}</p>
                                </div>
                                <div className="ctas">
                                    <BookNowButton link={fareharborLink} />

                                    <Link href="#as-feature-in" className="view-the-experience">View the experience</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section>
                    <AsFeaturedIn asFeatureInImages={asFeatureInImages} />
                </section>
                <section className="third-section">
                    <div className="content" dangerouslySetInnerHTML={{ __html: content }}>
                    </div>
                </section>
                {data_our_experiences_section &&
                    <OurExperiencesSection
                        title={data_our_experiences_section.title}
                        items={data_our_experiences_section.items}
                    />
                }
                <section className="fourth-section" id="as-feature-in">
                    <JustRelax />
                    <TravelGuideCardsSection tours={tours} />
                </section>

                {(comments && comments.length > 0) &&
                    <section className="city-comments-section">
                        <div className="city-comments-container">
                            {comments.slice(0, 3).map((comment, i) => (
                                <CommentElement key={i} comment={comment} />
                            ))}
                        </div>

                        <ShowMoreBtn comments={comments} />
                    </section>
                }

                {localGuides.length > 0 &&
                    <section className="local-guide-section">
                        <div className="local-guide-container">
                            <MeetLocalGuides localGuides={localGuides} />
                        </div>
                    </section>
                }


                {(getToKnowTheCity && getToKnowTheCity.posts.length > 0) &&
                    <section className="home-fifth-section not-ready-to-book">
                        {/* <NotReadyToBook titles={getToKnowTheCity.titles} posts={getToKnowTheCity.posts} /> */}
                        {/* <section className="home-fifth-section not-ready-to-book" > */}
                        <div className="title-section">
                            <h4>{getToKnowTheCity.titles.title}</h4>
                            {getToKnowTheCity.titles.content &&
                                <div className="subtitle" dangerouslySetInnerHTML={{ __html: getToKnowTheCity.titles.content }}></div>
                            }
                        </div>
                        <div className="preview-wrapper">
                            {getToKnowTheCity.posts.map((post, i) => {
                                // Usar city_slug del post en lugar del slug de la ciudad actual
                                const citySlug = post.city_slug && post.city_slug !== 'undefined' && post.city_slug !== 'sin-ciudad' 
                                    ? post.city_slug 
                                    : null;
                                // const href = citySlug ? `/travel-guide/${citySlug}/${post.slug}` : `/travel-guide`;
                                const href = `${process.env.NEXT_PUBLIC_BASE_URL}/travel-guide/${slug}/${post.slug}`

                                return (
                                    <Link 
                                        className="preview-item" 
                                        key={post.image.img + i} 
                                        href={href}
                                        >
                                        <div className="preview-image-container">
                                            <img src={post.image.img} alt={post.image.alt} loading="lazy" />
                                            {post.city &&
                                                <p className="preview-city">{post.city}</p>
                                            }
                                        </div>
                                        <div className="preview-data">
                                            <span className="preview-key">{post.key}</span>
                                            <h3 dangerouslySetInnerHTML={{ __html: post.title.rendered }}></h3>
                                            <div className="preview-author">
                                                <span>Por:</span> {post.author_name.name}
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                        <Link href="https://www.sherpafoodtours.com/travel-guide" className="preview-read-all">Read The Travel Guide</Link>
                    </section>
                    // </section>
                }

                {faqs && faqs.faqs.length > 0 &&
                    <section className="faq-section-city">
                        <FaqSection faqs={faqs} />
                    </section>
                }

                <section className="next-adventure-section">
                    <NextAdventure />
                </section>

                <section className="w-full max-w-3xl mx-auto py-8 font-dk-otago">
                    <h2 className="text-[1.5rem] font-bold uppercase text-center py-6">Got any questions? <span className="text-primary">Contact Us!</span></h2>
                    {/* <FormContact /> */}
                    <div className="max-w-[700px] mx-auto">
                        <TallyForm />
                    </div>
                </section>

            </main>
        </>
    )
}

// export const revalidate = 86400;