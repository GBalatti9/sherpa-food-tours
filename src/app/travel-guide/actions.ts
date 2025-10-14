"use server";

import { wp } from "@/lib/wp";
import { WPPost } from "@/types/post";
import { PostWithImage } from "./page";


export const handleNewData = async (category: number, limit: number, offset: number) => {
    try {
        const newData = await wp.getPostsByCategory(category, limit, offset);
        
        const formattedData = await Promise.all(newData.data.map(postsWithImages)).then((results) =>
            results.filter(
                (post) => post.image?.img !== "https://www.sherpafoodtours.com/default-og.jpg" &&
                    Array.isArray(post.relaciones.ciudades) &&
                    post.relaciones.ciudades.length > 0 &&
                    post.relaciones.ciudades[0] !== null
            )
        ) as PostWithImage[];
        return { success: true, data: formattedData, message: "Data nueva" }
    } catch (error) {
        return { success: false, data: null, message: "No se pudo obtener la información" }
    }
}

const postsWithImages = async (post: WPPost) => {
    const image = await wp.getPostImage(post.featured_media);
    const author = await wp.getAuthor(post.author);
    return {
        ...post,
        author_name: author,
        image,
    };
}

