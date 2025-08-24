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

        console.log({ data });


        const { title: { rendered: title }, content: { rendered: content }, excerpt: { rendered: excerpt }, featured_media, date, modified } = data;

        console.log({date, modified});
        

        return { title, content, excerpt, featured_media, date, modified };
    },
    getAllPost: async () => {
        const response = await fetch(`${apiUrl}/posts`)

        if (!response.ok) throw new Error("No se obtuvieron datos");
        const data = await response.json();

        return data;
    },
    getPostImage: async (id: number) => {
        const response = await fetch(`${apiUrl}/media/${id}`)
        if (!response.ok) throw new Error("No se obtuvieron datos");
        const data = await response.json();
        console.log({data});
        

        return {img: data.source_url, alt: data.alt_text};
    }
}