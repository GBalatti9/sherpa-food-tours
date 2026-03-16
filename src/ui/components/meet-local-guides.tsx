"use client";

import { useRef } from "react";
import { LocalGuide } from "@/types/local-guide"
// import "./css/meet-local-guides.css"



export default function MeetLocalGuides({ localGuides }: { localGuides: LocalGuide[] }) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollCards = (direction: "left" | "right") => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const scrollAmount = 360;
        container.scrollBy({
            left: direction === "right" ? scrollAmount : -scrollAmount,
            behavior: "smooth",
        });
    };

    return (
        <div className="bg-[var(--local-guides-bg)] px-2 py-8 md:px-0">
            <div className="mx-auto w-full max-w-[1200px]">
                <h2 className="mx-auto w-[330px] pb-8 font-dk-otago text-[1.5rem] leading-none text-black md:w-auto md:pl-10 md:text-[2rem]">
                    Meet your local guides
                </h2>
                <div className="relative">
                    {localGuides.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={() => scrollCards("left")}
                                aria-label="Scroll local guides left"
                                className="absolute left-2 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(1,126,128,0.2)] bg-white/90 text-[var(--main-color)] shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-sm transition-transform duration-200 hover:scale-105 md:flex"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="none">
                                    <path d="M11 3.5L6.5 8L11 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                onClick={() => scrollCards("right")}
                                aria-label="Scroll local guides right"
                                className="absolute right-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(1,126,128,0.2)] bg-white/90 text-[var(--main-color)] shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-sm transition-transform duration-200 hover:scale-105 md:flex"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 16 16" fill="none">
                                    <path d="M5 3.5L9.5 8L5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </>
                    )}
                    <div ref={scrollContainerRef} className="flex w-full gap-4 overflow-x-auto px-0 py-4 md:gap-8 md:pl-10 md:pr-24">
                        {localGuides.map((element, i) => (
                            <article
                                className="min-h-[466px] w-[330px] shrink-0 bg-[var(--background)] px-[1.3rem] py-8"
                                key={element.name + i}
                            >
                                <div className="flex w-full items-center gap-8 border-b border-[#B9B9B9] pb-6">
                                    <div className="h-[105px] w-[105px] shrink-0 overflow-hidden">
                                        <img src={element.profile_picture.img} alt={element.profile_picture.alt} className="h-full w-full object-cover" />
                                    </div>
                                    <div className="w-1/2">
                                        <p className="font-dk-otago text-[1.25rem] text-[var(--main-color)]">{element.name}</p>
                                        <div className="flex items-center gap-1 font-excelsior uppercase">
                                            <img src={element.country_flag.img} alt={element.country_flag.alt} className="h-[10px] w-[10px] aspect-square" />
                                            <p className="text-[14px]">{element.city}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4 font-excelsior text-[1.125rem] text-[#333333]">
                                    <p>{element.description}</p>
                                    <div className="pt-6">
                                        <p className="flex items-center gap-1 text-[0.875rem] uppercase text-[var(--main-color)]">
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
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
