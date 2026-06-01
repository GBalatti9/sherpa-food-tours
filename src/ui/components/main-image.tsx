import Image from 'next/image';

export default function MainImage({ src, alt }: { src: string; alt: string }) {
    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: '#1a1a1a' }}>
            <Image
                src={src || '/sherpa-main-image.webp'}
                alt={alt}
                fill
                priority
                fetchPriority="high"
                quality={90}
                style={{ objectFit: 'cover' }}
                sizes="100vw"
            />
            <div
                aria-hidden="true"
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.40)',
                    pointerEvents: 'none',
                }}
            />
        </div>
    );
}
