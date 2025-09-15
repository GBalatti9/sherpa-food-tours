import { TourFormatted } from "@/types/tour";
import BookNowButton from "@/ui/components/book-now";
import "./css/travel-guide-cards-section.css";
import Link from "next/link";


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
                            <div className="title-container">
                                <h3>{tour.title}</h3>
                                <div className="price-desktop">
                                    <p>From: <span>USD{tour.acf.price}</span></p>
                                </div>
                            </div>
                            <div dangerouslySetInnerHTML={{ __html: tour.content }} className="headline"></div>

                            <div className="info-container">
                                <div className="duration-container">
                                    <p className="title">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                            <path d="M8.83381 16.1517C12.7458 16.1517 15.9171 12.9804 15.9171 9.06843C15.9171 5.15642 12.7458 1.98511 8.83381 1.98511C4.9218 1.98511 1.75049 5.15642 1.75049 9.06843C1.75049 12.9804 4.9218 16.1517 8.83381 16.1517Z" stroke="#116C63" strokeWidth="1.41666" strokeLinejoin="round" />
                                            <path d="M8.83685 4.81836L8.83643 9.07147L11.8395 12.0746" stroke="#116C63" strokeWidth="1.41666" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Duration
                                    </p>
                                    <p className="title-element">{tour.acf.duration}</p>
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
                                    <p className="title-element">{tour.acf.group_size}</p>
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
                                    <p className="title-element">{tour.acf.what_is_included}</p>
                                </div>
                            </div>

                            <div dangerouslySetInnerHTML={{ __html: tour.content }} className="headline-desktop"></div>

                            <div className="footer-container">
                                <div className="price">
                                    <p>From: <span>USD{tour.acf.price}</span></p>
                                </div>
                                <div className="final">
                                    <Link href={`/tour/${tour.slug}`}>
                                        Learn More
                                    </Link>
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