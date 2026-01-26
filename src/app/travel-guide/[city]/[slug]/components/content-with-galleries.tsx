"use client";

import { useState, useEffect } from "react";
import SimpleImageGallery from "./simple-image-gallery";

interface ContentWithGalleriesProps {
    htmlContent: string;
}

interface ProcessedNode {
    type: 'html' | 'gallery';
    content?: string;
    images?: { img: string; alt: string }[];
}

export default function ContentWithGalleries({ htmlContent }: ContentWithGalleriesProps) {
    const [processedNodes, setProcessedNodes] = useState<ProcessedNode[]>([
        { type: 'html', content: htmlContent }
    ]);

    useEffect(() => {
        // Solo procesar en el cliente donde DOMParser está disponible
        if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
            return;
        }

        // Crear un parser temporal para procesar el HTML
        const parser = new DOMParser();
        // Envolver el contenido en un div para poder procesarlo correctamente
        const wrappedContent = `<div>${htmlContent}</div>`;
        const doc = parser.parseFromString(wrappedContent, 'text/html');
        const container = doc.querySelector('div');
        
        if (!container) {
            setProcessedNodes([{ type: 'html', content: htmlContent }]);
            return;
        }
        
        // Buscar todos los elementos con clase wp-block-gallery
        const galleryElements = Array.from(container.querySelectorAll('figure.wp-block-gallery'));
        
        if (galleryElements.length === 0) {
            setProcessedNodes([{ type: 'html', content: htmlContent }]);
            return;
        }

        const galleries: Array<{ images: { img: string; alt: string }[]; marker: string }> = [];

        // Primero, extraer todas las galerías y sus imágenes
        galleryElements.forEach((galleryEl, index) => {
            const images: { img: string; alt: string }[] = [];
            const imageElements = galleryEl.querySelectorAll('img');
            
            imageElements.forEach((imgEl) => {
                const src = imgEl.getAttribute('src') || 
                           imgEl.getAttribute('data-src') || 
                           imgEl.getAttribute('data-full-url') ||
                           imgEl.getAttribute('data-large-file') ||
                           '';
                const alt = imgEl.getAttribute('alt') || '';
                
                if (src) {
                    images.push({ img: src, alt });
                }
            });

            if (images.length > 0) {
                const marker = `__GALLERY_MARKER_${index}__`;
                galleries.push({ images, marker });
                
                // Reemplazar la galería con un nodo de texto que contiene el marcador
                const markerNode = doc.createTextNode(marker);
                if (galleryEl.parentNode) {
                    galleryEl.parentNode.replaceChild(markerNode, galleryEl);
                }
            }
        });

        // Obtener el HTML procesado (sin el div wrapper)
        const processedHtml = container.innerHTML;

        // Dividir el HTML procesado por los marcadores y reconstruir los nodos
        const finalNodes: ProcessedNode[] = [];
        const parts = processedHtml.split(/(__GALLERY_MARKER_\d+__)/);

        parts.forEach((part) => {
            const markerMatch = part.match(/^__GALLERY_MARKER_(\d+)__$/);
            if (markerMatch) {
                // Es un marcador de galería
                const galleryIndex = parseInt(markerMatch[1], 10);
                const gallery = galleries[galleryIndex];
                if (gallery && gallery.images) {
                    finalNodes.push({ type: 'gallery', images: gallery.images });
                }
            } else if (part.trim()) {
                // Es contenido HTML
                finalNodes.push({ type: 'html', content: part });
            }
        });

        // Si no se procesó correctamente, retornar el contenido original
        if (finalNodes.length === 0) {
            setProcessedNodes([{ type: 'html', content: htmlContent }]);
        } else {
            setProcessedNodes(finalNodes);
        }
    }, [htmlContent]);

    return (
        <div>
            {processedNodes.map((node, index) => {
                if (node.type === 'gallery' && 'images' in node && node.images) {
                    return <SimpleImageGallery key={`gallery-${index}`} images={node.images} />;
                } else if (node.type === 'html' && node.content) {
                    return (
                        <div 
                            key={`html-${index}`} 
                            dangerouslySetInnerHTML={{ __html: node.content }} 
                        />
                    );
                }
                return null;
            })}
        </div>
    );
}
