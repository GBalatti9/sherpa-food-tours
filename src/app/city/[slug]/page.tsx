
import OurExperiencesSection from "@/app/components/our-experiences";
import "./city.css";
import { fetchImages } from "@/app/utils/fetchImages";
import { wp } from "@/lib/wp";
import AsFeaturedIn from "@/ui/components/as-featured-in";
import BookNowButton from "@/ui/components/book-now";
import MainImage from "@/ui/components/main-image";
import JustRelax from "@/ui/components/just-relax";
import TravelGuideCardsSection from "@/ui/components/travel-guide-cards-section";
// import NotReadyToBook from "@/app/components/not-ready-to-book";
import CommentElement from "@/ui/components/comment";
import MeetLocalGuides from "@/ui/components/meet-local-guides";
import Link from "next/link";
import { formatFaqs } from "@/app/utils/formatFaqs";
import FaqSection from "@/ui/components/faq-section";
import NextAdventure from "@/ui/components/redy-next-adventure";
import NotReadyToBook from "@/app/components/not-ready-to-book";
import { slugify } from "@/app/helpers/slugify";

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

    const { acf, featured_media, content } = await wp.getCityBySlug(slug);

    const asFeatureInImagesId = [
        acf?.first_img,
        acf?.second_img,
        acf?.third_img
    ]

    const mainImageId = [featured_media]

    const mainImage = await fetchImages(mainImageId);
    const asFeatureInImages = await fetchImages(asFeatureInImagesId);


    let embedSectionsData = null;
    if (acf.embed_section) {
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

    console.log({ data_our_experiences_section });


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

    const comments = [
        { id: 0, stars: 5, title: "Wonderful Tour!", content: "Our team works closely with each restaurant to choose the plates that best represent the city’s flavors, heritage, and evolution. It’s like a multi-course dinner — across the neighborhood", author: "Sarah M.", date: "Last month" },
        { id: 1, stars: 5, title: "Wonderful Tour!", content: "Our team works closely with each restaurant to choose the plates that best represent the city’s flavors, heritage, and evolution. It’s like a multi-course dinner — across the neighborhood", author: "Sarah M.", date: "Last month" },
        { id: 2, stars: 5, title: "Wonderful Tour!", content: "Our team works closely with each restaurant to choose the plates that best represent the city’s flavors, heritage, and evolution. It’s like a multi-course dinner — across the neighborhood", author: "Sarah M.", date: "Last month" },
    ]

    const localGuide = acf.first_local_guide;
    const localGuideImage = await wp.getPostImage(localGuide.profile_picture);
    const countryFlag = await wp.getPostImage(localGuide.country_flag)



    const localGuideData = {
        ...localGuide,
        profile_picture: localGuideImage,
        country_flag: countryFlag
    }

    let posts = [];

    if (acf.posts) {

        posts = await Promise.all(acf.posts.map(async (id: number) => {
            const postInfo = await wp.getPostInfoById(id);

            const postImage = await wp.getPostImage(postInfo.featured_media);
            const author = await wp.getAuthor(postInfo.author);

            const city_name = await wp.getCity(postInfo.acf.ciudades[0])


            return {
                ...postInfo,
                featured_media: postImage,
                author: author,
                city: city_name,
            }

        }));
    }

    const getToKnowTheCity = {
        titles: { title: "Get to know the city" }, posts: posts.map((post) => {
            return {
                ...post,
                title: { rendered: post.title },
                author_name: post.author,
                image: post.featured_media,
                city: post.city_name,
                city_slug: post.relaciones.ciudades[0]?.title ? slugify(post.relaciones.ciudades[0]?.title) : null,
                key: post.acf.key
            }
        })
    }
    console.log({ getToKnowTheCity });

    const { acf: faqRaw } = await wp.getFaqById(76);
    console.log({ faqRaw }, "listo");

    const faqs = formatFaqs(faqRaw);




    if (acf.title === "") {
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



    return (
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
                                <BookNowButton />

                                <button className="view-the-experience">View the experience</button>
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
            <section className="fourth-section">
                <JustRelax />
                <TravelGuideCardsSection tours={tours} />
            </section>
            {/* <NotReadyToBook /> */}

            <section className="city-comments-section">
                <div className="city-comments-container">
                    {comments.map((comment) => (
                        <CommentElement key={comment.id} comment={comment} />
                    ))}
                </div>
                <p className="show-more-comments">Show more</p>
            </section>

            <section className="local-guide-section">
                <div className="local-guide-container">
                    <MeetLocalGuides localGuides={[localGuideData]} />
                </div>
            </section>

            <section className="know-the-city">
                <h2>Get to know the city</h2>
                <div className="posts-container">
                    {/* Primer post */}
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

                    {/* Grupo con post 1 y 2 */}
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

            <NotReadyToBook titles={getToKnowTheCity.titles} posts={getToKnowTheCity.posts
                ?.filter(Boolean)
                .slice(0, 3)} />
            <section className="faq-section-city">
                <FaqSection faqs={faqs} />
            </section>

            <section className="next-adventure-section">
                <NextAdventure />
            </section>

        </main>

    )
}

export const dynamic = "error";
export const revalidate = false;
export const dynamicParams = false;


    // let embedSectionsData = [];

    // if (acf?.embed_section) {

    //     embedSectionsData = await Promise.all(acf.embed_section.map((id: number) => wp.getEmbedSectionInfoById(id)))
    //     embedSectionsData = await Promise.all(
    //         embedSectionsData.map(async (section) => {
    //             const data = section.acf;

    //             // asumo que first_item.image es un ID
    //             console.log({ data });

    //             if (!data.first_item.image) return;
    //             const firstItemImage = await wp.getPostImage(data.first_item.image);

    //             return {
    //                 ...section,
    //                 acf: {
    //                     ...data,
    //                     first_item: {
    //                         ...data.first_item,
    //                         image: firstItemImage, // acá guardás la imagen completa en lugar del id
    //                     },
    //                 },
    //             };
    //         })
    //     );
    // }

    // console.log({embedSectionsData});


    

    // if (our_experiences_section && our_experiences_section.acf) {
    //     const formattedData = {
    //         title: our_experiences_section.title,
    //         items: [
    //             {
    //                 title: our_experiences_section.acf.first_item.title,
    //                 description: our_experiences_section.acf.first_item.description,
    //                 image: await wp.getPostImage(our_experiences_section.acf.first_item.image),
    //             },
    //             {
    //                 title: our_experiences_section.acf.second_item.title,
    //                 description: our_experiences_section.acf.second_item.description,
    //                 image: await wp.getPostImage(our_experiences_section.acf.second_item.image),
    //             },
    //             {
    //                 title: our_experiences_section.acf.third_item.title,
    //                 description: our_experiences_section.acf.third_item.description,
    //                 image: await wp.getPostImage(our_experiences_section.acf.third_item.image),
    //             }],
    //     }

    //     data_our_experiences_section = formattedData;

    // }
