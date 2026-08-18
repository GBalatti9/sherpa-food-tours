import type { WpImage } from "@/lib/wp-media";


export interface Itinerary {
    title: string;
    items: Item[];
}

interface Item {
    title: string;
    information?: string;
    map: WpImage | null;
    subtitle?: string;
    items: ChildItem[];
}

interface ChildItem {
    show_empty: boolean;
    title: string;
    mobile_img?: WpImage | null;
}
