import { wp } from "@/lib/wp";

export async function fetchImages(ids: number[]) {
    try {
        const data = await Promise.all(ids.map(id => wp.getPostImage(id)));
        return data.filter(Boolean); // filtra null/undefined
    } catch (err) {
        console.warn("No se pudieron obtener algunas imágenes:", err);
        return []; // fallback vacío
    }
}