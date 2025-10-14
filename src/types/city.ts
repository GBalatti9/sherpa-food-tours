

export interface City {
    id: number;
    featured_media: number;
    slug: string;
    title: {
        rendered: string
    };
    acf: {
        pais: number
    }
}