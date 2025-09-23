export interface LocalGuideRaw {
    profile_picture: number;
    name: string,
    city: string,
    description: string,
    favorite_dish: string;
    country_flag: number;
}

export interface LocalGuide {
    profile_picture: {
        img: string;
        alt: string
    },
    name: string,
    city: string,
    description: string,
    favorite_dish: string;
    country_flag: {
        img: string;
        alt: string
    }
}