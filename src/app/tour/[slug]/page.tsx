import "./tour.css";

import { fetchImages } from "@/app/utils/fetchImages";
import { wp } from "@/lib/wp";
import BookNowButton from "@/ui/components/book-now";
import { Star } from "lucide-react";

export async function generateStaticParas() {
    const tours = await wp.getAllTours();
    return tours.map((tour: { slug: string }) => ({
        slug: tour.slug
    }))
}


export default async function TourPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    console.log({ slug });

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
        </main>
    )

}