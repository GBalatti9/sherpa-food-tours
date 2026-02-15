import { MetadataRoute } from 'next'
import { wp } from '@/lib/wp'
import { safeFetch } from './utils/safeFetch';
import { slugify } from './helpers/slugify';
import { getAllTravelGuides } from './utils/all-travel-guide';


// Optimizado: remover force-dynamic para permitir cache estático
// El sitemap se regenerará cada hora automáticamente
export const revalidate = 3600; // se regenera cada hora

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.sherpafoodtours.com';

  // Get all cities for dynamic routes
  const cities = await safeFetch(() => wp.getAllCities(), [], 'getAllCities');
  const cityUrls = cities.map((city: { slug: string }) => ({
    url: `${baseUrl}/city/${city.slug}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Get all tours for dynamic routes
  const tours = await safeFetch(() => wp.getAllTours(), [], 'getAllTours');
  const tourUrls = tours.map((tour: { slug: string }) => ({
    url: `${baseUrl}/tour/${tour.slug}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Get all travel guide posts
  const travelGuides = await getAllTravelGuides();
  const travelGuideUrls = travelGuides.flatMap((guide) => {
    // Obtenemos las ciudades de forma segura
    const cities = guide.relaciones?.ciudades?.filter(Boolean) || [{ title: "default-city" }];
    
    return cities.map((city: { title: string }) => {
      const citySlug = slugify(city.title || "default-city");
      const url = `${baseUrl}/travel-guide/${citySlug}/${guide.slug}/`;
  
      return {
        url,
        lastModified: new Date(guide.modified),
        changeFrequency: 'monthly',
        priority: 0.6,
      };
    });
  });

  // Get all authors for dynamic routes
  const authors = await safeFetch(() => wp.getAllUsers(), { ok: false, data: [] }, 'getAllUsers');
  const authorUrls = authors.ok && authors.data 
    ? authors.data
        .filter((author: { name: string; slug?: string; description?: string }) => 
          author.name?.toLowerCase() !== "admin" && author.description
        )
        .map((author: { slug?: string; name?: string }) => {
          const userSlug = author.slug || author.name?.toLowerCase().replace(/\s+/g, "") || "user";
          return {
            url: `${baseUrl}/author/${userSlug}/`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
          };
        })
    : [];


  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about-us/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/travel-guide/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contacto/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...cityUrls,
    ...tourUrls,
    ...travelGuideUrls,
    ...authorUrls,
  ];
}
