import { MetadataRoute } from 'next'
import { wp } from '@/lib/wp'
import { safeFetch } from './utils/safeFetch';
import { slugify } from './helpers/slugify';
import { getAllTravelGuides } from './utils/all-travel-guide';
import { absoluteOptimizedUrl } from '@/lib/wp-media';


// Optimizado: remover force-dynamic para permitir cache estático
// El sitemap se regenerará cada hora automáticamente
export const revalidate = 3600; // se regenera cada hora

/**
 * Imagen destacada de una entrada, como URL absoluta de producción para el sitemap
 * de imágenes. Devuelve [] cuando no hay media propia: listar el fallback repetido en
 * cada URL no aporta nada a Google.
 */
async function featuredImageFor(featuredMedia?: number): Promise<string[]> {
  if (!featuredMedia) return [];
  const image = await safeFetch(
    () => wp.getPostImage(featuredMedia),
    { img: '', alt: '' },
    `getPostImage(${featuredMedia})`
  );
  if (!image.img || image.img.includes('/imagen-de-portada.webp')) return [];
  // Next no escapa las URLs de <image:loc>, y las del optimizador llevan `&` entre sus
  // query params: sin escapar, el XML queda mal formado y Google descarta el sitemap entero.
  return [absoluteOptimizedUrl(image.img, 1200).replace(/&/g, '&amp;')];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.sherpafoodtours.com').replace(/\/$/, '');

  // Get all cities for dynamic routes
  const cities = await safeFetch(() => wp.getAllCities(), [], 'getAllCities');
  const cityUrls = await Promise.all(
    cities.map(async (city: { slug: string; modified?: string; featured_media?: number }) => ({
      url: `${baseUrl}/city/${city.slug}/`,
      lastModified: city.modified ? new Date(city.modified) : new Date('2026-05-01'),
      images: await featuredImageFor(city.featured_media),
    }))
  );

  // Get all tours for dynamic routes
  const tours = await safeFetch(() => wp.getAllTours(), [], 'getAllTours');
  const tourUrls = await Promise.all(
    tours.map(async (tour: { slug: string; modified?: string; featured_media?: number }) => ({
      url: `${baseUrl}/tour/${tour.slug}/`,
      lastModified: tour.modified ? new Date(tour.modified) : new Date('2026-05-01'),
      images: await featuredImageFor(tour.featured_media),
    }))
  );

  // Get all travel guide posts
  // Only include the first city (matches generateStaticParams canonical URL).
  // Secondary city URLs are excluded to avoid sitemap/canonical mismatches.
  const travelGuides = await getAllTravelGuides();
  const travelGuideUrls = (
    await Promise.all(
      travelGuides.map(async (guide) => {
        const firstCity = guide.relaciones?.ciudades?.[0];
        const citySlug = slugify(firstCity?.title || "default-city");

        // Skip entries where citySlug is empty to prevent double-slash URLs
        if (!citySlug) return null;

        return {
          url: `${baseUrl}/travel-guide/${citySlug}/${guide.slug}/`,
          lastModified: new Date(guide.modified),
          images: await featuredImageFor(guide.featured_media as number | undefined),
        };
      })
    )
  ).filter((entry) => entry !== null);

  // Get all authors for dynamic routes
  const authors = await safeFetch(() => wp.getAllUsers(), { ok: false as const, data: null }, 'getAllUsers');
  // Filter out authors with no description (likely empty/thin pages) and verify they
  // have posts: authors without posts return 404, so listing them would be a broken sitemap entry.
  const authorCandidates = authors.ok && authors.data
    ? authors.data.filter((author: { name: string; slug?: string; description?: string }) =>
        author.name?.toLowerCase() !== "admin" && author.description && author.description.trim().length > 0
      )
    : [];

  const authorUrls = (
    await Promise.all(
      authorCandidates.map(async (author: { id: number; slug?: string; name?: string }) => {
        const posts = await safeFetch(
          () => wp.getPostsByAuthorId(author.id, 1, 0),
          { ok: false, data: null },
          `getPostsByAuthorId(${author.id})`
        );
        if (!posts.ok || !posts.data?.length) return null;

        const userSlug = author.slug || author.name?.toLowerCase().replace(/\s+/g, "") || "user";
        return {
          url: `${baseUrl}/author/${userSlug}/`,
          lastModified: new Date('2026-05-01'),
        };
      })
    )
  ).filter((entry): entry is { url: string; lastModified: Date } => entry !== null);


  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date('2026-05-31'),
    },
    {
      url: `${baseUrl}/about-us/`,
      lastModified: new Date('2026-05-01'),
    },
    {
      url: `${baseUrl}/travel-guide/`,
      lastModified: new Date('2026-05-31'),
    },
    {
      url: `${baseUrl}/contact/`,
      lastModified: new Date('2026-05-01'),
    },
    {
      url: `${baseUrl}/contacto/`,
      lastModified: new Date('2026-05-01'),
    },
    ...cityUrls,
    ...tourUrls,
    ...travelGuideUrls,
    ...authorUrls,
  ];
}
