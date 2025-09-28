import { wp } from "@/lib/wp";
import "./about-us.css";
import { AboutUsInfo, AcfData, LocalGuide, ValueItem } from "./types";
import MeetLocalGuides from "@/ui/components/meet-local-guides";
import OurValues from "./components/our-values";
import type { OurStory } from "@/types/our-story";
import OurStoryComponent from "./components/our-story";

// type YearACF = {
//     year: number,
//     description: string,
//     extra_info: string,
//     image: number,
// };



export default async function AboutUsPage() {

    const { content, acf }: AboutUsInfo = await wp.getPageInfo("about");
    console.log({ acf });

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

    let our_story: OurStory = {
        title: "",
        items: []
    }

    if (acf.our_story) {
        our_story.title = acf.our_story.title;

        const formattedYears = Object.entries(acf.our_story.years).map(([, value]) => value);
        const completeYears = await Promise.all(formattedYears.map(async (element) => {
            console.log({ element });

            if (!element.image_2019) return {...element, image: null};
            const img = await wp.getPostImage(element.image_2019);
            return {
                ...element,
                image: img
            }
        }))
        our_story.items = completeYears.filter(
            (element) => element.title !== "" && element.title !== null
        );
    }

    console.log({ our_story });


    // const our_story_section = await wp.getEmbedSectionInfo("our-story");
    // const our_story_section_acf = our_story_section.acf as Record<string, YearACF>;


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
                <h1>The <img src="https://hotpink-whale-908624.hostingersite.com/wp-content/uploads/2025/09/Layer_1.png" alt="Sherpa logo" /> manifesto</h1>
                <div dangerouslySetInnerHTML={{ __html: content }} className="render-html"></div>
            </section>
            <OurValues items={acfData} />
            <section className="about-us-page-third-section">
                <div className="local-guide-container-page">
                    <MeetLocalGuides localGuides={acfLocalGuidesCorrect} />
                </div>
            </section>
            <OurStoryComponent our_story={our_story}/>
        </main>
    )
}

export const dynamic = "error";
export const revalidate = false;
export const dynamicParams = false;