
import React from "react";

type FigureImageProps = {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  imgClassName?: string;
  loading?: "eager" | "lazy";
  width?: number | string;
  height?: number | string;
};

export default function FigureImage({
  src,
  alt,
  caption,
  className = "",
  imgClassName = "w-full h-auto",
  loading = "eager",
  width = 1200,
  height = 675,
}: FigureImageProps) {
  return (
    <figure className={`max-w-2xl mx-auto ${className}`}>
      <img 
        src={src} 
        alt={alt} 
        className={imgClassName} 
        loading={loading}
        width={width}
        height={height}
        decoding="async"
      />
      {caption && (
        <figcaption className="sr-only">{caption}</figcaption>
      )}
    </figure>
  );
}
