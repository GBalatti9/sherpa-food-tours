
import "./css/meet-local-guides.css"

interface LocalGuide {
    profile_picture: {
        img: string;
        alt: string
    },
    name: string,
    city: string,
    description: string,
    favorite_dish: string;
    country_flag: {
        img: string;
        alt: string
    }
}

export default function MeetLocalGuides({ localGuides }: { localGuides: LocalGuide[] }) {

    return (
        <div className="local-guide-container">
            <h2 className="local-guide-title">Meet your local guides</h2>
            <div className="value-cards-container">
                {localGuides.map((element, i) => (
                    <div className="value-card" key={element.name + i}>
                        <div className="value-card-personal-info">
                            <div className="img-container">
                                <img src={element.profile_picture.img} alt={element.profile_picture.alt} />
                            </div>
                            <div className="value-card-titles">
                                <p className="value-card-name">{element.name}</p>
                                <div className="country-name">
                                    <img src={element.country_flag.img} alt={element.country_flag.alt} />
                                    <p>{element.city}</p>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="value-card-description">
                            <p>{element.description}</p>
                            <div className="value-card-last-section">
                                <p className="last-section-title">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                        <path d="M4.83398 2.08374V15.0699" stroke="#017E80" strokeWidth="1.29861" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M2.88672 2.40845V5.65498C2.88672 7.27825 4.83464 7.27825 4.83464 7.27825C4.83464 7.27825 6.78256 7.27825 6.78256 5.65498V2.40845" stroke="#017E80" strokeWidth="1.29861" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12.6265 7.60285H10.0293V4.68097C10.0293 2.08374 12.6265 2.08374 12.6265 2.08374V7.60285ZM12.6265 7.60285V15.0699" stroke="#017E80" strokeWidth="1.29861" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Favorite Dish
                                </p>
                                <p>{element.favorite_dish}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}