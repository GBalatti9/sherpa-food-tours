const domain = process.env.WP_DOMAIN;
const apiUrl = `${domain}/wp-json/wp/v2`

export const wp = {
    getPageInfo: async (slug: string) => {
        const response = await fetch(`${apiUrl}/pages?slug=${slug}`)

        if (!response.ok) throw new Error("No se obtuvieron datos");

        const [data] = await response.json();

        const { title: { rendered: title }, content: { rendered: content }, acf, featured_media } = data;

        return { title, content, acf, featured_media };
    },
    getPostInfo: async (slug: string) => {
        const response = await fetch(`${apiUrl}/posts?slug=${slug}`)

        if (!response.ok) throw new Error("No se obtuvieron datos");
        const [data] = await response.json();

        const { title: { rendered: title }, content: { rendered: content }, excerpt: { rendered: excerpt }, featured_media, date, modified } = data;

        return { title, content, excerpt, featured_media, date, modified };
    },
    getAllPost: async () => {
        const response = await fetch(`${apiUrl}/posts`)

        if (!response.ok) throw new Error("No se obtuvieron datos");
        const data = await response.json();

        return data;
    },
    getPostImage: async (id?: number) => {
        if (!id || id === 0) {
            // Si no hay media, devolver imagen por defecto
            return {
                img: "https://www.sherpafoodtours.com/default-og.jpg",
                alt: "",
            };
        }

        try {
            const response = await fetch(`${apiUrl}/media/${id}`);
            if (!response.ok) throw new Error("No se obtuvieron datos");

            const data = await response.json();
            return {
                img: data.source_url || "https://www.sherpafoodtours.com/default-og.jpg",
                alt: data.alt_text || "",
            };
        } catch (e) {
            console.warn("No se pudo obtener la imagen del post:", e);
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
        const response = await fetch(`${apiUrl}/tours`)

        if (!response.ok) throw new Error("No se obtuvieron datos");
        const data = await response.json();

        return data;
    },
    getCity: async (id: number) => {
        const response = await fetch(`${apiUrl}/cities/${id}`)

        if (!response.ok) throw new Error("No se obtuvieron datos");
        const { title: { rendered: title }, acf: { pais: country_id } } = await response.json();

        return { city_name: title, country_id: country_id };
    },
    getCountry: async (id: number) => {
        const response = await fetch(`${apiUrl}/countries/${id}`)

        if (!response.ok) throw new Error("No se obtuvieron datos");
        const { title: { rendered: title } } = await response.json();

        return { country_name: title };
    },
    getEmbedSectionInfo: async (slug: string) => {
        const response = await fetch(`${apiUrl}/embedsections?slug=${slug}`)

        if (!response.ok) throw new Error("No se obtuvieron datos");
        const [data] = await response.json();
        
        const { title: { rendered: title }, content: { rendered: content }, featured_media } = data;

        return { title, content, featured_media };
    },
    getAuthor: async (id: number) => {
        const response = await fetch(`${apiUrl}/users/${id}`)

        if (!response.ok) throw new Error("No se obtuvieron datos");

        const { name } = await response.json();

        return { name };
    }

}