// import "./tour.css";

import { fetchImages } from "@/app/utils/fetchImages";
import { siteTitle, metaDescription } from "@/app/helpers/seo";
import { wp } from "@/lib/wp";
import { absoluteOptimizedUrl, optimizedUrl } from "@/lib/wp-media";
import BookNowButton from "@/ui/components/book-now";
import { Star } from "lucide-react";
import React from "react";
import CheckAvailabilityButton from "./components/check-availability-btn";
import TourHighlights from "./components/tour-highlights";
import ImageGallery from "./components/image-gallery";
import ItineraryComponent from "./components/itinerary";
import Calendar from "./components/calendar";
import { notFound } from "next/navigation";
import AskForIt from "@/ui/components/ask-for-it";
import { FormContact } from "@/ui/components/form-contact";
import TallyForm from "@/ui/components/tally-form";
import FareHarborSetter from "@/context/fareharbor-setter";
import { buildBreadcrumbSchema, getBaseUrl, ORGANIZATION_ID, parseReviewCount } from "@/lib/schema";
import Breadcrumbs from "@/ui/components/breadcrumbs";

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

// generateMetadata anterior (hardcodeado) - reemplazado por versión estandarizada con acf.metadata
// export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
//     const { slug } = await params;
//     const tour = await wp.getTourBySlug(slug);
//     const { acf } = tour;
//     const imagesId = Object.entries(acf.heading_section)
//         .filter(([key]) => key.includes("image"))
//         .map(([, value]) => value)
//         .filter((element) => element !== "");
//     const featuredImage = await fetchImages([imagesId[0]] as number[]).then(imgs => imgs[0]) || { img: '', alt: '' };
//     const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.sherpafoodtours.com';
//     const tourUrl = `${baseUrl}/tour/${slug}/`;
//     const description = tour.acf.tour_description
//         ? tour.acf.tour_description.substring(0, 160) + '...'
//         : `Book ${tour.title} with Sherpa Food Tours. Authentic culinary experience with local guides.`;
//     console.log({ title: tour.title, description })
//     return {
//         title: `${tour.title} - Food Tour | Sherpa Food Tours`,
//         description: description,
//         keywords: [tour.title, 'food tour', 'culinary experience', 'local food guide', 'authentic food tour',
//             'walking food tour', 'food tasting', 'restaurant tour', 'local cuisine', 'food adventure'],
//         authors: [{ name: "Sherpa Food Tours" }],
//         openGraph: {
//             title: `${tour.title} | Sherpa Food Tours`,
//             description: description, url: tourUrl, siteName: "Sherpa Food Tours",
//             images: [{ url: featuredImage.img || `${baseUrl}/sherpa-complete-logo.webp`, width: 1200, height: 630, alt: featuredImage.alt || tour.title }],
//             locale: "en_US", type: "website",
//         },
//         twitter: { card: "summary_large_image", title: `${tour.title} | Sherpa Food Tours`, description: description,
//             images: [featuredImage.img || `${baseUrl}/sherpa-complete-logo.webp`] },
//         alternates: { canonical: tourUrl + '/' },
//         robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
//     }
// }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const tour = await wp.getTourBySlug(slug);
    const { acf } = tour;

    if (!acf) {
        return {
            title: "Tour Not Found | Sherpa Food Tours",
            description: "Tour page not found",
        };
    }

    // El title de ACF gana si existe (es dato editorial); el fallback lo arma
    // el código y sólo suma la marca si entra en 60. La description se
    // normaliza a 157 venga de donde venga.
    const title = acf.metadata?.title?.trim().length > 0
        ? acf.metadata.title.trim()
        : siteTitle(tour.title);

    const description = metaDescription(
        acf.metadata?.description?.trim().length > 0
            ? acf.metadata.description
            : acf.tour_description
                ? acf.tour_description
                : `Book ${tour.title} with Sherpa Food Tours. Authentic culinary experience with local guides.`
    );

    const imagesId = Object.entries(acf.heading_section)
        .filter(([key]) => key.includes("image"))
        .map(([, value]) => value)
        .filter((element) => element !== "");

    const featuredImage = await fetchImages([imagesId[0]] as number[]).then(imgs => imgs[0]) || { img: '', alt: '' };

    const tourName = tour.title;
    const keywords = [
        tourName,
        `${tourName} food tour`,
        `best ${tourName}`,
        `${tourName} culinary experience`,
        `${tourName} local food`,
        'food tour',
        'culinary experience',
        'local food guide',
        'authentic food tour',
        'walking food tour',
        'street food tour',
        'food and culture tour'
    ];


    return {
        title,
        description,
        keywords,
        openGraph: {
            title,
            description,
            url: `https://www.sherpafoodtours.com/tour/${slug}/`,
            type: "website",
            images: [
                {
                    url: absoluteOptimizedUrl(featuredImage.img || `https://www.sherpafoodtours.com/sherpa-main-image.webp`, 1200),
                    width: 1200,
                    height: 630,
                    alt: featuredImage.alt?.trim().length > 0 ? featuredImage.alt : `${tour.title} - Food Tour | Sherpa Food Tours`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [absoluteOptimizedUrl(featuredImage.img || `https://www.sherpafoodtours.com/sherpa-main-image.webp`, 1200)],
        },
        alternates: {
            canonical: `https://www.sherpafoodtours.com/tour/${slug}/`,
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
        notFound();
    }
    const tour = await wp.getTourBySlug(slug);
    const { acf } = tour;

    if (!acf) {
        console.warn("Tour no encontrado para slug:", slug);
        notFound();
    }


    const { stars, title, reviews, price, check_availability } = acf.heading_section;


    const ACF_PRICE = price || acf.price;
    // Generate structured data for SEO
    const baseUrl = getBaseUrl();
    const tourUrl = `${baseUrl}/tour/${slug}/`;

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
            image: reviews.google.image ? await wp.getPostImage(reviews.google.image) : null,
            amount: reviews.google.image ? reviews.google.amount ?? 0 : null
        },
        tripadvisor: {
            image: reviews.tripadvisor.image ? await wp.getPostImage(reviews.tripadvisor.image) : null,
            amount: reviews.tripadvisor.image ? reviews.tripadvisor.amount ?? 0 : null
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
    const priceValidUntil = new Date();
    priceValidUntil.setFullYear(priceValidUntil.getFullYear() + 1);

    // El tour es la entidad primaria: Product habilita el rich result de estrellas
    // (TouristTrip no soporta aggregateRating y Google lo descarta con
    // "Review: Invalid object type for field <parent_node>"). Se mantiene TouristTrip
    // en el mismo nodo para no perder el marcado de viaje que ya validaba correctamente.
    const googleReviewCount = parseReviewCount(reviews.google.amount);
    const tripadvisorReviewCount = parseReviewCount(reviews.tripadvisor.amount);
    const totalReviewCount = googleReviewCount + tripadvisorReviewCount;
    const ratingValue = Number(stars);

    const productSchema: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": ["Product", "TouristTrip"],
        "@id": `${tourUrl}#tour`,
        "name": title,
        "description": acf.tour_description,
        "image": [absoluteOptimizedUrl(featuredImage.img, 1200)],
        "url": tourUrl,
        "brand": {
            "@type": "Brand",
            "name": "Sherpa Food Tours"
        },
        "touristType": "Food and wine travelers",
        "provider": {
            "@type": "Organization",
            "@id": ORGANIZATION_ID,
            "name": "Sherpa Food Tours",
            "url": baseUrl + "/"
        },
        ...(itinerary.items.length > 0 ? {
            "itinerary": {
                "@type": "ItemList",
                "name": itinerary.title || `${title} Itinerary`,
                "itemListElement": itinerary.items.map((step, i) => ({
                    "@type": "ListItem",
                    "position": i + 1,
                    "name": step.title
                }))
            }
        } : {}),
        ...(ACF_PRICE && ACF_PRICE !== "" && !isNaN(Number(ACF_PRICE)) ? {
            "offers": {
                "@type": "Offer",
                "price": Number(ACF_PRICE),
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock",
                "url": tourUrl,
                "validFrom": new Date().toISOString(),
                "priceValidUntil": priceValidUntil.toISOString(),
                "category": "Tours & Experiences"
            }
        } : {})
    };

    // El aggregateRating debe coincidir con lo visible en la página: las estrellas del
    // hero y el total de reseñas que se renderiza junto a ellas. Si falta el dato en WP
    // no se emite, en vez de inventar un valor.
    const hasAggregateRating = totalReviewCount > 0 && ratingValue >= 1 && ratingValue <= 5;

    if (hasAggregateRating) {
        productSchema["aggregateRating"] = {
            "@type": "AggregateRating",
            "ratingValue": ratingValue,
            "bestRating": 5,
            "worstRating": 1,
            "reviewCount": totalReviewCount
        };
    }

    const breadcrumbItems = [
        { name: "Home", url: baseUrl + "/" },
        { name: title, url: tourUrl }
    ];

    const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbItems);

    return (
        <>
            <FareHarborSetter link={acf.fareharbor?.link} />
            {/* JSON-LD Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            <main>
                <Breadcrumbs items={breadcrumbItems} />
                <section className="tour-hero-section">
                    <ImageGallery images={images} />
                    {/* <div className="image-gallery">
                    {images && images.slice(0, 3).map((image, i) => (
                        <div key={image.img + i} className="image-item">
                            <img src={optimizedUrl(image.img, 1920)} width={image.width} height={image.height} alt={image.alt || 'Tour Image'} />
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
                                    {hasAggregateRating && (
                                        <p className="rating-summary">
                                            {ratingValue.toFixed(1)} &middot; {totalReviewCount} reviews
                                        </p>
                                    )}
                                </div>
                                <h1>{title}</h1>
                            </div>
                            {reviewsFormatted.google.image && reviewsFormatted.tripadvisor.image && (
                                <div className="reviews-container">
                                    <div className="google-container">
                                        <div className="img-container">
                                            <img src={optimizedUrl(reviewsFormatted.google.image.img, 256)} width={reviewsFormatted.google.image.width} height={reviewsFormatted.google.image.height} alt={reviewsFormatted.google.image.alt} />
                                        </div>
                                        <span>|</span>
                                        <p>{reviewsFormatted.google.amount}</p>
                                    </div>
                                    <div className="tripadvisor-container">
                                        <div className="img-container">
                                            <img src={optimizedUrl(reviewsFormatted.tripadvisor.image.img, 256)} width={reviewsFormatted.tripadvisor.image.width} height={reviewsFormatted.tripadvisor.image.height} alt={reviewsFormatted.tripadvisor.image.alt} />
                                        </div>
                                        <span>|</span>
                                        <p>{reviewsFormatted.tripadvisor.amount}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="price-available">
                            {ACF_PRICE &&
                                <div className="price-container">
                                    <p>From:</p>
                                    <h2>USD{ACF_PRICE}</h2>
                                </div>
                            }
                            {acf.is_private ? (
                                <AskForIt />
                            ) : (
                                <BookNowButton
                                    link={acf.fareharbor?.link}
                                    data_tour={acf.fareharbor?.id}
                                />
                            )}
                        </div>
                        {ACF_PRICE &&
                            <div className="price-container">
                                <p>From:</p>
                                <h2>USD{ACF_PRICE}</h2>
                            </div>
                        }
                        {check_availability && <CheckAvailabilityButton link={acf.fareharbor?.link} data_tour={acf.fareharbor?.id} />}
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

                        <Calendar link={acf.calendar_widget ?? null} />
                    </div>
                </div>
                <section className="tour-conditions">
                    <div className="tour-condition-container">
                        {tourConditions.length > 0 && tourConditions.map((condition, i) => (
                            <div key={condition.title + i} className="condition-item">
                                <div className="icon-container">
                                    <img src={optimizedUrl(condition.icon.img, 64)} width={condition.icon.width} height={condition.icon.height} alt={condition.icon.alt || 'Condition Icon'} />
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

                <section className="contact-section px-8 md:text-center mx-auto">
                    <h2>Got any questions? <span>Contact Us!</span></h2>
                    {/* <FormContact /> */}
                    <div className="max-w-[700px] mx-auto" id="askForIt">
                        <TallyForm />
                    </div>
                </section>
            </main>
        </>
    )

}

export const revalidate = 86400;

