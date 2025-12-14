'use client';

import { useState } from 'react';
import Image from 'next/image';

const PLACEHOLDER_IMAGE = '/sherpa-main-image.webp';

export default function MainImage({ src, alt }: { src: string; alt: string }) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* Imagen placeholder - siempre visible, desaparece cuando la real carga */}
            <Image
                src={PLACEHOLDER_IMAGE}
                alt={alt}
                fill
                priority
                fetchPriority="high"
                quality={90}
                style={{
                    objectFit: 'cover',
                    opacity: imageLoaded ? 0 : 1,
                    transition: 'opacity 0.6s ease-in-out',
                }}
                sizes="100vw"
            />
            
            {/* Imagen real - aparece cuando está cargada */}
            {!imageError && (
                <Image
                    src={src}
                    alt={alt}
                    fill
                    priority
                    fetchPriority="high"
                    quality={90}
                    style={{
                        objectFit: 'cover',
                        opacity: imageLoaded ? 1 : 0,
                        transition: 'opacity 0.6s ease-in-out',
                    }}
                    sizes="100vw"
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                />
            )}
        </div>
    );
}