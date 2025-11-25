import { wp } from "@/lib/wp";
import { safeFetch } from "./safeFetch";


// Función para traer todos los posts de WordPress
export async function getAllTravelGuides(): Promise<any[]> {
    const allPosts: any[] = [];
    let page = 1;
    const perPage = 100; // Traemos 100 posts por request
  
    while (true) {
      const posts = await safeFetch(
        () => wp.getAllPost(perPage, page),
        [],
        `getAllPost page ${page}`
      );
  
      if (!posts.length) break; // No hay más posts
      allPosts.push(...posts);
      if (posts.length < perPage) break; // Última página
      page++;
    }
  
    return allPosts;
  }