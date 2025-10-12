
"use client";

import { Image, ChevronLeft, ChevronRight } from "lucide-react";
import "../../../../ui/components/css/image-gallery.css";
import { useState, useEffect } from "react";

export default function ImageGallery({ images }: { images: { img: string; alt: string }[] }) {

    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const openGallery = (index: number) => {
        setCurrentIndex(index);
        setIsOpen(true);
    };

    const closeGallery = () => {
        setIsOpen(false);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const goToPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeGallery();
            if (e.key === "ArrowRight") goToNext();
            if (e.key === "ArrowLeft") goToPrev();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, currentIndex]);

    // Prevent body scroll when lightbox is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <div className="image-gallery">
            {images && images.slice(0, 4).map((image, i) => (
                <div key={image.img + i} className="image-item" onClick={() => openGallery(i)}>
                    <img src={image.img} alt={image.alt || 'Tour Image'} />
                </div>
            ))}
            <div className="total-images" onClick={() => openGallery(0)}>
                <Image />
                <p>{images.length}</p>
            </div>

            {isOpen && (
                <div className="lightbox" onClick={closeGallery}>
                    <button
                        className="close"
                        onClick={closeGallery}
                        aria-label="Close gallery"
                    >
                        ✕
                    </button>

                    <button
                        className="nav-button prev"
                        onClick={(e) => {
                            e.stopPropagation();
                            goToPrev();
                        }}
                        aria-label="Previous image"
                    >
                        <ChevronLeft size={40} />
                    </button>

                    <div
                        className="lightbox-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={images[currentIndex].img}
                            alt={images[currentIndex].alt || "Tour Image"}
                            loading="lazy"
                        />

                        {/* <div className="counter-container">
                            <div className="image-counter">
                                {currentIndex + 1} / {images.length}
                            </div>

                            <div className="pagination-dots">
                                {images.map((_, i) => (
                                    <button
                                        key={i}
                                        className={`dot ${i === currentIndex ? 'active' : ''}`}
                                        onClick={() => setCurrentIndex(i)}
                                        aria-label={`Go to image ${i + 1}`}
                                    />
                                ))}
                            </div>
                        </div> */}
                    </div>

                    <button
                        className="nav-button next"
                        onClick={(e) => {
                            e.stopPropagation();
                            goToNext();
                        }}
                        aria-label="Next image"
                    >
                        <ChevronRight size={40} />
                    </button>
                </div>
            )}
        </div>
    )
}