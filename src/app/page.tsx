
import { wp } from "@/lib/wp";
import { ACFHome } from "@/types/acf-home";
import "./home.css";
import Link from "next/link";
import { getNotReadyToBookSection } from "./utils/getNotReadyToBookSection";
// import { Tour } from "@/types/tour";
import OurExperiencesSection from "./components/our-experiences";
import NotReadyToBook from "./components/not-ready-to-book";
import { fetchImages } from "./utils/fetchImages";
import MainImage from "@/ui/components/main-image";
import AsFeaturedIn from "@/ui/components/as-featured-in";
import { Star } from "lucide-react";
import { City } from "@/types/city";
import Memories from "./components/memories";

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
  //console.log("PAGE!!:", {acf, asFeatureInImagesId});
  
  const asFeatureInImages = await fetchImages(asFeatureInImagesId);
  const memories = await fetchImages(memoriesImagesIds);


  const [background_image, ...imgs] = images;


  const citiesRaw = await wp.getAllCities();

  const cities = await Promise.all(
    citiesRaw.map(async (data: City) => {

      const country_id = data.acf.pais;
      let countryData = null;
      if (country_id) {
        countryData = await wp.getCountry(country_id);
      }

      const image_id = data.featured_media;
      const image = await wp.getPostImage(image_id);

      return {
        city: data.title.rendered,
        slug: data.slug,
        country: countryData ? countryData.country_name : null,
        image: image,
      }
    })
  )


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

  // const our_experiences_section_image = await wp.getPostImage(our_experiences_section.featured_media);

  // return null
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
                  <img src="/google.webp" alt="Google's logo" />
                </div>
                <div className="review">
                  <p>400 reviews</p>
                </div>
              </div>
              <div className="logo-container">
                <div className="img-container">
                  <img src="/trip.webp" />
                </div>
                <div className="review star">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={"star-" + i} size={14} fill="#f2b203" stroke="#f2b203" />
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
            </div>
            <div className="info-container">
              <p className="info-container-kicker">{acf.kicker}</p>
              <h1 className="info-container-title">{title}</h1>
              <div className="xl-container">
                <p className="info-container-subheadline">{acf.subhedline}</p>
                <p className="info-container-kicker xl">{acf.kicker}</p>
              </div>
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
      {data_our_experiences_section &&
        <OurExperiencesSection
          title={data_our_experiences_section.title}
          items={data_our_experiences_section.items}
        />
      }
      <section className="home-fourth-section">
        <div className="title-section">
          <h2>Just relax, <br /> we &apos;ve got it cover</h2>
          <p><span>Everything&apos;s included.</span> We handle the details and most dietary needs. Just show up ready to enjoy</p>
        </div>
        <div className="tours-section">
          <div className="tours-container">
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
        </div>
      </section>
      {(not_ready_to_book_section.titles && not_ready_to_book_section.posts) &&
        <NotReadyToBook
          titles={not_ready_to_book_section.titles}
          posts={not_ready_to_book_section.posts}
        />
      }
      {memories.length > 0 &&
        <section className="home-last-section">
          <Memories memories={memories} />
        </section>
      }

    </main>
  );


}


export const dynamic = "error"; // obliga a que sea estática
export const revalidate = false;

// export const revalidate = 0;
// export const dynamic = "force-dynamic";
