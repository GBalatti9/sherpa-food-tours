
"use client";

import Carousel from "@/ui/components/carousel";

export default function TourHighlights({ title_highlight, highlightItems }: { title_highlight: string; highlightItems: any[] }) {
    return (
        <section className="tour-highlights">
            <div className="tour-highlights-container">
                <h2 className="highlight-title">{title_highlight}</h2>
                <div className="highlights-container mobile">
                    <Carousel>
                        {highlightItems.map((item, i) => (
                            <div key={item.highlight_description + i} className="highlight-item">
                                <div className="highlight-image-container">
                                    <img src={item.highlight_image.img} alt={item.highlight_image.alt || 'Highlight Image'} />
                                </div>
                                <div className="highlight-text-container" dangerouslySetInnerHTML={{ __html: item.highlight_description }}>
                                </div>
                            </div>
                        ))}
                    </Carousel>
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