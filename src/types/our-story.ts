

export interface OurStory {
    title: string;
    items: Item[];
}

interface Item {
    year: number;
    image: {
        img: string;
        alt: string;
    } | null;
    title: string;
    item: string;
}