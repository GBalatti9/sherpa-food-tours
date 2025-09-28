import "./tour.css";

import { fetchImages } from "@/app/utils/fetchImages";
import { wp } from "@/lib/wp";
import BookNowButton from "@/ui/components/book-now";
import { Star } from "lucide-react";
import React from "react";
import CheckAvailabilityButton from "./components/check-availability-btn";
import TourHighlights from "./components/tour-highlights";
import ImageGallery from "./components/image-gallery";

interface TourCondition {
    icon: number;
    title: string;
}
interface HighlightItem {
    highlight_image: number | string;
    highlight_description: string;
}


interface StepItem {
    show_empty: boolean;
    title: string;
    mobile_img?: { img: string; alt: string };
}

interface ACFItineraryStep {
    information?: string;
    map_img?: number;
    title: string;
    subtitle?: string;
    first_item: StepItem;
    second_item: StepItem;
    third_item: StepItem;
    fourth_item: StepItem;
    fifth_item: StepItem;
}

interface ACFItinerary {
    title: string;
    itinerary_steps: {
        "a-start": ACFItineraryStep;
        "b-first-step": ACFItineraryStep;
        "c-second-step": ACFItineraryStep;
        "d-third-step": ACFItineraryStep;
        "e-fourth-step": ACFItineraryStep;
        "f-fifth-step": ACFItineraryStep;
        "z-end": ACFItineraryStep;
    }
}

interface ValidStep {
    title: string;
    information?: string;
    map: {
        img: string;
        alt: string;
    } | null;
    subtitle?: string;
    items: StepItem[];
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
    // console.log({slug});

    const { acf } = await wp.getTourBySlug(slug);
    console.log({ acf });




    const { stars, title, reviews, price, check_availability } = acf.heading_section;
    // console.log("TOUR PAGE: ",{ acf });

    const imagesId = Object.entries(acf.heading_section)
        .filter(([key]) => key.includes("image"))
        .map(([, value]) => value)
        .filter((element) => element !== "");

    let images: { img: string; alt: string }[] = [];

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

    // console.log({ reviewsFormatted });


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


    let itinerary = {
        title: "",
        items: [] as ValidStep[]
    };

    let desktopImgs: { img: string; alt: string }[] = [];

    console.log({ acf });


    if (acf.itinerary) {
        const itineraryData: ACFItinerary = acf.itinerary;
        itinerary.title = itineraryData.title;
        // Transformo el objeto en array y me quedo solo con los value
        const formattedItinerary = Object.entries(itineraryData.itinerary_steps).map(([, value]) => value);

        const filterValidSteps = formattedItinerary.filter((element) => element.title.trim().length !== 0);

        const formattedValidSteps: ValidStep[] = await Promise.all(filterValidSteps.map(async (step) => {
            const items = await Promise.all(Object.entries(step)
                .filter(([key]) => key.endsWith("_item"))
                .map(([, value]) => value)
                .filter((element) => element.show_empty || element.title.trim().length > 0)
                .map(async (element) => {
                    return {
                        ...element,
                        mobile_img: element.mobile_img ? await wp.getPostImage(element.mobile_img) : null,
                    }
                }))

            return {
                title: step.title,
                information: step.information,
                map: step.map_img ? await wp.getPostImage(step.map_img) : null,
                subtitle: step.subtitle,
                items
            }
        }))

        itinerary.items = formattedValidSteps;
    }

    console.log({ itinerary });

    if (itinerary.items.length > 0) {
        desktopImgs = itinerary.items.flatMap((element) =>
            element.items.flatMap((e) => (e.mobile_img ? [e.mobile_img] : []))
        );
    }


    console.log({ desktopImgs });





    return (
        <main>
            <section className="tour-hero-section">
                <ImageGallery images={images} />
                {/* <div className="image-gallery">
                    {images && images.slice(0, 3).map((image, i) => (
                        <div key={image.img + i} className="image-item">
                            <img src={image.img} alt={image.alt || 'Tour Image'} />
                        </div>
                    ))}
                </div> */}
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
                    {/* <div className="availability-container"> */}
                    {check_availability && <CheckAvailabilityButton />}
                    {/* </div> */}
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
            {highlightItems.length > 0 &&
                <TourHighlights title_highlight={title_highlight} highlightItems={highlightItems} />
            }

            <section className="itinerary-section">
                <div className="itinerary-container">
                    <h2 className="itinerary-title"> {itinerary.title}</h2>
                    <div className="itinerary-steps-container">
                        {itinerary.items.map((item) => (
                            <div className="itinerary-step" key={item.title}>
                                <p className="itinerary-step-title">{item.title}</p>

                                {/* Solo para START y END */}
                                {item.information &&
                                    <div className="itinerary-step-information">
                                        <img src={item?.map?.img} alt="Map pin icon" />
                                        <div className="itinerary-step-data" dangerouslySetInnerHTML={{ __html: item.information }}>
                                        </div>
                                    </div>
                                }

                                {item.subtitle && <p className="itinerary-step-subtitle">{item.subtitle}</p>}

                                <div className="stop-items-container">
                                    {item.items.map((internal_item) => (
                                        internal_item.title ?
                                            <div className="stop-item">
                                                <div className="stop-item-text" dangerouslySetInnerHTML={{ __html: internal_item.title }}></div>
                                                {internal_item.mobile_img &&
                                                    <div className="stop-item-img">
                                                        <img src={internal_item.mobile_img.img} alt={internal_item.mobile_img.alt} />
                                                    </div>
                                                }
                                            </div>
                                            : <p className="stop-item">&nbsp;</p>
                                    ))}
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    )

}

export const dynamic = "error";
export const revalidate = false;
export const dynamicParams = false;

