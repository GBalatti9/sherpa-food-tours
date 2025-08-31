// import { getPageInfo, getPostInfo } from "@/lib/wp";

import { wp } from "@/lib/wp";
import { ACFHome } from "@/types/acf-home";
import "./home.css";
import Link from "next/link";
import { getNotReadyToBookSection } from "./utils/getNotReadyToBookSection";
import { Tour } from "@/types/tour";

export default async function Home() {

  const pageInfo = await wp.getPageInfo("home");
  const acf: ACFHome = pageInfo.acf;

  const { title, content, featured_media } = pageInfo;

  const imagesIds = [
    featured_media,
    acf.google_logo,
    acf.tripadvisor_medal,
    acf.tripadvisor_logo,
  ]

  const images = await Promise.all(imagesIds.map(id => wp.getPostImage(id)));

  const [background_image, ...imgs] = images;

  const toursRaw = await wp.getAllTours();
  console.log(toursRaw[0]);
  

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

            {imgs.map((img, i) => (
              <div className="img-container" key={img.img + i}>
                <img src={img.img} alt={img.alt} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-fourth-section">
        <div className="title-section">
          <h2>Just relax, we 've got it cover</h2>
          <p>Everything's included. We handle the details and most dietary needs. Just show up ready to enjoy</p>
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
      {/* <h1>{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: content }}></div> */}

      <section className="home-fifth-section not-ready-to-book">
        <div className="title-section">
          <h4>{not_ready_to_book_section.titles.title}</h4>
          <div className="subtitle" dangerouslySetInnerHTML={{ __html: not_ready_to_book_section.titles.content }}></div>
        </div>
        <div className="preview-wrapper">
          {not_ready_to_book_section.posts.map((post) => {
            return (
              <Link className="preview-item" key={post.id} href={`${process.env.NEXT_PUBLIC_BASE_URL}/travel-guide/${post.city_slug}/${post.slug}`}>
                <div className="preview-image-container">
                  <img src={post.image.img} alt={post.image.alt} loading="eager"/>
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
      </section>
    </main>
  );
}



