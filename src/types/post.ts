export interface WPPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: { rendered: string };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: {
    _acf_changed: boolean;
    footnotes: string;
  };
  categories: number[];
  tags: number[];
  class_list: string[];
  acf: {
    tours: string;
    ciudades: number[];
    paises: number[];
    key: string | null;
  };
  relaciones: {
    tours: (WPRelation | null)[];
    ciudades: (WPRelation | null)[];
    paises: (WPRelation | null)[];
  };
}

export interface WPRelation {
  id: number;
  title: string;
  link: string;
}

export interface FormattedWpPost extends WPPost {
  image: {
    img: string;
    alt: string;
  };
  author_name: {
    name: string;
  };
  city: string;
  city_slug: string;
  key: string | null;
}