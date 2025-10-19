
import { wp } from "@/lib/wp";
import { ACFHome } from "@/types/acf-home";
import "./home.css";
import Link from "next/link";
import { getNotReadyToBookSection } from "./utils/getNotReadyToBookSection";
import OurExperiencesSection from "./components/our-experiences";
import NotReadyToBook from "./components/not-ready-to-book";
import { fetchImages } from "./utils/fetchImages";
import MainImage from "@/ui/components/main-image";
import AsFeaturedIn from "@/ui/components/as-featured-in";
import { Star } from "lucide-react";
import { City } from "@/types/city";
import Memories from "./components/memories";
import { Metadata } from "next";

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const pageInfo = await wp.getPageInfo("home");
  const { title, content } = pageInfo;
  
  // Extract description from content or use default
  const description = content 
    ? content.replace(/<[^>]*>/g, '').substring(0, 160) + '...'
    : "Experience authentic food tours around the world. Enjoy local flavors, cultural insights, and unique culinary adventures in top cities with Sherpa Food Tours.";

  return {
    title: `${title} | Sherpa Food Tours - Authentic Culinary Experiences`,
    description,
    keywords: [
      "food tours",
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
    metadataBase: new URL('https://sherpafoodtours.com'),
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: `${title} | Sherpa Food Tours`,
      description,
      url: 'https://sherpafoodtours.com',
      siteName: 'Sherpa Food Tours',
      images: [
        {
          url: '/sherpa-complete-logo.png',
          width: 1200,
          height: 630,
          alt: 'Sherpa Food Tours - Authentic Culinary Experiences',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Sherpa Food Tours`,
      description,
      images: ['/sherpa-complete-logo.png'],
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
    verification: {
      google: 'your-google-verification-code', // Replace with actual verification code
    },
  };
}

export default async function Home() {

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


  const [background_image, ...imgs] = images;
  console.log(imgs);
  


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


  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Sherpa Food Tours",
    "description": "Authentic food tours and culinary experiences around the world",
    "url": "https://sherpafoodtours.com",
    "logo": "https://sherpafoodtours.com/sherpa-complete-logo.png",
    "image": "https://sherpafoodtours.com/sherpa-complete-logo.png",
    "telephone": "+1-555-123-4567", // Replace with actual phone number
    "email": "info@sherpafoodtours.com", // Replace with actual email
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US",
      "addressLocality": "New York",
      "addressRegion": "NY"
    },
    "sameAs": [
      "https://www.facebook.com/sherpafoodtours",
      "https://www.instagram.com/sherpafoodtours",
      "https://www.tiktok.com/@sherpafoodtours"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "4649",
      "bestRating": "5",
      "worstRating": "1"
    },
    "offers": {
      "@type": "Offer",
      "category": "Food Tours",
      "description": "Authentic culinary experiences and food tours in major cities worldwide"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Food Tours",
      "itemListElement": cities.map((city, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "TouristTrip",
          "name": `${city.city} Food Tour`,
          "description": `Authentic food tour experience in ${city.city}, ${city.country}`,
          "touristType": "Food Lovers",
          "itinerary": {
            "@type": "ItemList",
            "name": `${city.city} Food Tour Itinerary`
          }
        }
      }))
    }
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <main role="main">
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
                    src="/google.png" 
                    alt="Google's logo" 
                    loading="eager" 
                    fetchPriority="high"
                    width="80"
                    height="40"
                  />
                </div>
                <div className="review">
                  <p>400 reviews</p>
                </div>
              </div>
              <div className="logo-container">
                <div className="img-container">
                  <img 
                    src="/trip.webp" 
                    alt="TripAdvisor logo"
                    loading="eager" 
                    fetchPriority="high"
                    width="80"
                    height="40"
                  />
                </div>
                <div className="review star" role="img" aria-label="5 star rating">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={"star-" + i} size={14} fill="#f2b203" stroke="#f2b203" />
                  ))}
                </div>
              </div>
              <div className="logo-container">
                <div className="img-container">
                  <img 
                    src="/tripadvisor-logo.png" 
                    alt="TripAdvisor logo"
                    loading="eager" 
                    fetchPriority="high"
                    width="80"
                    height="40"
                  />
                </div>
                <div className="review">
                  <p>4.649 reviews</p>
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
          <h2>Just relax, <br /> we &apos;ve got it cover</h2>
          <p><span>Everything&apos;s included.</span> We handle the details and most dietary needs. Just show up ready to enjoy</p>
        </header>
        <div className="tours-section">
          <div className="tours-container" role="list" aria-label="List of available food tour destinations">
            {cities.map((city, i) => (
              <Link 
                className="tour-card" 
                key={city.slug + i} 
                href={`/city/${city.slug}`}
              >
                <div className="img-container">
                  <img 
                    src={city.image.img} 
                    alt={`${city.city} food tour destination image`}
                    loading="lazy"
                    width="300"
                    height="200"
                  />
                </div>
                <div className="tour-data">
                  <h3>{city.city}</h3>
                  <p>{city.country}</p>
                </div>
              </Link>
            ))}
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
