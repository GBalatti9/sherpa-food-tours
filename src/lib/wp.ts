const domain = process.env.WP_DOMAIN;
const apiUrl = `${domain}/wp-json/wp/v2`

export const getPageInfo = async (slug: string) => {
    const response = await fetch(`${apiUrl}/pages?slug=${slug}`)

    if (!response.ok) throw new Error("No se obtuvieron datos");

    const [data] = await response.json();

    const { title: { rendered: title }, content: { rendered: content } } = data;

    return { title, content };
}

export const getPostInfo = async (id: number) => {
    const response = await fetch(`${apiUrl}/posts/${id}`)

    if (!response.ok) throw new Error("No se obtuvieron datos");
    const data = await response.json();
    console.log({data});
    

    // const [data] = await response.json();

    const { title: { rendered: title }, content: { rendered: content } } = data;

    return { title, content };
}
