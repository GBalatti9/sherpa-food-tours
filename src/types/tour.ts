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
