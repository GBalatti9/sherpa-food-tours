import { TourFormatted } from "@/types/tour";
import BookNowButton from "@/ui/components/book-now";


export default function TravelGuideCardsSection({ tours }: { tours: TourFormatted[] }) {
    return (
        <section className="tour-cards-section">
            <div className="tour-cards">
                {tours.map((tour) => (
                    <div className="tour-card" key={tour.title + tour.id}>
                        <div className="img-container">
                            <img src={tour.image.img} alt={tour.image.alt} />
                        </div>
                        <div className="data-container">
                            <h3>{tour.title}</h3>
                            <div dangerouslySetInnerHTML={{ __html: tour.content }} className="headline"></div>

                            <div className="info-container">
                                <div className="duration-container">
                                    <p className="title">Duration</p>
                                    <p>{tour.acf.duration} hours</p>
                                </div>
                                <div className="size-container">
                                    <p className="title">Group Size</p>
                                    <p>{tour.acf.group_size}</p>
                                </div>
                                <div className="included-container">
                                    <p className="title">What is included</p>
                                    <p>{tour.acf.what_is_included}</p>
                                </div>
                            </div>

                            <div className="footer-container">
                                <div className="price">
                                    <p>From: <span>USD{tour.acf.price}</span></p>
                                </div>
                                <div className="final">
                                    <p>Learn More</p>
                                    <BookNowButton />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}