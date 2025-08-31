import { wp } from "@/lib/wp";

export async function fetchImages(ids: number[]) {
    if (!Array.isArray(ids)) return [];
    return await Promise.all(ids.map(id => wp.getPostImage(id)));
}