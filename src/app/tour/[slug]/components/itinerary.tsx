"use client";

import type { Itinerary } from "@/types/itinerary";
import { useEffect, useRef } from "react";

export default function ItineraryComponent({ itinerary, desktopImgs }: { itinerary: Itinerary; desktopImgs: { img: string; alt: string }[] }) {

    const refs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {

                    if (entry.isIntersecting) {
                        entry.target.classList.add("opacity");
                    } else {
                        entry.target.classList.remove("opacity");
                    }
                });
            },
            {
                threshold: 0.5, // porcentaje visible del elemento para disparar
            }
        );

        refs.current.forEach((el) => {
            if (el) observer.observe(el);
        });

        return () => {
            const currentRefs = refs.current;
            currentRefs.forEach((el) => {
                if (el) observer.unobserve(el);
            });
        };
    }, []);

    return (
        <section className="itinerary-section">
            <div className="itinerary-container">
                <h2 className="itinerary-title"> {itinerary.title}</h2>
                <div className="itinerary-container-elements">
                    <div className="itinerary-steps-container">
                        {itinerary.items.map((item, index) => (
                            <div className="itinerary-step" key={item.title + index} ref={(el) => { refs.current[index] = el }}>
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
                                    {item.items.map((internal_item, i) => (
                                        internal_item.title ?
                                            <div className="stop-item" key={internal_item.title}>
                                                <div className="stop-item-text" dangerouslySetInnerHTML={{ __html: internal_item.title }}></div>
                                                {internal_item.mobile_img &&
                                                    <div className="stop-item-img">
                                                        <img src={internal_item.mobile_img.img} alt={internal_item.mobile_img.alt} />
                                                    </div>
                                                }
                                            </div>
                                            : <p className="stop-item" key={internal_item.title + i}>&nbsp;</p>
                                    ))}
                                </div>

                            </div>
                        ))}
                    </div>
                    <div className="desktop-images">
                        <div className="images-container">

                            {desktopImgs.map((element, i) => (
                                <div className="img-container" key={element.img + i}>
                                    <img src={element.img} alt={element.alt} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}