
"use client";

import { HighlightItem } from "@/types/highlights-item";
import { useState, useEffect } from "react";

export default function TourHighlights({ title_highlight, highlightItems }: { title_highlight: string; highlightItems: HighlightItem[] }) {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (highlightItems.length === 0) return;

        const interval = setInterval(() => {
            setActiveIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % highlightItems.length;
                return nextIndex;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [highlightItems.length]);

    return (
        <section className="tour-highlights">
            <div className="tour-highlights-container">
                <h2 className="highlight-title">{title_highlight}</h2>
                <div className="highlights-container mobile">
                    <div className="highlights-fade-wrapper">
                        {highlightItems.map((item, i) => {
                            const isActive = i === activeIndex;
                            return (
                            <div 
                                key={item.highlight_description + i} 
                                className={`highlight-item ${isActive ? 'active' : ''}`}
                                style={{
                                    opacity: isActive ? 1 : 0,
                                    zIndex: isActive ? 2 : 1,
                                }}
                            >
                                <div className="highlight-image-container">
                                    <img src={item.highlight_image.img} alt={item.highlight_image.alt || 'Highlight Image'} />
                                </div>
                                <div className="highlight-text-container" dangerouslySetInnerHTML={{ __html: item.highlight_description }}>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                </div>

                <div className="highlights-container desktop">
                    {highlightItems.map((item, i) => (
                        <div key={item.highlight_description + i} className="highlight-item">
                            <div className="highlight-image-container">
                                <img src={item.highlight_image.img} alt={item.highlight_image.alt || 'Highlight Image'} />
                            </div>
                            <div className="highlight-text-container" dangerouslySetInnerHTML={{ __html: item.highlight_description }}>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}