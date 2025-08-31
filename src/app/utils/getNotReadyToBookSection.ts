import { wp } from "@/lib/wp";
import { slugify } from "../helpers/slugify";
import { WPPost } from "@/types/post";


// utils/wpSections.js
export async function getNotReadyToBookSection() {
    // Traer títulos y posts en paralelo
    const [titles, posts] = await Promise.all([
        wp.getEmbedSectionInfo("not-ready-to-book"),
        wp.getAllPost()
    ]);

    // Formatear posts en paralelo
    const postDataFormatted = await Promise.all(
        posts.map(async (post: WPPost) => {
            const [image, author_name] = await Promise.all([
                wp.getPostImage(post.featured_media),
                wp.getAuthor(post.author)
            ]);

            return {
                ...post,
                image,
                author_name,
                city: post.relaciones.ciudades[0].title,
                city_slug: slugify(post.relaciones.ciudades[0].title)
            };
        })
    );
    

    return {
        titles,
        posts: postDataFormatted
    };
}
