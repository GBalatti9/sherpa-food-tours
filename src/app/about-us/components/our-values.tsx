"use client";

import { useState } from "react";
import type { OurValues } from "../types";


export default function OurValues({ items }: { items: OurValues[] }) {

    const [openIndex, setOpenIndex] = useState(0);

    return (
        <>
            <section className="about-us-page-second-section">
                <h2 className="section-title">Our Values</h2>
                <div className="value-cards-container">
                    {items.map((element, i) => (
                        <div className="value-card" key={element.title + i}>
                            <div className="value-card-img" style={{
                                backgroundImage: `url(${element.background_image.img})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center"
                            }}>
                                <div className="info-card">
                                    <h4>{element.title}</h4>
                                    <hr />
                                    <p>{element.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <section className="about-us-page-second-section-desktop">
                <div className="left-side">
                    <h2 className="section-title">Our Values</h2>
                    <div className="value-cards-title-container">
                        {items.map((element, i) => (
                            <button className={openIndex === i ? "selected" : ""} key={element.title} onClick={() => setOpenIndex(i)}>
                                {element.title}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="right-side">
                    <div className="value-cards-container">
                        {items.map((element, index) => (
                            <div
                                key={element.title}
                                className={`value-card ${openIndex === index ? "active" : ""}`}
                                style={{
                                    backgroundImage: `url(${element.background_image.img})`,
                                    backgroundSize: "cover",        
                                    backgroundPosition: "center",   
                                    backgroundRepeat: "no-repeat",  
                                    width: "100%",
                                    height: "100%",
                                }}
                            >
                                <div className="info-card">
                                    <h4>{element.title}</h4>
                                    <hr />
                                    <p>{element.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>)
}