
import { wp } from "@/lib/wp";
import { ACFHome } from "@/types/acf-home";
import "./home.css";
import Link from "next/link";
import { getNotReadyToBookSection } from "./utils/getNotReadyToBookSection";
import { Tour } from "@/types/tour";
import OurExperiencesSection from "./components/our-experiences";
import NotReadyToBook from "./components/not-ready-to-book";
import { fetchImages } from "./utils/fetchImages";
import MainImage from "@/ui/components/main-image";
import AsFeaturedIn from "@/ui/components/as-featured-in";
import { Star } from "lucide-react";

export default async function Home() {

  const pageInfo = await wp.getPageInfo("home");
  const acf: ACFHome = pageInfo.acf;

  console.log({ acf });


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

  const citiesRaw = await wp.getAllCities();

  const cities = await Promise.all(
    citiesRaw.map(async (data) => {
      const country_id = data.acf.pais;
      const countryData = await wp.getCountry(country_id);

      const image_id = data.featured_media;
      const image = await wp.getPostImage(image_id);

      return {
        city: data.title.rendered,
        slug: data.slug,
        country: countryData.country_name,
        image: image,
      }
    })
  )


  // const tours = await Promise.all(
  //   citiesRaw.map(async (data: Tour) => {
  //     const city_id = data.acf.ciudad;
  //     const cityData = await wp.getCity(city_id);

  //     const country_id = cityData.country_id;
  //     const countryData = await wp.getCountry(country_id);

  //     const image_id = data.featured_media;
  //     const image = await wp.getPostImage(image_id);

  //     return {
  //       ...data,
  //       city: cityData.city_name,
  //       country: countryData.country_name,
  //       image: image,
  //     }
  //   })
  // )

  const not_ready_to_book_section = await getNotReadyToBookSection();

  const our_experiences_section = await wp.getEmbedSectionInfo("our-experiences");
  const our_experiences_section_image = await wp.getPostImage(our_experiences_section.featured_media);


  return (
    <main>
      <section className="home-first-section">
        <div className="first-section-container">
          <div className="image-container">
            <MainImage src={background_image.img} alt={background_image.alt} />
          </div>
          <div className="data-container">
            <div className="logos-container">
              <div className="logo-container">
                <div className="img-container">
                  <img src="/google.png" />
                </div>
                <div className="review">
                  <p>400 reviews</p>
                </div>
              </div>
              <div className="logo-container">
                <div className="img-container">
                  <img src="/trip.png" />
                </div>
                <div className="review star">
                  {Array.from({length: 5}).map((_, i) => (
                    <Star key={"star-" + i} size={14} fill="#FFD700" stroke="#FFD700" />
                  ))}
                </div>
              </div>
              <div className="logo-container">
                <div className="img-container">
                  <img src="/tripadvisor-logo.png" />
                </div>
                <div className="review">
                  <p>4.649 reviews</p>
                </div>
              </div>
              {/* {imgs.map((img, i) => (
                <div className="image-container" key={img.img + i}>
                  <img src={img.img} alt={img.alt} />
                </div>
              ))} */}
            </div>
            <div className="info-container">
              <p className="info-container-kicker">{acf.kicker}</p>
              <h1 className="info-container-title">{title}</h1>
              <p className="info-container-subheadline">{acf.subhedline}</p>
            </div>
          </div>
        </div>

      </section>
      <section className="home-second-section">
        <AsFeaturedIn asFeatureInImages={asFeatureInImages} />
      </section>
      <section className="third-section">
        <div className="content" dangerouslySetInnerHTML={{ __html: content }}>
        </div>
      </section>
      {our_experiences_section &&
        <OurExperiencesSection
          title={our_experiences_section.title}
          content={our_experiences_section.content}
          src={our_experiences_section_image.img}
          alt={our_experiences_section_image.alt}
        />
      }
      <section className="home-fourth-section">
        <div className="title-section">
          <h2>Just relax, <br /> we &apos;ve got it cover</h2>
          <p><span>Everything&apos;s included.</span> We handle the details and most dietary needs. Just show up ready to enjoy</p>
        </div>
        <div className="tours-section">
          {cities.reverse().map((city, i) => (
            <Link className="tour-card" key={city.slug + i} href={`/city/${city.slug}`}>
              <div className="img-container">
                <img src={city.image.img} alt={city.image.alt} />
              </div>
              <div className="tour-data">
                <h4>{city.city}</h4>
                <p>{city.country}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <NotReadyToBook
        titles={not_ready_to_book_section.titles}
        posts={not_ready_to_book_section.posts}
      />
      <section className="home-last-section">
        <div className="titles">
          <img src="/sherpa-green.png" alt="Sherpa Food Tour Logo" />
          <p className="title">memories</p>
        </div>
        <div className="memories-container">
          {memories.map((memory, i) => (
            <div className="memory-container" key={memory.img + i}>
              <img src={memory.img} alt={memory.alt} />
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}


export const revalidate = false; // Completamente estático
export const dynamic = 'force-static';
export const fetchCache = 'force-cache'; // Cachea todos los fetch
export const dynamicParams = false; // No genera rutas dinámicas
