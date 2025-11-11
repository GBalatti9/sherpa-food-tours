// import "./tour.css";

import { fetchImages } from "@/app/utils/fetchImages";
import { wp } from "@/lib/wp";
import BookNowButton from "@/ui/components/book-now";
import { Star } from "lucide-react";
import React from "react";
import CheckAvailabilityButton from "./components/check-availability-btn";
import TourHighlights from "./components/tour-highlights";
import ImageGallery from "./components/image-gallery";
import ItineraryComponent from "./components/itinerary";
import Calendar from "./components/calendar";
import { redirect } from "next/navigation";
import AskForIt from "@/ui/components/ask-for-it";
import { FormContact } from "@/ui/components/form-contact";

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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const tour = await wp.getTourBySlug(slug);
    const { acf } = tour;

    const imagesId = Object.entries(acf.heading_section)
        .filter(([key]) => key.includes("image"))
        .map(([, value]) => value)
        .filter((element) => element !== "");

    const featuredImage = await fetchImages([imagesId[0]] as number[]).then(imgs => imgs[0]) || { img: '', alt: '' };

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.sherpafoodtours.com';
    const tourUrl = `${baseUrl}/tour/${slug}`;

    // Extract clean description
    const description = tour.acf.tour_description
        ? tour.acf.tour_description.substring(0, 160) + '...'
        : `Book ${tour.title} with Sherpa Food Tours. Authentic culinary experience with local guides.`;

    return {
        title: `${tour.title} - Food Tour | Sherpa Food Tours`,
        description: description,
        keywords: [
            tour.title,
            'food tour',
            'culinary experience',
            'local food guide',
            'authentic food tour',
            'walking food tour',
            'food tasting',
            'restaurant tour',
            'local cuisine',
            'food adventure'
        ],
        authors: [{ name: "Sherpa Food Tours" }],
        openGraph: {
            title: `${tour.title} | Sherpa Food Tours`,
            description: description,
            url: tourUrl,
            siteName: "Sherpa Food Tours",
            images: [
                {
                    url: featuredImage.img || `${baseUrl}/sherpa-complete-logo.png`,
                    width: 1200,
                    height: 630,
                    alt: featuredImage.alt || tour.title,
                },
            ],
            locale: "en_US",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: `${tour.title} | Sherpa Food Tours`,
            description: description,
            images: [featuredImage.img || `${baseUrl}/sherpa-complete-logo.png`],
        },
        alternates: {
            canonical: tourUrl,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    }
}

export async function generateStaticParams() {
    try {
        const tours = await wp.getAllTours();

        if (!tours || !tours.length) return [];

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

    if (slug === "london" || slug === "amsterdam") {
        redirect("/")
    }
    const tour = await wp.getTourBySlug(slug);
    const { acf } = tour;

    if (!acf) {
        console.warn("Tour no encontrado para slug:", slug);

        redirect("/")
    }


    const { stars, title, reviews, price, check_availability } = acf.heading_section;

    // Generate structured data for SEO
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.sherpafoodtours.com';
    const tourUrl = `${baseUrl}/tour/${slug}`;

    const imagesId = Object.entries(acf.heading_section)
        .filter(([key]) => key.includes("image"))
        .map(([, value]) => value)
        .filter((element) => element !== "");

    let images: { img: string; alt: string }[] = [];

    if (imagesId.length > 0) {
        images = await fetchImages(imagesId as number[]);
    }

    const featuredImage = images.length > 0 ? images[0] : { img: '', alt: '' };


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


    const itinerary = {
        title: "",
        items: [] as ValidStep[]
    };

    let desktopImgs: { img: string; alt: string }[] = [];


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

    if (itinerary.items.length > 0) {
        desktopImgs = itinerary.items.flatMap((element) =>
            element.items.flatMap((e) => (e.mobile_img ? [e.mobile_img] : []))
        );
    }

    // Generate TouristTrip structured data
    const touristTripSchema = {
        "@context": "https://schema.org",
        "@type": "TouristTrip",
        "name": title,
        "description": acf.tour_description,
        "image": featuredImage.img,
        "url": tourUrl,
        "offers": {
            "@type": "Offer",
            "price": price,
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": tourUrl,
            "validFrom": new Date().toISOString(),
        },
        "provider": {
            "@type": "TravelAgency",
            "name": "Sherpa Food Tours",
            "url": baseUrl,
        },
        "touristType": "Food Lovers",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": stars,
            "bestRating": "5",
            "worstRating": "1",
            "ratingCount": reviews.google.amount + reviews.tripadvisor.amount
        }
    };

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
                "name": "Tours",
                "item": `${baseUrl}/tour`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": title,
                "item": tourUrl
            }
        ]
    };

    return (
        <>
            {/* JSON-LD Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(touristTripSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

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
                        <div className="titles-container !pt-0">
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
                            {title.includes("Private") ? (
                                <AskForIt />
                            ) : (

                                <BookNowButton
                                    link={acf.fareharbor?.link ?? "https://fareharbor.com/embeds/book/sherpafoodtours_argentina/items/627977/?full-items=yes&flow=1385081"}
                                    data_tour={acf.fareharbor?.id ?? "627977"}
                                />
                            )}
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
                    <div className="calendar-container">

                        <Calendar link={acf.calendar_widget ?? null}/>
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

                <ItineraryComponent itinerary={itinerary} desktopImgs={desktopImgs} />

                <section className="contact-section px-8 md:text-center">
                    <h2>Got any questions? <span>Contact Us!</span></h2>
                    <FormContact />
                </section>
            </main>
        </>
    )

}

export const revalidate = 86400;

