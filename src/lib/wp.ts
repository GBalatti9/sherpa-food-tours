const domain = process.env.WP_DOMAIN;
const apiUrl = `${domain}/wp-json/wp/v2`

export const wp = {
    getPageInfo: async (slug: string) => {
        const response = await fetch(`${apiUrl}/pages?slug=${slug}`)

        if (!response.ok) throw new Error("No se obtuvieron datos");

        const [data] = await response.json();

        const { title: { rendered: title }, content: { rendered: content } } = data;

        return { title, content };
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
    }

}