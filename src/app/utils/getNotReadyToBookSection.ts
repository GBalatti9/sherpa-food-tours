import { wp } from "@/lib/wp";
import { slugify } from "../helpers/slugify";
import { WPPost } from "@/types/post";


// utils/wpSections.js
export async function getNotReadyToBookSection() {
    // Traer títulos y posts en paralelo
    const [titles, posts] = await Promise.all([
        wp.getEmbedSectionInfo("not-ready-to-book"),
        wp.getAllPost(3)
    ]);
    

    // Formatear posts en paralelo
    const postDataFormatted = await Promise.all(
        posts.map(async (post: WPPost) => {
            const [image, author_name] = await Promise.all([
                wp.getPostImage(post.featured_media),
                wp.getAuthor(post.author)
            ]);

            // Manejar ciudad opcional
            const ciudad = post.relaciones.ciudades?.[0];
            const city = ciudad?.title || "Sin ciudad";
            const city_slug = ciudad ? slugify(ciudad.title) : "sin-ciudad";

            return {
                ...post,
                image,
                author_name,
                city: city,
                city_slug: city_slug,
            };
        })
    );


    return {
        titles,
        posts: postDataFormatted
    };
}
