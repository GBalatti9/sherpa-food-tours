import "./tour.css";

import { fetchImages } from "@/app/utils/fetchImages";
import { wp } from "@/lib/wp";
import BookNowButton from "@/ui/components/book-now";
import { Star } from "lucide-react";
import React from "react";

export async function generateStaticParas() {
    const tours = await wp.getAllTours();
    return tours.map((tour: { slug: string }) => ({
        slug: tour.slug
    }))
}


export default async function TourPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const { acf } = await wp.getTourBySlug(slug);

    const { stars, title, reviews, price, check_availability } = acf.heading_section;

    const imagesId = Object.entries(acf.heading_section).filter(([key]) => key.includes("image")).map(([_, value]) => value).filter((element) => element !== "");
    const images = await fetchImages(imagesId as number[]);

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

    const tourData = Object.entries(acf.tour_data).filter(([key]) => key.includes("item")).map(([_, value]) => value).filter((element) => element !== "")

    const tourConditions = await Promise.all(Object.entries(acf.tour_conditions).filter(([key]) => key.includes("item")).map(([_, value]) => value).filter((element) => element.title !== "").map(async (element) => {
        const image = await wp.getPostImage(element.icon);
        return {
            ...element,
            icon: image
        }
    }))

    const { title: title_highlight, ...rest } = acf.tour_hihglights;

    console.log({ title_highlight, rest });

    const highlightItems = await Promise.all(Object.entries(rest).filter(([key]) => key.includes("item")).map(([_, value]) => value).filter((element) => element.highlight_image !== "").map(async (element) => {
        const image = await wp.getPostImage(element.highlight_image);
        return {
            ...element,
            highlight_image: image
        }
    }));

    console.log({ highlightItems });






    return (
        <main>
            <section className="tour-hero-section">
                <div className="image-gallery">
                    {images.slice(0, 3).map((image, i) => (
                        <div key={image.img + i} className="image-item">
                            <img src={image.img} alt={image.alt || 'Tour Image'} />
                        </div>
                    ))}
                </div>
                <div className="header-container">
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
            {tourData.length > 0 && (
                <section className="tour-features">
                    <div className="features-container">
                        {tourData.map((item, i) => (
                            <div key={item + i} className="feature-item">
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
                    {/* <div className="info-container">
                        <div className="duration-container">
                            <p className="title">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M8.83381 16.1517C12.7458 16.1517 15.9171 12.9804 15.9171 9.06843C15.9171 5.15642 12.7458 1.98511 8.83381 1.98511C4.9218 1.98511 1.75049 5.15642 1.75049 9.06843C1.75049 12.9804 4.9218 16.1517 8.83381 16.1517Z" stroke="#116C63" strokeWidth="1.41666" strokeLinejoin="round" />
                                    <path d="M8.83685 4.81836L8.83643 9.07147L11.8395 12.0746" stroke="#116C63" strokeWidth="1.41666" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Duration
                            </p>
                            <p>{tour.acf.duration}</p>
                        </div>
                        <div className="size-container">
                            <p className="title">
                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                                    <path d="M5.31455 12.0573C6.24767 12.0573 7.00411 11.3009 7.00411 10.3678C7.00411 9.43466 6.24767 8.67822 5.31455 8.67822C4.38144 8.67822 3.625 9.43466 3.625 10.3678C3.625 11.3009 4.38144 12.0573 5.31455 12.0573Z" stroke="#116C63" strokeWidth="1.35164" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12.0729 12.0573C13.006 12.0573 13.7624 11.3009 13.7624 10.3678C13.7624 9.43466 13.006 8.67822 12.0729 8.67822C11.1397 8.67822 10.3833 9.43466 10.3833 10.3678C10.3833 11.3009 11.1397 12.0573 12.0729 12.0573Z" stroke="#116C63" strokeWidth="1.35164" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M8.69395 5.29903C9.62706 5.29903 10.3835 4.54259 10.3835 3.60948C10.3835 2.67636 9.62706 1.91992 8.69395 1.91992C7.76083 1.91992 7.00439 2.67636 7.00439 3.60948C7.00439 4.54259 7.76083 5.29903 8.69395 5.29903Z" stroke="#116C63" strokeWidth="1.35164" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M8.69377 15.4365C8.69377 13.5703 7.18087 12.0574 5.31466 12.0574C3.44842 12.0574 1.93555 13.5703 1.93555 15.4365" stroke="#116C63" strokeWidth="1.35164" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M15.4521 15.4365C15.4521 13.5703 13.9392 12.0574 12.073 12.0574C10.2067 12.0574 8.69385 13.5703 8.69385 15.4365" stroke="#116C63" strokeWidth="1.35164" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12.0732 8.67818C12.0732 6.81197 10.5603 5.29907 8.69405 5.29907C6.82784 5.29907 5.31494 6.81197 5.31494 8.67818" stroke="#116C63" strokeWidth="1.35164" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Group Size
                            </p>
                            <p>{tour.acf.group_size}</p>
                        </div>
                        <div className="included-container">
                            <p className="title">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                    <path d="M4.58594 1.92456V14.9107" stroke="#116C63" strokeWidth="1.29861" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2.63818 2.24927V5.4958C2.63818 7.11907 4.58611 7.11907 4.58611 7.11907C4.58611 7.11907 6.53403 7.11907 6.53403 5.4958V2.24927" stroke="#116C63" strokeWidth="1.29861" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12.378 7.44367H9.78076V4.52179C9.78076 1.92456 12.378 1.92456 12.378 1.92456V7.44367ZM12.378 7.44367V14.9107" stroke="#116C63" strokeWidth="1.29861" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                What is included
                            </p>
                            <p>{tour.acf.what_is_included}</p>
                        </div>
                    </div> */}
                </section>
            )}
            <section className="tour-description-section">
                <div className="description-text">
                    {acf.tour_description
                        .split(/\r\n/)
                        .map((line, i) => (
                            <React.Fragment key={i}>
                                <p key={i}>{line}</p>
                                <br />
                            </React.Fragment>
                        ))}
                </div>
            </section>
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
                            <div key={item.title + i} className="highlight-item">
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