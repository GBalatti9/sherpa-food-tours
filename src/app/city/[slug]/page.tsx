
import OurExperiencesSection from "@/app/components/our-experiences";
import "./city.css";
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


export async function generateMetadata({ params }: { params: Promise<{ city: string; slug: string }> }) {
    const { city, slug } = await params;

    const cityBySlug = await wp.getCityBySlug(slug);
    const image = await wp.getPostImage(cityBySlug.featured_media);
    const title = `${cityBySlug.city_name} | Sherpa Food Tour`;

    const description = extractDescription(cityBySlug.content)
    return {
        title: title,
        description,
        openGraph: {
            title,
            description,
            url: `https://www.sherpafoodtours.com/travel-guide/${city}/${slug}`,
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
            canonical: `https://www.sherpafoodtours.com/travel-guide/${city}/${slug}`,
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

    const showMore = false;
    const { slug } = await params;

    const cityData = await wp.getCityBySlug(slug);
    const { acf, featured_media, content } = cityData;

    console.log({content});
    

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



    // saco los null/undefined
    


    let posts = [];

    if (acf?.posts) {

        const info = await Promise.all(acf.posts.map(async (id: number) => {
            const postInfo = await wp.getPostInfoById(id);

            const postImage = await wp.getPostImage(postInfo.featured_media);
            const author = await wp.getAuthor(postInfo.author);

            if (!postInfo.acf.ciudades) {
                return null;
            }
            const city_name = await wp.getCity(postInfo.acf.ciudades[0])


            return {
                ...postInfo,
                featured_media: postImage,
                author: author,
                city: city_name,
            }

        }));
        posts = info.filter(Boolean);
    }


    //const getToKnowTheCity = {
    //    titles: { title: "Get to know the city" }, posts: posts.map((post) => {
    //        return {
    //            ...post,
    //            title: { rendered: post.title },
    //            author_name: post.author,
    //            image: post.featured_media,
    //            city: post.city_name,
    //            city_slug: post.relaciones.ciudades[0]?.title ? slugify(post.relaciones.ciudades[0]?.title) : null,
    //            key: post.acf.key
    //        }
    //    })
    //}

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
                <section id="as-feature-in">
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
                <section className="fourth-section">
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

                {posts.length > 0 &&
                    <section className="know-the-city">
                        <h2>Get to know the city</h2>
                        <div className="posts-container">
                            {posts[0] && (
                                <Link href={`/travel-guide/${posts[0].city.slug}/${posts[0].slug}`} key={0} className="post">
                                    <div className="img-container">
                                        <img src={posts[0].featured_media.img} alt="" />
                                    </div>
                                    <div className="data">
                                        <p className="key">{posts[0].acf.key}</p>
                                        <p className="title">{posts[0].title}</p>
                                        <div
                                            className="description"
                                            dangerouslySetInnerHTML={{ __html: posts[0].excerpt }}
                                        ></div>
                                        <p className="author">
                                            Por: <span>{posts[0].author.name}</span>
                                        </p>
                                    </div>
                                </Link>
                            )}

                            {posts.length > 2 && (
                                <div className="group-posts">
                                    {[posts[1], posts[2]].map((post, i) => (
                                        <Link href={`/travel-guide/${post.city.slug}/${post.slug}`} key={i} className="post">
                                            <div className="img-container">
                                                <img src={post.featured_media.img} alt="" />
                                            </div>
                                            <div className="data">
                                                <p className="key">{post.acf.key}</p>
                                                <p className="title">{post.title}</p>
                                                <p className="author">
                                                    Por: <span>{post.author.name}</span>
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}


                            {posts.slice(3).length > 0 &&
                                <div className="remainig-posts">
                                    {posts.slice(3).map((post, i) => (
                                        <Link href={`/travel-guide/${post.city.slug}/${post.slug}`} key={i} className="post">
                                            <div className="img-container">
                                                <img src={post.featured_media.img} alt="" />
                                            </div>
                                            <div className="data">
                                                <p className="title">{post.title}</p>
                                                <p className="author">
                                                    Por: <span>{post.author.name}</span>
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            }


                        </div>
                    </section>
                }
                {faqs && faqs.faqs.length > 0 &&
                    <section className="faq-section-city">
                        <FaqSection faqs={faqs} />
                    </section>
                }

                <section className="next-adventure-section">
                    <NextAdventure />
                </section>

                <section className="contact-section">
                    <h2>Got any questions? <span>Contact Us!</span></h2>
                    <FormContact />
                </section>

            </main>
        </>
    )
}

export const revalidate = 86400;