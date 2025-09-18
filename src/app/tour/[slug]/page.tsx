import "./tour.css";

import { fetchImages } from "@/app/utils/fetchImages";
import { wp } from "@/lib/wp";
import BookNowButton from "@/ui/components/book-now";
import { Star } from "lucide-react";
import React from "react";

interface TourCondition {
    icon: number;
    title: string;
}
interface HighlightItem {
    highlight_image: number | string;
    highlight_description: string;
}

export async function generateStaticParams() {
    try {
        const tours = await wp.getAllTours();
        if (!tours || !tours.length) return [];

        // const slugs = tours.map((tour: {slug: string}) => {
        //     const slug = tour.slug || "default-slug";
        //     console.log({slug});

        //     return slug

        // })

        return tours.map((tour: { slug: string }) => ({
            slug: tour.slug || "default-slug"
        }));
    } catch (err) {
        console.warn("No se pudo obtener tours para static params:", err);
        return [];
    }
}


export default async function TourPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    console.log({slug});

    const { acf } = await wp.getTourBySlug(slug);

    

    const { stars, title, reviews, price, check_availability } = acf.heading_section;
    console.log("TOUR PAGE: ",{ acf });

    const imagesId = Object.entries(acf.heading_section)
        .filter(([key]) => key.includes("image"))
        .map(([, value]) => value)
        .filter((element) => element !== "");

    let images;

    if (imagesId.length > 0) {
        images = await fetchImages(imagesId as number[]);
    }

    const reviewsFormatted = {
        google: {
            image: await wp.getPostImage(reviews.google.image),
            amount: reviews.google.amount ?? 0
        },
        tripadvisor: {
            image: await wp.getPostImage(reviews.tripadvisor.image),
            amount: reviews.tripadvisor.amount ?? 0
        }
    }

    const tourData = Object.entries(acf.tour_data).filter(([key]) => key.includes("item")).map(([, value]) => value).filter((element) => element !== "") as { title: string; description: string }[]

    console.log({ reviewsFormatted });


    const tourConditions = await Promise.all(
        Object.entries(acf.tour_conditions)
            .filter(([key]) => key.includes("item"))
            .map(([, value]) => value as TourCondition)
            .filter((element) => element.title !== "")
            .map(async (element) => {
                const image = await wp.getPostImage(element.icon);
                return {
                    ...element,
                    icon: image
                }
            }))


    const { title: title_highlight, ...rest } = acf.tour_hihglights;

    const highlightItems = await Promise.all(Object.entries(rest).filter(([key]) => key.includes("item")).map(([, value]) => value as HighlightItem).filter((element) => element.highlight_image !== "").map(async (element) => {
        const image = await wp.getPostImage(element.highlight_image as number);
        return {
            ...element,
            highlight_image: image
        }
    })) as { highlight_image: { img: string; alt: string }; highlight_description: string }[]



    return (
        <main>
            <section className="tour-hero-section">
                <div className="image-gallery">
                    {images && images.slice(0, 3).map((image, i) => (
                        <div key={image.img + i} className="image-item">
                            <img src={image.img} alt={image.alt || 'Tour Image'} />
                        </div>
                    ))}
                </div>
                <div className="header-container">
                    <div className="titles-container">
                        <div className="title-container">
                            <div className="stars-container">
                                {Array.from({ length: stars }).map((_, i) => (
                                    <Star key={i} fill="[#E7B53F]" />
                                ))}
                            </div>
                            <h1>{title}</h1>
                        </div>
                        <div className="reviews-container">
                            <div className="google-container">
                                <div className="img-container">
                                    <img src={reviewsFormatted.google.image.img} alt={reviewsFormatted.google.image.alt} />
                                </div>
                                <span>|</span>
                                <p>{reviewsFormatted.google.amount}</p>
                            </div>
                            <div className="tripadvisor-container">
                                <div className="img-container">
                                    <img src={reviewsFormatted.tripadvisor.image.img} alt={reviewsFormatted.tripadvisor.image.alt} />
                                </div>
                                <span>|</span>
                                <p>{reviewsFormatted.tripadvisor.amount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="price-available">
                        <div className="price-container">
                            <p>From:</p>
                            <h2>USD{price}</h2>
                        </div>
                        <BookNowButton />
                    </div>
                    <div className="price-container">
                        <p>From:</p>
                        <h2>USD{price}</h2>
                    </div>
                    <div className="availability-container">
                        {check_availability && <p>Check availability</p>}
                        <BookNowButton />
                    </div>
                </div>
            </section>
            <div className="section-container-desktop">
                <div className="left-side">
                    {tourData.length > 0 && (
                        <section className="tour-features">
                            <div className="features-container">
                                {tourData.map((item, i) => (
                                    <div key={item.title + i} className="feature-item">
                                        <div className="feature-header">
                                            {/* <div className="icon-container">
                                <img src={item.icon.img} alt={item.icon.alt || 'Icon'} />
                            </div> */}
                                            <p>{item.title}</p>
                                        </div>
                                        <p>{item.description}</p>
                                    </div>
                                ))}

                            </div>
                        </section>
                    )}
                    <section className="tour-description-section">
                        <div className="description-text">
                            {acf.tour_description
                                .split(/\r\n/)
                                .map((line: string, i: number) => (
                                    <React.Fragment key={i}>
                                        <p key={i}>{line}</p>
                                        <br />
                                    </React.Fragment>
                                ))}
                        </div>
                    </section>
                </div>
                <div className="right-side">
                    <img src="/calendar.png" alt="" />
                </div>
            </div>
            <section className="tour-conditions">
                <div className="tour-condition-container">
                    {tourConditions.length > 0 && tourConditions.map((condition, i) => (
                        <div key={condition.title + i} className="condition-item">
                            <div className="icon-container">
                                <img src={condition.icon.img} alt={condition.icon.alt || 'Condition Icon'} />
                            </div>
                            <div className="text-container">
                                <h3>{condition.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <section className="tour-highlights">
                <div className="tour-highlights-container">
                    <h2 className="highlight-title">{title_highlight}</h2>
                    <div className="highlights-container">
                        {highlightItems.length > 0 && highlightItems.map((item, i) => (
                            <div key={item.highlight_description + i} className="highlight-item">
                                <div className="highlight-image-container">
                                    <img src={item.highlight_image.img} alt={item.highlight_image.alt || 'Highlight Image'} />
                                </div>
                                <div className="highlight-text-container">
                                    <p>{item.highlight_description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    )

}

// export const revalidate = 10; // cada 10s
// export const dynamic = "auto"; // permite ISR
// export const fetchCache = "force-cache"; // cache + revalidate
// export const dynamicParams = false;

