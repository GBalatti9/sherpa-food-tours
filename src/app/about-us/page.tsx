import { wp } from "@/lib/wp";
import "./about-us.css";



export default async function AboutUsPage() {

    const { title, content, acf } = await wp.getPageInfo("about");

    console.log({ title, content, acf });

    const values = Object.entries(acf)
        .filter(([key, value]) => key.includes("value") && value.title?.trim().length > 0)
        .map(([_, value]) => value);

    const local_guides = Object.entries(acf)
        .filter(([key]) => key.includes("local_guide"))
        .map(([_, guide]) => guide);

    console.log({ local_guides });


    const promises = values.map((item) =>
        wp.getPostImage(item.background_image).then((image) => ({
            ...item,
            background_image: image,
        }))
    );

    const promisesLocalGuide = local_guides.map((item) =>
        wp.getPostImage(item.profile_picture).then((image) => ({
            ...item,
            profile_picture: image,
        }))
    );

    const acfData = await Promise.all(promises);
    const acfDataLocalGuides = await Promise.all(promisesLocalGuide);
    console.log(acfDataLocalGuides[0]);


    return (
        <main className="about-us-page">
            <section className="about-us-page-first-section">
                <h1>The Sherpa Manifesto</h1>
                <div dangerouslySetInnerHTML={{ __html: content }} className="render-html"></div>
            </section>
            <section className="about-us-page-second-section">
                <h2 className="section-title">Our Values</h2>
                <div className="value-cards-container">

                    {acfData.map((element, i) => (
                        <div className="value-card" key={element.title + i} style={{
                            backgroundImage: `url(${element.background_image.img})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center"
                        }}>
                            {/* <div className="background-img">
                            <img src={element.background_image.img} alt={element.background_image.alt} />
                            </div> */}
                            <div className="info-card">
                                <h4>{element.title}</h4>
                                <hr />
                                <p>{element.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <section className="about-us-page-third-section">
                <h2 className="section-title">Meet your local guides</h2>
                <div className="value-cards-container">
                    {acfDataLocalGuides.map((element, i) => (
                        <div className="value-card" key={element.name + i}>
                            <div className="value-card-personal-info">
                                <div className="img-container">
                                    <img src={element.profile_picture.img} alt={element.profile_picture.alt} />
                                </div>
                                <div className="value-card-titles">
                                    <p>{element.name}</p>
                                    <p>{element.city}</p>
                                </div>
                            </div>
                            <hr />
                            <div className="value-card-description">
                                <p>{element.description}</p>
                                <div className="value-card-last-section">
                                    <p>Favorite Dish</p>
                                    <p>{element.favorite_dish}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    )
}