import { fetchWithRetry } from "./fetch-with-retry";
import { rewriteHtmlImages, type WpImage } from "./wp-media";
import { rewriteInternalLinks } from "./wp-links";

const domain = process.env.NEXT_PUBLIC_WP_URL;

// Dimensiones reales de public/imagen-de-portada.webp: sin ellas el fallback también
// provocaría CLS.
const FALLBACK_IMAGE: WpImage = {
    img: "https://www.sherpafoodtours.com/imagen-de-portada.webp",
    alt: "",
    width: 1441,
    height: 711,
};
const apiUrl = `${domain}/wp-json/wp/v2`

function normalizeWpImageUrl(url: string): string {
    if (!url || !url.includes('/wp-content/uploads/') || !domain) return url;
    try {
        const imgUrl = new URL(url);
        const wpUrl = new URL(domain);
        imgUrl.hostname = wpUrl.hostname;
        imgUrl.protocol = wpUrl.protocol;
        imgUrl.port = wpUrl.port;
        return imgUrl.toString();
    } catch {
        return url;
    }
}


// Todo el HTML que WordPress devuelve pasa por acá antes de llegar a una página: las
// imágenes al optimizador y los links internos normalizados. Un solo punto para que una
// transformación futura no quede aplicada a la mitad de los getters.
function limpiarContenido(content: string): string {
    return rewriteInternalLinks(rewriteHtmlImages(content));
}

