import { wp } from "@/lib/wp";
import { safeFetch } from "./safeFetch";

type TravelGuide = Record<string, unknown>;

// Función para traer todos los posts de WordPress
export async function getAllTravelGuides(): Promise<TravelGuide[]> {
    const allPosts: TravelGuide[] = [];
    let page = 1;
    const perPage = 100; // Traemos 100 posts por request
  
    while (true) {
      const posts = await safeFetch<TravelGuide[]>(
        () => wp.getAllPost(perPage, page),
        [] as TravelGuide[],
        `getAllPost page ${page}`
      );
  
      if (!posts.length) break; // No hay más posts
      allPosts.push(...posts);
      if (posts.length < perPage) break; // Última página
      page++;
    }
  
    return allPosts;
  }