const domain = process.env.NEXT_PUBLIC_WP_URL;
const apiUrl = `${domain}/wp-json/wp/v2`


export const wp = {
    getPageInfo: async (slug: string) => {
        try {

            const url = `${apiUrl}/pages?slug=${slug}`;
            const response = await fetch(url);
            if (!response.ok) console.error("No se pudo hacer fecth a la url: " + url);
            const [data] = await response.json();

            if (!data) return { title: "", content: "", acf: "", featured_media: null };


            const { title: { rendered: title }, content: { rendered: content }, acf, featured_media } = data;

            return { title, content, acf, featured_media };
        } catch (error) {

            return { title: "", content: "", acf: "", featured_media: null };
        }
    },
    getPostInfo: async (slug: string) => {
        const url = `${apiUrl}/posts?slug=${slug}`;
        const response = await fetch(url);
        const [data] = await response.json();
        if (!data) return { title: "", content: "", excerpt: "", featured_media: null, date: "", modified: "", relaciones: null };


        const { title: { rendered: title }, content: { rendered: content }, excerpt: { rendered: excerpt }, featured_media, date, modified, relaciones } = data;

        return { title, content, excerpt, featured_media, date, modified, relaciones };
    },
    getPostInfoById: async (id: number) => {
        const response = await fetch(`${apiUrl}/posts/${id}`)

        if (!response.ok) {
            console.error("No se obtuvieron datos")
            return { title: null, content: null, excerpt: null, featured_media: null, date: null, modified: null, relaciones: null, acf: null, author: null, slug: null }
        }

        const { title: { rendered: title }, content: { rendered: content }, excerpt: { rendered: excerpt }, featured_media, date, modified, relaciones, acf, author, slug } = await response.json();

        return { title, content, excerpt, featured_media, date, modified, relaciones, acf, author, slug };
    },
    getAllPost: async (limit?: number, page?: number) => {
        try {
            let url = limit ? `${apiUrl}/posts?per_page=${limit}` : `${apiUrl}/posts?v=ass`;

            if (page) {
                url += `&page=${page}`;
            }

            const response = await fetch(url);

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
    getPostImage: async (id?: number) => {
        if (!id || id === 0) {
            // Si no hay media, devolver imagen por defecto
            return {
                img: "https://www.sherpafoodtours.com/default-og.jpg",
                alt: "",
            };
        }
        const url = `${apiUrl}/media/${id}`;
        try {
            const response = await fetch(url);

            if (!response.ok) throw new Error("No se obtuvieron datos");

            const data = await response.json();
            return {
                img: `${data.source_url}` || "https://www.sherpafoodtours.com/default-og.jpg",
                alt: data.alt_text || "",
            };
        } catch (e) {
            console.warn("No se pudo obtener la imagen del post:", e, url);
            return {
                img: "https://www.sherpafoodtours.com/default-og.jpg",
                alt: "",
            };
        }
    },

    getAllCategories: async () => {
        const response = await fetch(`${apiUrl}/categories`)

        if (!response.ok) throw new Error("No se obtuvieron datos");
        const data = await response.json();

        return data;
    },
    getAllTours: async () => {

        const response = await fetch(`${apiUrl}/tours`);

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
            const response = await fetch(`${apiUrl}/embedsections?slug=${slug}`)
            if (!response.ok) throw new Error(`No se obtuvieron datos de ${apiUrl}/embedsections?slug=${slug}`);
            const [data] = await response.json();
            const { title: { rendered: title }, content: { rendered: content }, featured_media, acf } = data;
            return { title, content, featured_media, acf };
        } catch (err) {
            console.warn(`No se pudo obtener la sección ${slug}:`, err);
            return { title: "", content: "", featured_media: null, acf: null };
        }

    },
    getEmbedSectionInfoById: async (id: number) => {
        try {
            const url = `${apiUrl}/embedsections/${id}`;
            const response = await fetch(url)
            if (!response.ok) throw new Error(`No se obtuvieron datos de ${apiUrl}/embedsections/${id}`);
            const { title: { rendered: title }, content: { rendered: content }, featured_media, acf } = await response.json();
            return { title, content, featured_media, acf };
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
                return { name: "Autor desconocido" }; // fallback
            }

            const { name } = await response.json();
            return { name };

        } catch (e) {
            console.warn(`⚠️ Error getAuthor(${id}):`, e);
            return { name: "Autor desconocido" };
        }
    },
    getTourById: async (id: number) => {
        try {

            // console.log({ id });

            const url = `${apiUrl}/tours/${id}`
            const response = await fetch(url)

            if (!response.ok) throw new Error(`No se obtuvieron datos ${url}`);

            const { title: { rendered: title }, content: { rendered: content }, featured_media, acf, slug } = await response.json();

            return { title, content, featured_media, acf, slug }
        } catch (error) {
            console.error(error);
            return { title: "", content: "", featured_media: null, acf: null, slug: "" };

        }
    },
    getCityBySlug: async (slug: string) => {
        try {

            const url = `${apiUrl}/cities?slug=${slug}`;
            const response = await fetch(url)

            if (!response.ok) throw new Error(`No se obtuvieron datos ${url}}`);
            const [data] = await response.json();
            const { title: { rendered: title }, content: { rendered: content }, acf: { pais: country_id }, acf, featured_media } = data;

            return { city_name: title, content, country_id: country_id, acf, featured_media };
        } catch (error) {
            console.log({ error })
            return { city_name: "", content: "", country_id: 0, acf: null, featured_media: null };
        }
    },

    getFaqById: async (id: number) => {
        const response = await fetch(`${apiUrl}/faq/${id}`);
        if (!response.ok) throw new Error("No se obtuvieron datos");
        const { acf } = await response.json();
        return { acf }
    },

    getTourBySlug: async (slug: string) => {
        try {
            const url = `${apiUrl}/tours?slug=${slug}`;
            // console.log({ url });

            const response = await fetch(url)
            if (!response.ok) throw new Error(`No se obtuvieron datos: ${url}`);
            const [data] = await response.json();

            //console.log({data});
            if (!data) {
                return { title: "", acf: null };
            }

            const { title: { rendered: title }, acf } = data;
            return { title, acf };
        } catch (error) {
            console.error(error);
            return { title: "", acf: null };
        }
    },

    getAllCities: async () => {
        try {

            const response = await fetch(`${apiUrl}/cities`, {
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

    getPostsByCategory: async (id: number, limit = 10, offset = 0) => {
        try {
            const url = `${apiUrl}/posts?categories=${id}&per_page=${limit}&offset=${offset}`;
            const response = await fetch(url);
            const data = await response.json();
            return { ok: true, data };
        } catch (error) {
            console.error(error)
            return { ok: false, data: null }
        }
    },

    getPostsByAuthorId: async (id: number, limit = 10, offset = 0) => {
        try {
            const url = `${apiUrl}/posts?author=${id}&per_page=${limit}&offset=${offset}`;
            const response = await fetch(url);
            const data = await response.json();
            return { ok: true, data };
        } catch (error) {
            console.error(error)
            return { ok: false, data: null }
        }
    },

    getAllUsers: async () => {
        try {
            const url = `${apiUrl}/users`;
            const response = await fetch(url);
            const data = await response.json();
            return { ok: true, data };
        } catch (error) {
            return { ok: false, data: null }
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
    }



}