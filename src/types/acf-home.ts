

export interface ACFHome {
    kicker: string;
    subhedline: string;
    google_logo: number;
    tripadvisor_medal: number;
    tripadvisor_logo: number;
    /** Cantidad de reseñas de Google mostrada en el hero. Editable en ACF. */
    google_reviews_amount?: number;
    /** Cantidad de reseñas de TripAdvisor mostrada en el hero. Editable en ACF. */
    tripadvisor_reviews_amount?: number;
    /** Estrellas mostradas junto al medallón de TripAdvisor (1-5). Editable en ACF. */
    rating_stars?: number;
    first_img: number;
    second_img: number;
    third_img: number;
    first_memory: number;
    second_memory: number;
    third_memory: number;
    fourth_memory: number;
    fifth_memory: number;
    sixth_memory: number;
    seventh_memory: number;
    eighth_memory: number;
    ninth_memory: number;
    tenth_memory: number;
    order_cities?: number[];
}