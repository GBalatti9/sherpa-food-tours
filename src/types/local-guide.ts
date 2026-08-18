import type { WpImage } from "@/lib/wp-media";
export interface LocalGuideRaw {
    profile_picture: number;
    name: string,
    city: string,
    description: string,
    favorite_dish: string;
    country_flag: number;
}

export interface LocalGuide {
    profile_picture: WpImage,
    name: string,
    city: string,
    description: string,
    favorite_dish: string;
    country_flag: WpImage
}