export const wp = {
    getPageInfo: async (slug: string) => {
        const url = `${apiUrl}/pages?slug=${slug}`;
        const response = await fetchWithRetry(url, {
            next: { revalidate: 3600 }
        });

        if (!response.ok) {
            throw new Error(`WordPress API error ${response.status} for ${url}`);
        }

        const [data] = await response.json();

        // Page genuinely doesn't exist
        if (!data) return { title: "", content: "", acf: "", featured_media: null };

        const { title: { rendered: title }, content: { rendered: content }, acf, featured_media } = data;
        return { title, content: limpiarContenido(content), acf, featured_media };
    },
    getPostInfo: async (slug: string) => {
        // Optimizado: agregar cache para reducir llamadas a WordPress; _embed incluye autor
        const url = `${apiUrl}/posts?slug=${slug}&_embed`;
        const response = await fetchWithRetry(url, {
            next: { revalidate: 3600 } // cachea por 1 hora
        });

        // Acá NO se degrada a vacío: quien llama hace notFound() con el resultado vacío, así
        // que tragarse un error de red convertiría un artículo publicado en un 404 horneado
        // en el build estático. Mejor romper ruidosamente y que el deploy no salga.
        if (!response.ok) {
            throw new Error(`WordPress API error ${response.status} for ${url}`);
        }

        const [data] = await response.json();
        if (!data) return { title: "", content: "", excerpt: "", featured_media: null, date: "", modified: "", relaciones: null, author: null };


        const { title: { rendered: title }, content: { rendered: content }, excerpt: { rendered: excerpt }, featured_media, date, modified, relaciones, _embedded } = data;
        const authorData = _embedded?.author?.[0];
        const author = authorData ? { name: authorData.name, slug: authorData.slug ?? null } : null;

        return { title, content: limpiarContenido(content), excerpt, featured_media, date, modified, relaciones, author };
    },
    getPostInfoById: async (id: number) => {
        const response = await fetch(`${apiUrl}/posts/${id}`)

        if (!response.ok) {
            console.error("No se obtuvieron datos")
            return { title: null, content: null, excerpt: null, featured_media: null, date: null, modified: null, relaciones: null, acf: null, author: null, slug: null }
        }

        const { title: { rendered: title }, content: { rendered: content }, excerpt: { rendered: excerpt }, featured_media, date, modified, relaciones, acf, author, slug } = await response.json();

        return { title, content: limpiarContenido(content), excerpt, featured_media, date, modified, relaciones, acf, author, slug };
    },
    getAllPost: async (limit?: number, page?: number) => {
        try {
            let url = limit ? `${apiUrl}/posts?per_page=${limit}` : `${apiUrl}/posts?v=ass`;

            if (page) {
                url += `&page=${page}`;
            }

            // Optimizado: agregar cache para reducir llamadas a WordPress
            const response = await fetch(url, {
                next: { revalidate: 3600 } // cachea por 1 hora
            });

            if (!response.ok) {
                return []; // Retornar array vacío en lugar de fallar
            }

            return await response.json();
        } catch (error) {
            console.warn('getAllPost error:', error);
            return []; // Retornar array vacío para no romper el build
        }
    },
    getAllPostPaginated: async (limit: number, page: number) => {
        try {
            const url = `${apiUrl}/posts?per_page=${limit}&page=${page}`;

            const response = await fetch(url);

            if (!response.ok) {
                console.warn(`Posts API failed: ${response.status} ${response.statusText}`);
                return []; // Retornar array vacío en lugar de fallar
            }

            return await response.json();
        } catch (error) {
            console.warn('getAllPostPaginated error:', error);
            return []; // Retornar array vacío para no romper el build
        }
    },
    getPostImage: async (id?: number): Promise<WpImage> => {
        if (!id || id === 0) {
            // Si no hay media, devolver imagen por defecto
            return { ...FALLBACK_IMAGE };
        }
        const url = `${apiUrl}/media/${id}`;
        try {
            // Optimizado: agregar cache para imágenes (muy usado, reduce CPU significativamente)
            const response = await fetch(url, {
                next: { revalidate: 7200 } // cachea por 2 horas (las imágenes cambian menos)
            });

            if (!response.ok) throw new Error("No se obtuvieron datos");

            const data = await response.json();
            if (!data.source_url) return { ...FALLBACK_IMAGE };
            return {
                img: normalizeWpImageUrl(data.source_url),
                alt: data.alt_text || "",
                width: data.media_details?.width,
                height: data.media_details?.height,
            };
        } catch (e) {
            console.warn("No se pudo obtener la imagen del post:", e, url);
            return { ...FALLBACK_IMAGE };
        }
    },

    getAllCategories: async () => {
        const response = await fetch(`${apiUrl}/categories`)

        if (!response.ok) throw new Error("No se obtuvieron datos");
        const data = await response.json();

        return data;
    },
    getAllTours: async () => {
        // Optimizado: agregar cache para reducir llamadas a WordPress
        const response = await fetch(`${apiUrl}/tours?per_page=100`, {
            next: { revalidate: 3600 } // cachea por 1 hora
        });

        if (!response.ok) throw new Error("No se obtuvieron datos");
        const data = await response.json();

        return data;
    },
    getCity: async (id: number) => {

        try {
            const url = `${apiUrl}/cities/${id}`;
            const response = await fetch(url);

            if (!response.ok) throw new Error(`No se obtuvieron datos ${url}`);
            const { title: { rendered: title }, acf: { pais: country_id }, slug } = await response.json();

            return { city_name: title, country_id: country_id, slug };
        } catch (error) {
            console.error(error);
            return { city_name: "", country_id: 0, slug: "" };
        }
    },
    getCountry: async (id: number) => {
        try {

            const url = `${apiUrl}/countries/${id}`;
            const response = await fetch(url)

            if (!response.ok) throw new Error(`No se obtuvieron datos ${url}`);
            const { title: { rendered: title } } = await response.json();

            return { country_name: title };
        } catch (error) {
            console.log({ error });

            return { country_name: "" }
        }
    },
    getEmbedSectionInfo: async (slug: string) => {
        try {
            const response = await fetchWithRetry(`${apiUrl}/embedsections?slug=${slug}`, { next: { revalidate: 3600 } })
            if (!response.ok) throw new Error(`No se obtuvieron datos de ${apiUrl}/embedsections?slug=${slug}`);
            const [data] = await response.json();
            if (!data) throw new Error(`La sección ${slug} no existe`);
            const { title: { rendered: title }, content: { rendered: content }, featured_media, acf } = data;
            return { title, content: limpiarContenido(content), featured_media, acf };
        } catch (err) {
            console.warn(`No se pudo obtener la sección ${slug}:`, err);
            return { title: "", content: "", featured_media: null, acf: null };
        }

    },
    getEmbedSectionInfoById: async (id: number) => {
        try {
            const url = `${apiUrl}/embedsections/${id}`;
            // Con fetch pelado, un 500 puntual de WP durante el prerender devolvía acf: null
            // y tumbaba el build. Reintentos + caché, igual que getCityBySlug y getTourBySlug.
            const response = await fetchWithRetry(url, { next: { revalidate: 3600 } })
            if (!response.ok) throw new Error(`No se obtuvieron datos de ${apiUrl}/embedsections/${id}`);
            const { title: { rendered: title }, content: { rendered: content }, featured_media, acf } = await response.json();
            return { title, content: limpiarContenido(content), featured_media, acf };
        } catch (err) {
            console.warn(`No se pudo obtener la sección ${id}:`, err);
            return { title: "", content: "", featured_media: null, acf: null };
        }

    },
    getAuthor: async (id: number) => {
        try {
            const response = await fetch(`${apiUrl}/users/${id}`);

            if (!response.ok) {
                console.warn(`⚠️ No se pudo obtener autor ID ${id}`);
                return { name: "Autor desconocido", slug: null }; // fallback
            }

            // El slug real de WP: los bylines lo necesitan para enlazar a /author/<slug>/
            // en vez de derivarlo del nombre (que generaba slugs con acentos).
            const { name, slug } = await response.json();
            return { name, slug: slug ?? null };

        } catch (e) {
            console.warn(`⚠️ Error getAuthor(${id}):`, e);
            return { name: "Autor desconocido", slug: null };
        }
    },
    getTourById: async (id: number) => {
        try {

            const url = `${apiUrl}/tours/${id}`
            const response = await fetch(url)

            if (!response.ok) throw new Error(`No se obtuvieron datos ${url}`);

            const { title: { rendered: title }, content: { rendered: content }, featured_media, acf, slug } = await response.json();

            return { title, content: limpiarContenido(content), featured_media, acf, slug }
        } catch (error) {
            console.error(error);
            return { title: "", content: "", featured_media: null, acf: null, slug: "" };

        }
    },
    getCityBySlug: async (slug: string) => {
        const url = `${apiUrl}/cities?slug=${slug}`;
        const response = await fetchWithRetry(url, {
            next: { revalidate: 3600 }
        });

        if (!response.ok) {
            throw new Error(`WordPress API error ${response.status} for ${url}`);
        }

        const [data] = await response.json();

        // City genuinely doesn't exist
        if (!data) {
            return { city_name: "", content: "", country_id: 0, acf: null, featured_media: null };
        }

        const { title: { rendered: title }, content: { rendered: content }, acf: { pais: country_id }, acf, featured_media } = data;
        return { city_name: title, content: limpiarContenido(content), country_id: country_id, acf, featured_media };
    },

    getFaqById: async (id: number) => {
        const response = await fetch(`${apiUrl}/faq/${id}`);
        if (!response.ok) throw new Error("No se obtuvieron datos");
        const { acf } = await response.json();
        return { acf }
    },

    getTourBySlug: async (slug: string) => {
        const url = `${apiUrl}/tours?slug=${slug}`;
        const response = await fetchWithRetry(url, {
            next: { revalidate: 3600 }
        });

        if (!response.ok) {
            throw new Error(`WordPress API error ${response.status} for ${url}`);
        }

        const [data] = await response.json();

        // Tour genuinely doesn't exist
        if (!data) {
            return { title: "", acf: null };
        }

        const { title: { rendered: title }, acf } = data;
        return { title, acf };
    },

    getAllCities: async () => {
        try {

            const response = await fetch(`${apiUrl}/cities?per_page=100`, {
                next: { revalidate: 3600 } // cachea por 1 hora
            });
            if (!response.ok) throw new Error("No se obtuvieron datos");
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    getPostsByCategory: async (id: number, limit = 100, offset = 0) => {
        try {
            const url = `${apiUrl}/posts?categories=${id}&per_page=${limit}&offset=${offset}`;
            console.log({ url });
            const response = await fetch(url);
            if (!response.ok) {
                console.warn(`Posts by category API failed: ${response.status} ${response.statusText}`);
                return { ok: false, data: [] };
            }
            const data = await response.json();
            return { ok: true, data };
        } catch (error) {
            console.error("Error fetching posts by category:", error);
            return { ok: false, data: [] };
        }
    },

    // ok:false significa "WP falló"; ok:true con data:[] significa "el autor no tiene posts".
    // La distinción importa: author/[user] devuelve 404 en el segundo caso y 500 en el primero.
    getPostsByAuthorId: async (id: number, limit = 10, offset = 0) => {
        try {
            const url = `${apiUrl}/posts?author=${id}&per_page=${limit}&offset=${offset}`;
            const response = await fetch(url);
            if (!response.ok) {
                console.warn(`⚠️ No se pudieron obtener posts del autor ${id}: ${response.status}`);
                return { ok: false as const, data: null };
            }
            const data = await response.json();
            if (!Array.isArray(data)) return { ok: false as const, data: null };
            return { ok: true as const, data };
        } catch (error) {
            console.error(error)
            return { ok: false as const, data: null }
        }
    },

    getAllUsers: async () => {
        try {
            // Optimizado: agregar cache para reducir llamadas a WordPress
            const url = `${apiUrl}/users`;
            const response = await fetch(url, {
                next: { revalidate: 3600 } // cachea por 1 hora
            });
            if (!response.ok) {
                console.warn(`⚠️ No se pudieron obtener los usuarios: ${response.status}`);
                return { ok: false as const, data: null };
            }
            const data = await response.json();
            if (!Array.isArray(data)) return { ok: false as const, data: null };
            return { ok: true as const, data };
        } catch (error) {
            return { ok: false as const, data: null }
        }
    },

    getUserBySlug: async (slug: string) => {
        try {
            const url = `${apiUrl}/users?slug=${slug}`;
            const response = await fetch(url);
            if (!response.ok) return { ok: false, data: null };
            const data = await response.json();
            return { ok: true, data: data.length > 0 ? data[0] : null };
        } catch (error) {
            return { ok: false, data: null };
        }
    },
    getUserById: async (id: number) => {
        try {
            const url = `${apiUrl}/users/${id}`;
            const response = await fetch(url);
            if (!response.ok) return { ok: false, data: null };
            const data = await response.json();
            return { ok: true, data };
        } catch (error) {
            return { ok: false, data: null };
        }
    },
    
    getPostsByPostsId: async (ids: number[]) => {
        try {
          if (!ids.length) return { ok: true, data: [] };
      
          const url = `${apiUrl}/posts?include=${ids.join(",")}&_embed&per_page=100`;
          const response = await fetch(url);
      
          if (!response.ok) throw new Error("Error fetching posts by ids");
      
          const data = await response.json();
      
          // ✅ Reordenamos según el orden original
          const orderedData = ids
            .map(id => data.find((post: any) => post.id === id))
            .filter(Boolean);
      
          return { ok: true, data: orderedData };
        } catch (error) {
          return { ok: false, data: [] };
        }
      },
    getPostsIdsByCityId: async (id: number) => {
        try {
          const url = `${apiUrl}/cities/${id}`;
          console.log({ url });
          const response = await fetch(url);
      
          if (!response.ok) throw new Error("Error fetching posts by city");
      
          const data = await response.json();

          const ids = data.posts.map((p: any) => p.id);

      
          return { ok: true, data: ids };
        } catch (error) {
          return { ok: false, data: [] };
        }
      },

      getPostsBySearch: async (search: string) => {
        try {
          const url = `${apiUrl}/posts?search=${search}&_embed&per_page=100`;
          const response = await fetch(url);
          
          if (!response.ok) {
            console.warn(`Posts by search API failed: ${response.status} ${response.statusText}`);
            return { ok: false, data: [] };
          }
          
          const data = await response.json();
          return { ok: true, data };
        } catch (error) {
          console.error("Error fetching posts by search:", error);
          return { ok: false, data: [] };
        }
      },

      getMarqueeBanner: async () => {
        try {
          const url = `${apiUrl}/banner`;
          const response = await fetch(url);
          const data = await response.json();
          return { ok: true, data };
        } catch (error) {
          return { ok: false, data: null };
        }
      }


}