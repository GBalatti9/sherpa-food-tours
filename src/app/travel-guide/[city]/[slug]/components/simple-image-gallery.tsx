"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SimpleImageGalleryProps {
    images: { img: string; alt: string }[];
}

export default function SimpleImageGallery({ images }: SimpleImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const goToPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") {
                setCurrentIndex((prev) => (prev + 1) % images.length);
            }
            if (e.key === "ArrowLeft") {
                setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [images.length]);

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <div className="relative w-full my-8">
            {/* Container de la imagen */}
            <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-gray-100">
                <img
                    src={images[currentIndex].img}
                    alt={images[currentIndex].alt || `Image ${currentIndex + 1}`}
                    className="w-full h-full object-contain"
                    loading="lazy"
                    decoding="async"
                />

                {/* Botón anterior */}
                {images.length > 1 && (
                    <button
                        onClick={goToPrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 z-10"
                        aria-label="Previous image"
                    >
                        <ChevronLeft size={24} />
                    </button>
                )}

                {/* Botón siguiente */}
                {images.length > 1 && (
                    <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 z-10"
                        aria-label="Next image"
                    >
                        <ChevronRight size={24} />
                    </button>
                )}

                {/* Indicador de posición */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
                        {currentIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* Indicadores de puntos (opcional) */}
            {images.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                index === currentIndex
                                    ? "bg-gray-800 w-6"
                                    : "bg-gray-300 hover:bg-gray-400"
                            }`}
                            aria-label={`Go to image ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
