// src/ui/components/main-image.tsx
export default function MainImage({ src, alt }: { src: string; alt: string }) {
    return (
        <img 
            src={src} 
            alt={alt} 
            loading="eager" 
            fetchPriority="high"
            width="1920"
            height="1080"
            decoding="async"
        />
    )
}