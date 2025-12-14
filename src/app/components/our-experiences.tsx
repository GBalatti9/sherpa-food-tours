"use client";

// import "../../ui/components/css/our-experiences.css"
import React, { useState } from "react";

interface Item {
    title: string;
    description: string;
    image: {
        img: string;
        alt: string;
    };
}

export default function OurExperiencesSection({
    title,
    items,
}: {
    title: string;
    items: Item[];
}) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const handleToggle = (i: number) => {
        setOpenIndex(openIndex === i ? openIndex : i); // si clickeo el mismo -> cerrar, sino abrir ese
    };

    const images = items ? items.map((item) => { return { title: item.title, image: item.image } }) : [];


    return (
        <section className="our-experiences-section">
            <div className="our-experiences-section-first-part">
                <div className="title-section">
                    <h2>{title}</h2>
                </div>
            </div>

            <div className="our-experiences-section-second-part">
                {items.map((item, i) => (
                    <React.Fragment key={item.title + i}>
                        <details
                            className="item"
                            open={openIndex === i} // solo este se abre
                            onClick={(e) => {
                                e.preventDefault(); // evita el toggle nativo
                                handleToggle(i);
                            }}
                        >
                            <summary className={openIndex === i ? 'active' : ''}>{item.title}</summary>
                            <hr />
                            <div
                                className="content"
                                dangerouslySetInnerHTML={{ __html: item.description }}
                            ></div>
                            <div className="img-container">
                                <img src={item.image.img} alt={item.image.alt} width="600" height="400" loading="lazy" decoding="async" />
                            </div>
                        </details>
                    </React.Fragment>
                ))}
            </div>

            {/* DESKTOP */}

            <div className="our-experiences-section-desktop">
                <div className="info-section">
                    <h2>{title}</h2>
                    <div className="items">
                        {items.map((item, i) => (
                            <details
                                key={item.title + i}
                                className="item"
                                open={openIndex === i} // solo este se abre
                                onClick={(e) => {
                                    e.preventDefault(); // evita el toggle nativo
                                    handleToggle(i);
                                }}
                            >
                                <summary className={openIndex === i ? 'active' : ''}>{item.title}</summary>
                                <hr />
                                <div
                                    className="content"
                                    dangerouslySetInnerHTML={{ __html: item.description }}
                                ></div>
                            </details>
                        ))}
                    </div>
                </div>
                <div className="images-section">
                    <div className="images-container">
                        {images.map((image, i) => (
                            <div className={`img-item ${openIndex === i ? 'active' : ''}`} key={image.title + i}>
                                <img src={image.image.img} alt={image.image.alt} width="800" height="600" loading="lazy" decoding="async" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
