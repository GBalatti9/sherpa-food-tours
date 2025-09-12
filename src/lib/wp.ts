const domain = process.env.NEXT_PUBLIC_WP_URL;
const apiUrl = `${domain}/wp-json/wp/v2`

console.log({domain, apiUrl});


export const wp = {
    getPageInfo: async (slug: string) => {
        const url = `${apiUrl}/pages?slug=${slug}`;
        const response = await fetch(url)

        console.log({url});
        
        // if (!response.ok) throw new Error("No se obtuvieron datos");

        const [data] = await response.json();
          if (!data) return { title: "", content: "", acf: "", featured_media: null };


        const { title: { rendered: title }, content: { rendered: content }, acf, featured_media } = data;

        return { title, content, acf, featured_media };
    },
    getPostInfo: async (slug: string) => {
        const url = `${apiUrl}/posts?slug=${slug}`;
        const response = await fetch(url);

        console.log({url});
        
        // if (!response.ok) throw new Error("No se obtuvieron datos");
        const [data] = await response.json();
          if (!data) return { title: "", content: "", excerpt: "", featured_media: null, date: "", modified: "", relaciones: null };


        const { title: { rendered: title }, content: { rendered: content }, excerpt: { rendered: excerpt }, featured_media, date, modified, relaciones } = data;

        return { title, content, excerpt, featured_media, date, modified, relaciones };
    },
    getPostInfoById: async (id: number) => {
        const response = await fetch(`${apiUrl}/posts/${id}`)

        if (!response.ok) throw new Error("No se obtuvieron datos");

        const { title: { rendered: title }, content: { rendered: content }, excerpt: { rendered: excerpt }, featured_media, date, modified, relaciones, acf, author, slug } = await response.json();

        return { title, content, excerpt, featured_media, date, modified, relaciones, acf, author, slug };
    },
    getAllPost: async (limit?: number) => {
        const url = limit ? `${apiUrl}/posts?per_page=${limit}` : `${apiUrl}/posts`;
        const response = await fetch(url)

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
            const url = `${apiUrl}/media/${id}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error("No se obtuvieron datos");

            const data = await response.json();
            return {
                img: data.source_url || "https://www.sherpafoodtours.com/default-og.jpg",
                alt: data.alt_text || "",
            };
        } catch (e) {
            console.warn("No se pudo obtener la imagen del post:");
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
        const url = `${apiUrl}/cities/${id}`;
        const response = await fetch(url);

        if (!response.ok) throw new Error(`No se obtuvieron datos ${url}`);
        const { title: { rendered: title }, acf: { pais: country_id }, slug } = await response.json();

        return { city_name: title, country_id: country_id, slug };
    },
    getCountry: async (id: number) => {
        const url = `${apiUrl}/countries/${id}`;
        const response = await fetch(url)

        if (!response.ok) throw new Error(`No se obtuvieron datos ${url}`);
        const { title: { rendered: title } } = await response.json();

        return { country_name: title };
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
        const response = await fetch(`${apiUrl}/users/${id}`)

        if (!response.ok) throw new Error("No se obtuvieron datos");

        const { name } = await response.json();

        return { name };
    },
    getTourById: async (id: number) => {
        console.log({ id });

        const response = await fetch(`${apiUrl}/tours/${id}`)

        if (!response.ok) throw new Error("No se obtuvieron datos");

        const { title: { rendered: title }, content: { rendered: content }, featured_media, acf } = await response.json();

        return { title, content, featured_media, acf }
    },
    getCityBySlug: async (slug: string) => {
        const response = await fetch(`${apiUrl}/cities?slug=${slug}`)

        if (!response.ok) throw new Error("No se obtuvieron datos");
        const [data] = await response.json();
        const { title: { rendered: title }, content: { rendered: content }, acf: { pais: country_id }, acf, featured_media } = data;

        return { city_name: title, content, country_id: country_id, acf, featured_media };
    },

    getFaqById: async (id: number) => {
        const response = await fetch(`${apiUrl}/faq/${id}`);
        if (!response.ok) throw new Error("No se obtuvieron datos");
        const { acf } = await response.json();
        return { acf }
    },

    getTourBySlug: async (slug: string) => {
        const url = `${apiUrl}/tours?slug=${slug}`;
        const response = await fetch(url)
        if (!response.ok) throw new Error(`No se obtuvieron datos: ${url}`);
        const [data] = await response.json();
        const { title: { rendered: title }, acf } = data;
        return {title, acf};
    },

    getAllCities: async () => {
        const response = await fetch(`${apiUrl}/cities`)
        if (!response.ok) throw new Error("No se obtuvieron datos");
        const data = await response.json();
        return data;
    },



}