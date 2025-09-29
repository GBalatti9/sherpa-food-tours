"use client";
import { useRef, ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "./css/carousel.css"
type CarouselProps = {
  children: ReactNode;
  autoplayDelay?: number;
  loop?: boolean;
};

export default function Carousel({
  children,
  autoplayDelay = 2000,
  loop = true,
}: CarouselProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  function handleClick() {
    swiperRef.current?.slideNext();
  }

  function handleMouseEnter() {
    swiperRef.current?.autoplay.stop();
  }

  function handleMouseLeave() {
    swiperRef.current?.autoplay.start();
  }

  return (
    <div
      className="carousel-wrapper"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Swiper
        modules={[Autoplay]}
        slidesPerView={1}
        spaceBetween={20}
        loop={loop}
        centeredSlides={true} // 👈 Centrar slides siempre
        initialSlide={0} // 👈 Empezar con la primera slide centrada
        autoplay={{
          delay: autoplayDelay,
          disableOnInteraction: false,
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {Array.isArray(children)
          ? children.map((child, i) => <SwiperSlide key={i}>{child}</SwiperSlide>)
          : <SwiperSlide>{children}</SwiperSlide>}
      </Swiper>
    </div>
  );
}