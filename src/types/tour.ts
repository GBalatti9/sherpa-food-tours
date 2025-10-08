export interface Tour {
  id: number;
  date: string; // ISO string
  date_gmt: string; // ISO string
  guid: {
    rendered: string;
  };
  modified: string; // ISO string
  modified_gmt: string; // ISO string
  slug: string;
  status: 'publish' | 'draft' | 'pending' | string;
  type: string; // normalmente 'tours'
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  featured_media: number;
  template: string;
  class_list: string[];
  acf: {
    ciudad: number; // id de la ciudad
  };
}

export interface TourRelationship {
  link: string;
  id: number;
  title: string;
}

export interface TourFormatted extends TourRelationship {
  title: string,
  content: string;
  featured_media: number;
  slug: string;
  acf: {
    ciudad: number;
    duration: string;
    group_size: string;
    what_is_included: string;
    price: string;
    fareharbor: {
      link: string;
    }
  },
  image: {
    img: string;
    alt: string;
  }
}