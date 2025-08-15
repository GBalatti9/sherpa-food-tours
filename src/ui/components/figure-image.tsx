
import React from "react";

type FigureImageProps = {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  imgClassName?: string;
  loading?: "eager" | "lazy";
};

export default function FigureImage({
  src,
  alt,
  caption,
  className = "",
  imgClassName = "w-full h-auto",
  loading = "eager",
}: FigureImageProps) {
  return (
    <figure className={`max-w-2xl mx-auto ${className}`}>
      <img src={src} alt={alt} className={imgClassName} loading={loading} />
      {caption && (
        <figcaption className="sr-only">{caption}</figcaption>
      )}
    </figure>
  );
}
