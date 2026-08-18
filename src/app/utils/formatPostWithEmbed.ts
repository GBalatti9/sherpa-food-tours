import { WPPost } from "@/types/post";
import type { WpImage } from "@/lib/wp-media";

export interface PostWithImageData extends WPPost {
  image: WpImage;
  // slug es el de WP: los bylines enlazan a /author/<slug>/ y sin él no enlazan.
  author_name: { name: string; slug?: string | null };
}

const DEFAULT_IMAGE = "https://www.sherpafoodtours.com/imagen-de-portada.webp";
const wpDomain = process.env.NEXT_PUBLIC_WP_URL;

function normalizeWpImageUrl(url: string): string {
  if (!url || !url.includes('/wp-content/uploads/') || !wpDomain) return url;
  try {
    const imgUrl = new URL(url);
    const wpUrl = new URL(wpDomain);
    imgUrl.hostname = wpUrl.hostname;
    imgUrl.protocol = wpUrl.protocol;
    imgUrl.port = wpUrl.port;
    return imgUrl.toString();
  } catch {
    return url;
  }
}

/**
 * Extract image and author from a WordPress post that was fetched with `_embed`.
 * Falls back to default values if embedded data is missing.
 */
export function formatPostFromEmbed(post: WPPost & { _embedded?: Record<string, unknown[]> }): PostWithImageData {
  // Dimensiones reales de public/imagen-de-portada.webp, para que el fallback tampoco cause CLS.
  let image: WpImage = { img: DEFAULT_IMAGE, alt: "", width: 1441, height: 711 };
  let authorName: { name: string; slug?: string | null } = { name: "Unknown", slug: null };

  if (post._embedded) {
    const media = post._embedded["wp:featuredmedia"] as { source_url?: string; alt_text?: string; media_details?: { width?: number; height?: number } }[] | undefined;
    if (media && media[0]?.source_url) {
      image = {
        img: normalizeWpImageUrl(media[0].source_url),
        alt: media[0].alt_text || "",
        width: media[0].media_details?.width,
        height: media[0].media_details?.height,
      };
    }

    const authors = post._embedded["author"] as { name?: string; slug?: string }[] | undefined;
    if (authors && authors[0]?.name) {
      authorName = { name: authors[0].name, slug: authors[0].slug ?? null };
    }
  }

  return { ...post, image, author_name: authorName };
}

/**
 * Filter posts that have valid images and city relations.
 */
export function filterValidPosts(posts: PostWithImageData[]): PostWithImageData[] {
  return posts.filter(
    (post) =>
      post.image.img !== DEFAULT_IMAGE &&
      Array.isArray(post.relaciones?.ciudades) &&
      post.relaciones.ciudades.length > 0 &&
      post.relaciones.ciudades[0] !== null
  );
}
