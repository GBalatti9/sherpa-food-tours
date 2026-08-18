
import { wp } from "@/lib/wp";
import { ACFHome } from "@/types/acf-home";
import Link from "next/link";
import { getNotReadyToBookSection } from "./utils/getNotReadyToBookSection";
import OurExperiencesSection from "./components/our-experiences";
import NotReadyToBook from "./components/not-ready-to-book";
import { fetchImages } from "./utils/fetchImages";
import MainImage from "@/ui/components/main-image";
import AsFeaturedIn from "@/ui/components/as-featured-in";
import { City } from "@/types/city";
import Memories from "./components/memories";
import { Metadata } from "next";
import { optimizedUrl } from "@/lib/wp-media";
import { buildOrganizationSchema, getBaseUrl, getOrganizationData, ORGANIZATION_ID, WEBSITE_ID } from "@/lib/schema";
// import DiscountBanner from "@/ui/components/discount-banner";
// import MarqueeBanner from "@/ui/components/marquee-banner";

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const pageInfo = await wp.getPageInfo("home");
  const { title, content } = pageInfo;

  // Extract description from content or use default
  const description = content
    ? content
      .replace(/<[^>]*>/g, '')
      .replace(/&#\d+;/g, '')
      .replace(/&[a-zA-Z]+;/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 155)
    : "Experience authentic food tours around the world. Enjoy local flavors, cultural insights, and unique culinary adventures in top cities with Sherpa Food Tours.";

  return {
    title: `${title} | Sherpa Food Tours - Authentic Culinary Experiences`,
    description,
    keywords: [
      "food tours",
      "Buenos Aires food tours", // ⭐ Focus keyword
      "food tours Buenos Aires", // ⭐ Focus keyword
      "culinary tours",
      "authentic food experiences",
      "local food tours",
      "walking food tours",
      "street food tours",
      "food and culture tours",
      "gourmet tours",
      "food adventures",
      "culinary experiences",
      "food tastings",
      "food travel",
      "cultural food tours",
      "best food tours",
      "food tour guides",
      "local cuisine",
      "foodie experiences",
      "travel food tours",
      "international food tours",
      "food and wine tours"
    ],
    authors: [{ name: "Sherpa Food Tours" }],
    creator: "Sherpa Food Tours",
    publisher: "Sherpa Food Tours",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://www.sherpafoodtours.com/'),
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: `${title} | Sherpa Food Tours`,
      description,
      url: 'https://www.sherpafoodtours.com/',
      siteName: 'Sherpa Food Tours',
      images: [
        {
          url: '/sherpa-main-image.webp',
          width: 1200,
          height: 630,
          alt: 'Sherpa Food Tours - Authentic Culinary Experiences Worldwide',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Sherpa Food Tours`,
      description,
      images: ['/sherpa-main-image.webp'],
      creator: '@sherpafoodtours',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function Home() {

  const baseUrl = getBaseUrl();
  const organizationData = await getOrganizationData();

  const pageInfo = await wp.getPageInfo("home");
  const acf: ACFHome = pageInfo.acf;

  const { title, content, featured_media } = pageInfo;

  const imagesIds = [
    featured_media,
    acf.google_logo,
    acf.tripadvisor_medal,
    acf.tripadvisor_logo
  ]

  const asFeatureInImagesId = [
    acf.first_img,
    acf.second_img,
    acf.third_img
  ]

  const memoriesImagesIds = [
    acf.first_memory,
    acf.second_memory,
    acf.third_memory,
    acf.fourth_memory,
    acf.fifth_memory,
    acf.sixth_memory,
    acf.seventh_memory,
    acf.eighth_memory,
    acf.ninth_memory,
    acf.tenth_memory
  ]

  const images = await fetchImages(imagesIds);

  const asFeatureInImages = await fetchImages(asFeatureInImagesId);
  const memories = await fetchImages(memoriesImagesIds);


  const [background_image, google_logo, tripadvisor_medal, tripadvisor_logo] = images;

  // Logos y contadores del hero: salen de ACF; si el campo está vacío en WP se cae
  // a los assets de /public y a los valores históricos, para no romper el bloque.
  const socialProof = {
    googleLogo: acf.google_logo ? google_logo : null,
    tripadvisorMedal: acf.tripadvisor_medal ? tripadvisor_medal : null,
    tripadvisorLogo: acf.tripadvisor_logo ? tripadvisor_logo : null,
    googleReviews: Number(acf.google_reviews_amount) || 2000,
    tripadvisorReviews: Number(acf.tripadvisor_reviews_amount) || 15000,
    stars: Math.min(5, Math.max(1, Math.round(Number(acf.rating_stars)) || 5)),
  };

  const citiesRaw = await wp.getAllCities();

  let cities = await Promise.all(
    citiesRaw.map(async (data: City) => {

      const country_id = data.acf.pais;
      let countryData = null;
      if (country_id) {
        countryData = await wp.getCountry(country_id);
      }

      const image_id = data.featured_media;
      const image = await wp.getPostImage(image_id);

      return {
        id: data.id,
        city: data.title.rendered,
        slug: data.slug,
        country: countryData ? countryData.country_name : null,
        image: image,
      }
    })
  )

  if (acf.order_cities) {
    const order = acf.order_cities;
    cities = cities.sort((a, b) => {
      const indexA = order.indexOf(a.id);
      const indexB = order.indexOf(b.id);
      return indexA - indexB;
    });
  }



  const not_ready_to_book_section = await getNotReadyToBookSection();


  const our_experiences_section = await wp.getEmbedSectionInfo("our-experiences");

  let data_our_experiences_section = null;

  if (our_experiences_section && our_experiences_section.acf) {
    const formattedData = {
      title: our_experiences_section.title,
      items: [
        {
          title: our_experiences_section.acf.first_item.title,
          description: our_experiences_section.acf.first_item.description,
          image: await wp.getPostImage(our_experiences_section.acf.first_item.image),
        },
        {
          title: our_experiences_section.acf.second_item.title,
          description: our_experiences_section.acf.second_item.description,
          image: await wp.getPostImage(our_experiences_section.acf.second_item.image),
        },
        {
          title: our_experiences_section.acf.third_item.title,
          description: our_experiences_section.acf.third_item.description,
          image: await wp.getPostImage(our_experiences_section.acf.third_item.image),
        }],
    }

    data_our_experiences_section = formattedData;

  }


  // Generate structured data for SEO.
  // Sin aggregateRating: Google no soporta review markup a nivel negocio y lo descarta
  // entero como "Review: Invalid object type for field <parent_node>". Las estrellas de
  // rich results se emiten desde el Product de cada página de tour.
  const structuredData = buildOrganizationSchema(baseUrl, organizationData, {
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Food Tours",
      "itemListElement": cities.map((city) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "TouristTrip",
          "name": `${city.city} Food Tour`,
          "description": `Authentic food tour experience in ${city.city}${city.country ? `, ${city.country}` : ''}`,
          "touristType": "Food Lovers",
          "url": `${baseUrl}/city/${city.slug}/`,
          "itinerary": {
            "@type": "ItemList",
            "name": `${city.city} Food Tour Itinerary`
          }
        }
      }))
    }
  });

  // WebSite schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    "url": baseUrl + "/",
    "name": "Sherpa Food Tours",
    "description": organizationData.description,
    "publisher": {
      "@id": ORGANIZATION_ID
    }
  };

  return (
    <>
      {/* Sin preload manual del hero: apuntaba a la URL cruda de WordPress, que desde la
          migración al optimizador ya no se renderiza en ningún <img>. El browser bajaba esa
          imagen al pedo y en alta prioridad, compitiendo contra el LCP real. El <Image
          priority> de MainImage ya emite el preload correcto, con imageSrcSet. */}

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      <main role="main">
        {/* <DiscountBanner /> */}
        <section className="home-first-section" aria-label="Hero section with company information">
          <div className="first-section-container">
            <div className="image-container">
              <MainImage
                src={background_image.img}
                alt={background_image.alt}
              />
            </div>
            <div className="data-container">
              <div className="logos-container">
                <div className="logo-container">
                  <div className="img-container">
                    <img
                      src={socialProof.googleLogo?.img ?? "/google.webp"}
                      alt={socialProof.googleLogo?.alt || "Google's logo"}
                      loading="eager"
                      width="80"
                      height="40"
                    />
                  </div>
                  <div className="review">
                    <p>{socialProof.googleReviews} reviews</p>
                  </div>
                </div>
                <div className="logo-container">
                  <div className="img-container">
                    <img
                      src={socialProof.tripadvisorMedal?.img ?? "/trip.webp"}
                      alt={socialProof.tripadvisorMedal?.alt || "TripAdvisor logo"}
                      loading="eager"
                      width="80"
                      height="40"
                    />
                  </div>
                  <div className="review star" role="img" aria-label={`${socialProof.stars} star rating`}>
                    {Array.from({ length: socialProof.stars }).map((_, i) => (
                      <svg
                        key={"star-" + i}
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="#f2b203"
                        stroke="#f2b203"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                    {/* {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={"star-" + i} size={14} fill="#f2b203" stroke="#f2b203" />
                    ))} */}
                  </div>
                </div>
                <div className="logo-container">
                  <div className="img-container">
                    <img
                      src={socialProof.tripadvisorLogo?.img ?? "/tripadvisor-logo.webp"}
                      alt={socialProof.tripadvisorLogo?.alt || "TripAdvisor logo"}
                      loading="eager"
                      width="80"
                      height="40"
                    />
                  </div>
                  <div className="review">
                    <p>{socialProof.tripadvisorReviews} reviews</p>
                  </div>
                </div>
              </div>
              <div className="info-container">
                <p className="info-container-kicker" role="banner">{acf.kicker}</p>
                <h1 className="info-container-title">{title}</h1>
                <div className="xl-container">
                  <p className="info-container-subheadline">{acf.subhedline}</p>
                  <p className="info-container-kicker xl">{acf.kicker}</p>
                </div>
              </div>
            </div>
          </div>

        </section>
        <section className="home-second-section" aria-label="As featured in section">
          <AsFeaturedIn asFeatureInImages={asFeatureInImages} />
        </section>
        <section className="third-section" aria-label="About our food tours">
          <div className="content" dangerouslySetInnerHTML={{ __html: content }}>
          </div>
        </section>
        {data_our_experiences_section &&
          <OurExperiencesSection
            title={data_our_experiences_section.title}
            items={data_our_experiences_section.items}
          />
        }
        <section className="home-fourth-section" aria-label="Available food tour destinations">
          <header className="title-section">
            <h2>Just relax, <br /> we&apos;ve got it covered</h2>
            <p><span>Everything&apos;s included.</span> We handle the details and most dietary needs. Just show up ready to enjoy</p>
          </header>
          <div className="mt-10 bg-[var(--main-color)] py-10">
            <div className="mx-auto w-full max-w-[1280px] px-5 py-8 md:px-8 lg:px-10">
              <div className="mb-8 text-center">
                <h2 className="font-dk-otago text-[2rem] leading-none text-white md:text-[2.5rem] lg:text-[3rem]">
                  Our Cities
                </h2>
              </div>
              <div
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7"
                role="list"
                aria-label="List of available food tour destinations"
              >
                {cities.map((city, i) => (
                  <Link
                    className="group block bg-white p-3 shadow-[0_10px_24px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out hover:-translate-y-1 md:p-4"
                    key={city.slug + i}
                    href={`/city/${city.slug}/`}
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-[#f3f3ef]">
                      <img
                        src={optimizedUrl(city.image.img, 640)}
                        alt={`${city.city} food tour destination image`}
                        loading="lazy"
                        width="300"
                        height="200"
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="bg-white px-5 pb-4 pt-5 text-center md:px-6 md:pb-5">
                      <h3 className="font-dk-otago text-[1.9rem] leading-tight text-[var(--title-color)] md:text-[2.15rem]">
                        {city.city}
                      </h3>
                      <p className="mt-1 font-excelsior text-[1rem] uppercase tracking-[0.08em] text-[#4B4B4B] md:text-[1.05rem]">
                        {city.country}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
        {(not_ready_to_book_section.titles && not_ready_to_book_section.posts) &&
          <NotReadyToBook
            titles={not_ready_to_book_section.titles}
            posts={not_ready_to_book_section.posts}
          />
        }
        {memories.length > 0 &&
          <section className="home-last-section" aria-label="Customer memories and experiences">
            <Memories memories={memories} />
          </section>
        }

      </main>
    </>
  );


}

export const revalidate = 86400;

// export const dynamic = "error"; // obliga a que sea estática
// export const revalidate = false;

// export const revalidate = 0;
// export const dynamic = "force-dynamic";
