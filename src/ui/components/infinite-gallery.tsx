"use client";

import { useEffect, useRef } from "react";
import "./css/infinite-gallery.css"
import { Swiper } from "swiper";
import { Autoplay, FreeMode } from "swiper/modules";

export default function InfiniteGallery({images} : { images: string[] }) {
    const swiperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!swiperRef || !swiperRef.current) return;
        
        const swiper = new Swiper(swiperRef.current, {
            // Registrar módulos necesarios
            modules: [Autoplay, FreeMode],
            
            // Configuración del loop infinito
            loop: true,
            
            // Autoplay continuo
            autoplay: {
                delay: 0, // Sin pausa entre slides
                disableOnInteraction: false, // No para al interactuar
            },
            
            // Velocidad de transición
            speed: 20000,
            
            // Slides visibles automáticamente basado en contenido
            slidesPerView: 1,
            
            // Espacio entre slides
            spaceBetween: 15,
            
            // Centrar slides incompletos
            centeredSlides: false,
            
            // Permitir que continúe más allá del último slide
            allowTouchMove: true,
        });

        // Manejar eventos de hover fuera de la configuración
        const swiperEl = swiperRef.current;
        if (swiperEl && swiper.autoplay) {
            const handleMouseEnter = () => {
                swiper.autoplay?.stop();
            };
            
            const handleMouseLeave = () => {
                swiper.autoplay?.start();
            };

            swiperEl.addEventListener('mouseenter', handleMouseEnter);
            swiperEl.addEventListener('mouseleave', handleMouseLeave);

            // Cleanup al desmontar
            return () => {
                swiperEl.removeEventListener('mouseenter', handleMouseEnter);
                swiperEl.removeEventListener('mouseleave', handleMouseLeave);
                if (swiper) {
                    swiper.destroy(true, true);
                }
            };
        }
    }, []);

    return (
        <div className="gallery-wrapper" ref={swiperRef}>
            <div className="swiper-wrapper">
                {images.map((src, index) => (
                    <div key={index} className="swiper-slide">
                        <div className="gallery-item">
                            <img src={src} alt={`Imagen ${index + 1}`} width={300} height={200} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}