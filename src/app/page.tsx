// import { getPageInfo, getPostInfo } from "@/lib/wp";

import { wp } from "@/lib/wp";
import { ACFHome } from "@/types/acf-home";
import "./home.css";
import Link from "next/link";
import { getNotReadyToBookSection } from "./utils/getNotReadyToBookSection";
import { Tour } from "@/types/tour";
import OurExperiencesSection from "./components/our-experiences";
import NotReadyToBook from "./components/not-ready-to-book";
import { fetchImages } from "./utils/fetchImages";

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

  const images = await fetchImages(imagesIds);
  const asFeatureInImages = await fetchImages(asFeatureInImagesId);

  const [background_image, ...imgs] = images;

  const toursRaw = await wp.getAllTours();
  console.log({asFeatureInImages});


  const tours = await Promise.all(
    toursRaw.map(async (data: Tour) => {
      const city_id = data.acf.ciudad;
      const cityData = await wp.getCity(city_id);

      const country_id = cityData.country_id;
      const countryData = await wp.getCountry(country_id);

      const image_id = data.featured_media;
      const image = await wp.getPostImage(image_id);

      return {
        ...data,
        city: cityData.city_name,
        country: countryData.country_name,
        image: image,
      }
    })
  )

  const not_ready_to_book_section = await getNotReadyToBookSection();

  const our_experiences_section = await wp.getEmbedSectionInfo("our-experiences");
  const our_experiences_section_image = await wp.getPostImage(our_experiences_section.featured_media);



  return (
    <main>
      <section className="home-first-section">
        <div className="first-section-container">
          <div className="image-container">
            <img src={background_image.img} alt={background_image.alt} loading="eager" />
          </div>
          <div className="data-container">
            <div className="logos-container">
              {imgs.map((img, i) => (
                <div className="image-container" key={img.img + i}>
                  <img src={img.img} alt={img.alt} />
                </div>
              ))}
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
        <div className="second-section-container">
          <p>As Featured In:</p>
          <div className="imgs-container">

            {asFeatureInImages.map((img, i) => (
              <div className="img-container" key={img.img + i}>
                <img src={img.img} alt={img.alt} />
              </div>
            ))}
            
          </div>
        </div>
      </section>
      <section className="third-section">
        <div className="content" dangerouslySetInnerHTML={{ __html: content }}>
        </div>
      </section>
      <OurExperiencesSection
        title={our_experiences_section.title}
        content={our_experiences_section.content}
        src={our_experiences_section_image.img}
        alt={our_experiences_section_image.alt}
      />
      <section className="home-fourth-section">
        <div className="title-section">
          <h2>Just relax, <br /> we 've got it cover</h2>
          <p><span>Everything's included.</span> We handle the details and most dietary needs. Just show up ready to enjoy</p>
        </div>
        <div className="tours-section">
          {tours.reverse().map((tour, i) => (
            <Link className="tour-card" key={tour.city + i} href={`/city/${tour.slug}`}>
              <div className="img-container">
                <img src={tour.image.img} alt={tour.image.alt} />
              </div>
              <div className="tour-data">
                <h4>{tour.city}</h4>
                <p>{tour.country}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <NotReadyToBook
        titles={not_ready_to_book_section.titles}
        posts={not_ready_to_book_section.posts}
      />
      {/* <section className="home-fifth-section not-ready-to-book">
        <div className="title-section">
          <h4>{not_ready_to_book_section.titles.title}</h4>
          <div className="subtitle" dangerouslySetInnerHTML={{ __html: not_ready_to_book_section.titles.content }}></div>
        </div>
        <div className="preview-wrapper">
          {not_ready_to_book_section.posts.map((post) => {
            return (
              <Link className="preview-item" key={post.id} href={`${process.env.NEXT_PUBLIC_BASE_URL}/travel-guide/${post.city_slug}/${post.slug}`}>
                <div className="preview-image-container">
                  <img src={post.image.img} alt={post.image.alt} loading="eager" />
                  <p className="preview-city">{post.city}</p>
                </div>
                <div className="preview-data">
                  <h3>{post.title.rendered}</h3>
                  <div className="preview-author">
                    <span>Por:</span> {post.author_name.name}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section> */}
    </main>
  );
}



