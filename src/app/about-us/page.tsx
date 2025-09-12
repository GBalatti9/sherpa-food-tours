import { wp } from "@/lib/wp";
import "./about-us.css";
import { AboutUsInfo, AcfData, LocalGuide, ValueItem } from "./types";
import MeetLocalGuides from "@/ui/components/meet-local-guides";

type YearACF = {
    year: number,
    description: string,
    extra_info: string,
    image: number,
};



export default async function AboutUsPage() {

    const { content, acf }: AboutUsInfo = await wp.getPageInfo("about");
    // console.log({ title, content, acf });

    // Función para obtener entradas de ACF según un filtro
    const getACFEntries = (acf: AcfData, keyIncludes: string, validator: (item: ValueItem) => void) =>
        Object.entries(acf)
            .filter(([key, value]) => key.includes(keyIncludes) && validator(value))
            .map(([, value]) => value);

    const hasTitle = (item: ValueItem) => item?.title?.trim().length > 0;

    const values = getACFEntries(acf, "value", hasTitle);
    const localGuides = getACFEntries(acf, "local_guide", () => true);

    // Carga de imágenes
    const loadValueImages = (items: ValueItem[]) =>
        Promise.all(
            items.map(async (item) => ({
                ...item,
                background_image: await wp.getPostImage(item.background_image),
            }))
        );

    const loadGuideImages = (items: LocalGuide[]) =>
        Promise.all(
            items.map(async (item) => ({
                ...item,
                profile_picture: await wp.getPostImage(item.profile_picture),
            }))
        );

    const [acfData, acfDataLocalGuides] = await Promise.all([
        loadValueImages(values),
        loadGuideImages(localGuides),
    ]);

    const our_story_section = await wp.getEmbedSectionInfo("our-story");
    const our_story_section_acf = our_story_section.acf as Record<string, YearACF>;


    // const yearsArray = Object.entries(our_story_section_acf).map(([key, value]) => ({
    //     key,
    //     ...value
    // })).filter(item => item.year && String(item.year).trim().length > 0);


    const acfLocalGuidesCorrect = await Promise.all(acfDataLocalGuides.map(async (element) => {
        
        const countryFlag = await wp.getPostImage(element.country_flag)
        return {
            ...element,
            country_flag: countryFlag
        }
    }))



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
                <div className="local-guide-container">
                    <MeetLocalGuides localGuides={acfLocalGuidesCorrect} />
                </div>
                {/* <h2 className="section-title">Meet your local guides</h2>
                <div className="value-cards-container">
                    {acfDataLocalGuides.map((element, i) => (
                        <div className="value-card" key={element.name + i}>
                            <div className="value-card-personal-info">
                                <div className="img-container">
                                    <img src={element.profile_picture.img} alt={element.profile_picture.alt} />
                                </div>
                                <div className="value-card-titles">
                                    <p className="value-card-name">{element.name}</p>
                                    <p>{element.city}</p>
                                </div>
                            </div>
                            <hr />
                            <div className="value-card-description">
                                <p>{element.description}</p>
                                <div className="value-card-last-section">
                                    <p className="last-section-title">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                            <path d="M4.83398 2.08374V15.0699" stroke="#017E80" strokeWidth="1.29861" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M2.88672 2.40845V5.65498C2.88672 7.27825 4.83464 7.27825 4.83464 7.27825C4.83464 7.27825 6.78256 7.27825 6.78256 5.65498V2.40845" stroke="#017E80" strokeWidth="1.29861" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M12.6265 7.60285H10.0293V4.68097C10.0293 2.08374 12.6265 2.08374 12.6265 2.08374V7.60285ZM12.6265 7.60285V15.0699" stroke="#017E80" strokeWidth="1.29861" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Favorite Dish
                                    </p>
                                    <p>{element.favorite_dish}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div> */}
            </section>
            {/* <section className="our-story-section">
                <div className="title-container">
                    <h3>{our_story_section.title}</h3>
                </div>
                <div className="timeline">
                    {yearsArray.map((year, index) => (
                        <div
                            className={`data-container ${index % 2 === 0 ? 'left' : 'right'}`}
                            key={year.year}
                        >
                            <p className="year">
                                {year.year}
                            </p>
                            <div className="circle"></div>
                        </div>
                    ))}
                </div>
            </section> */}
        </main>
    )
}

export const revalidate = false; // Completamente estático
export const dynamic = 'force-static';
export const fetchCache = 'force-cache'; // Cachea todos los fetch
export const dynamicParams = false; // No genera rutas dinámicas