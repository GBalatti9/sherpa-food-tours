"use client";

import type { OurStory } from "@/types/our-story";
import { useEffect, useRef } from "react";

export default function OurStoryComponent({ our_story }: { our_story: OurStory }) {

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
        <div className="our-story-section">
            <div className="title-container">
                <h2>{our_story.title}</h2>
            </div>
            <div className="timeline">
                {our_story.items.map((element, index) => (
                    <div className={`item-data ${element.year === 2019 ? "center" : index % 2 === 0 ? "left" : "right"} opacity`} key={index} ref={(el) => { refs.current[index] = el }}>
                        <p className="year">{element.year}</p>
                        <div className={`data ${element.year === 2019 ? "center" : index % 2 === 0 ? "left" : "right"}`}>
                            <p className={`data-title ${element.year === 2019 ? "center" : index % 2 === 0 ? "left" : "right"}`}>{element.title}</p>
                            {element.item &&
                                <div className="data-item">
                                    <p className={`data-title-item ${index % 2 !== 0 ? "left" : "right"}`}>{element.item}</p>
                                </div>
                            }
                            <div className="img-container">
                                <img src={element.image?.img} alt="" />
                            </div>
                        </div>
                    </div>
                ))}

                <p className="more-btn">
                    More to come
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                        <path d="M18.3242 6.75977L12.3242 12.7598L6.32422 6.75977" stroke="#017E80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M18.3242 12.7598L12.3242 18.7598L6.32422 12.7598" stroke="#017E80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </p>
            </div>
        </div>
    )
}