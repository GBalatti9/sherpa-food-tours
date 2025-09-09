
import OurExperiencesSection from "@/app/components/our-experiences";
import "./city.css";
import { fetchImages } from "@/app/utils/fetchImages";
import { wp } from "@/lib/wp";
import AsFeaturedIn from "@/ui/components/as-featured-in";
import BookNowButton from "@/ui/components/book-now";
import MainImage from "@/ui/components/main-image";
import JustRelax from "@/ui/components/just-relax";
import TravelGuideCardsSection from "@/ui/components/travel-guide-cards-section";
import NotReadyToBook from "@/app/components/not-ready-to-book";
import CommentElement from "@/ui/components/comment";


export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {

    const { slug } = await params;

    console.log({ slug });


    const { city_name, country_id, acf, featured_media, content } = await wp.getCityBySlug(slug);

    const asFeatureInImagesId = [
        acf.first_img,
        acf.second_img,
        acf.third_img
    ]

    const mainImageId = [featured_media]

    const mainImage = await fetchImages(mainImageId);
    const asFeatureInImages = await fetchImages(asFeatureInImagesId);

    let embedSectionsData = await Promise.all(acf.embed_section.map((id: number) => wp.getEmbedSectionInfoById(id)))
    embedSectionsData = await Promise.all(
        embedSectionsData.map(async (section) => {
            const data = section.acf;

            // asumo que first_item.image es un ID
            const firstItemImage = await wp.getPostImage(data.first_item.image);

            return {
                ...section,
                acf: {
                    ...data,
                    first_item: {
                        ...data.first_item,
                        image: firstItemImage, // acá guardás la imagen completa en lugar del id
                    },
                },
            };
        })
    );

    let tours = await Promise.all(acf.tour.map((tour_id: number) => wp.getTourById(tour_id)))
    tours = await Promise.all(tours.map(async (tour) => {
        const tour_image = tour.featured_media;
        const tour_image_data = await wp.getPostImage(tour_image);
        return {
            ...tour,
            image: tour_image_data
        }
        

    }))
    
    // const rawTours = await wp.getAllTours();
    // rawTours.forEach((tour) => {
    //     console.log({tour});
        
    // })


    // const tours = await wp.


    console.log({ acf });

    const comments = [
        {id: 0, stars: 5, title: "Wonderful Tour!", content: "Our team works closely with each restaurant to choose the plates that best represent the city’s flavors, heritage, and evolution. It’s like a multi-course dinner — across the neighborhood", author: "Sarah M.", date: "Last month"},
        {id: 1, stars: 5, title: "Wonderful Tour!", content: "Our team works closely with each restaurant to choose the plates that best represent the city’s flavors, heritage, and evolution. It’s like a multi-course dinner — across the neighborhood", author: "Sarah M.", date: "Last month"},
        {id: 2, stars: 5, title: "Wonderful Tour!", content: "Our team works closely with each restaurant to choose the plates that best represent the city’s flavors, heritage, and evolution. It’s like a multi-course dinner — across the neighborhood", author: "Sarah M.", date: "Last month"},
    ]


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
            {embedSectionsData && embedSectionsData.map((section, i) => {
                const data = section.acf;
                const first_item_data = data.first_item;

                return <OurExperiencesSection
                    key={data.title + i}
                    title={data.title}
                    content={`<h4>${first_item_data.title}</h4> <hr />  <p><span>${first_item_data.description}</span></p>`}
                    src={first_item_data.image.img}
                    alt={first_item_data.image.alt}
                />
            })}
            <section className="fourth-section">
                <JustRelax />
                <TravelGuideCardsSection tours={tours} />
                {/* <div className="tours-section">
                    {tours.reverse().map((tour, i) => (
                        <Link className="tour-card" key={tour.city + i} href={`/city/${tour.slug}`}>
                            <div className="img-container">
                                <img src={tour.image.img} alt={tour.image.alt} />
                            </div>
                            <div className="tour-data">
                                <h4>{tour.city}</h4>
                                <p>{tour.country}</p>
                            </div>
                        </Link>
                    ))}
                </div> */}
            </section>
            {/* <NotReadyToBook /> */}

            <section className="city-comments-section">
                    <div className="city-comments-container">
                        {comments.map((comment) => (
                            <CommentElement key={comment.id} comment={comment} />
                        ))}
                        <p className="show-more-comments">Show more</p>
                    </div>
            </section>
        </main>

    )
}