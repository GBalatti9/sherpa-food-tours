"use client";

import { useEffect, useRef } from "react";

export default function Memories({ memories }: { memories: { img: string; alt: string }[] }) {

    const refs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;
        if (!isMobile) return;

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
                threshold: 0.8, // porcentaje visible del elemento para disparar
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
        <div className="items-container">
            <div className="titles">
                <img src="/sherpa-green.png" alt="Sherpa Food Tour Logo" loading="lazy"/>
                <p className="title">memories</p>
            </div>
            <div className="memories-container">
                {memories.map((memory, index) => (
                    <div className="memory-container" key={memory.img + index} ref={(el) => { refs.current[index] = el }}>
                        <img src={memory.img} alt={memory.alt} loading="lazy" />
                    </div>
                ))}
            </div>
        </div>
    )
}