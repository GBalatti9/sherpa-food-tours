
"use client";

import { Image } from "lucide-react";
import "../../../../ui/components/css/image-gallery.css";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ImageGallery({ images }: { images: { img: string; alt: string }[] }) {

    const [isOpen, setIsOpen] = useState(false);
    const [initialIndex, setInitialIndex] = useState(0);

    const openGallery = (index: number) => {
        setInitialIndex(index);
        setIsOpen(true);
    };

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
                <div className="lightbox">
                    <button className="close" onClick={() => setIsOpen(false)}>✕</button>

                    <Swiper
                        modules={[Navigation, Pagination, Keyboard]}
                        initialSlide={initialIndex}
                        spaceBetween={10}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        keyboard={{ enabled: true }}
                    >
                        {images.map((image, i) => (
                            <SwiperSlide key={image.img + i}>
                                <img src={image.img} alt={image.alt || "Tour Image"} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}
        </div>
    )
}