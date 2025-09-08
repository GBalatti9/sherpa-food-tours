

export default function MainImage({ src, alt }: { src: string; alt: string }) {
    return (
        <img src={src} alt={alt} loading="eager" fetchPriority="high" />
    )
}

