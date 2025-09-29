

export interface Itinerary {
    title: string;
    items: Item[];
}

interface Item {
    title: string;
    information?: string;
    map: {
        img: string;
        alt: string;
    } | null;
    subtitle?: string;
    items: ChildItem[];
}

interface ChildItem {
    show_empty: boolean;
    title: string;
    mobile_img?: {img: string; alt: string} | null;
}
