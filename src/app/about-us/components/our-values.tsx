"use client";

import type { OurValues } from "../types";


export default function OurValues({ items }: { items: OurValues[] }) {
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

            {/* DESKTOP */}
            <section className="mt-6 hidden bg-[var(--title-color)] px-6 py-10 md:block lg:px-10 lg:py-14">
                <div className="mx-auto max-w-[1440px]">
                    <h2 className="font-dk-otago text-center text-4xl text-white lg:text-5xl">
                        Our Values
                    </h2>
                    <div className="mt-8 grid grid-cols-3 gap-6 lg:mt-10 lg:gap-8">
                        {items.map((element, index) => (
                            <article
                                key={element.title + index}
                                className="group overflow-hidden border border-transparent bg-[var(--background)] transition-colors duration-300 hover:border-black"
                            >
                                <div
                                    className="aspect-[4/3] w-full bg-cover bg-center bg-no-repeat"
                                    style={{ backgroundImage: `url(${element.background_image.img})` }}
                                />
                                <div className="flex min-h-[210px] flex-col gap-3 p-5 text-[#333333] lg:min-h-[240px] lg:p-6">
                                    <h3 className="font-dk-otago text-[1.6rem] leading-tight lg:text-[1.9rem]">
                                        {element.title}
                                    </h3>
                                    <p className="font-excelsior text-[1.1rem] leading-[1.45] lg:text-[1.25rem]">
                                        {element.description}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </>)
}
