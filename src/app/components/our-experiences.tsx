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

    return (
        <section className="our-experiences-section md:!block md:!h-auto py-10">
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

            <div className="hidden md:block px-5 py-10 lg:px-8 lg:py-14">
                <div className="mx-auto max-w-[1440px]">
                    <h2 className="font-dk-otago text-center text-[2.4rem] leading-none text-white lg:text-[3.25rem]">
                        {title}
                    </h2>
                    <div className="mt-8 grid grid-cols-3 gap-6 lg:mt-10 lg:gap-8">
                        {items.map((item, i) => (
                            <article className="flex flex-col" key={item.title + i}>
                                <div className="aspect-[4/4] overflow-hidden">
                                    <img
                                        src={item.image.img}
                                        alt={item.image.alt}
                                        width="800"
                                        height="600"
                                        loading="lazy"
                                        decoding="async"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="pt-5 text-white">
                                    <h3 className="font-dk-otago text-[1.65rem] uppercase leading-tight lg:text-[2rem]">
                                        {item.title}
                                    </h3>
                                    <div
                                        className="font-excelsior mt-3 text-[1.35rem] leading-[1.35] lg:text-[1.55rem]"
                                        dangerouslySetInnerHTML={{ __html: item.description }}
                                    ></div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
