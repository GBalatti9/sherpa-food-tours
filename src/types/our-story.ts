import type { WpImage } from "@/lib/wp-media";


export interface OurStory {
    title: string;
    items: Item[];
}

interface Item {
    year: number;
    image: WpImage | null;
    title: string;
    item: string;
}