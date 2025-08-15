

import type { Metadata } from "next";
import Link from "next/link";
import Heading from "@/ui/components/heading";
import HighlightText from "@/ui/components/highlight-text";
import Paragraph from "@/ui/components/paragraph";
import FigureImage from "@/ui/components/figure-image";
import BookNowButton from "@/ui/components/book-now";

export const metadata: Metadata = {
    title: "Discover the Best Coffee in Chiapas, Mexico | Sherpa Food Tours",
    description: "Explore the rich coffee culture of Chiapas and Oaxaca, Mexico. Learn about the best coffee regions, sustainable brands, and unique flavor profiles with Sherpa Food Tours.",
    openGraph: {
        title: "Discover the Best Coffee in Chiapas, Mexico | Sherpa Food Tours",
        description: "Explore the rich coffee culture of Chiapas and Oaxaca, Mexico. Learn about the best coffee regions, sustainable brands, and unique flavor profiles with Sherpa Food Tours.",
        images: [
            {
                url: "/chiapas.jpg",
                width: 1200,
                height: 630,
                alt: "A cozy coffee shop in Chiapas, Mexico, with local decor and fresh coffee on the table."
            }
        ]
    }
};

export default function TravelGuideCityPage() {
    return (
        <main className="bg-[#EFF0E9] min-h-screen text-[#000] font-excelsior" aria-labelledby="main-heading">
            <section className="py-16 px-4 pt-26 pb-14" aria-label="Coffee in Chiapas, Mexico">
                <FigureImage
                    src="/chiapas.jpg"
                    alt="A cozy coffee shop in Chiapas, Mexico, with local decor and fresh coffee on the table."
                    caption="A cozy coffee shop in Chiapas, Mexico, with local decor and fresh coffee on the table."
                    className="lg:max-w-4xl lg:h-[60vh] lg:overflow-hidden"
                />
                <div className="pt-6 max-w-2xl mx-auto">
                    <Heading level={1} id="main-heading">
                        Discover the Best Coffee in Mexico: A Guide to Rich and Flavorful Brews
                    </Heading>
                    <div className="w-full text-base leading-relaxed">
                        <Paragraph>
                            If you're searching for the best coffee in Mexico, you're in for an exceptional experience. Mexican coffee is celebrated worldwide for its rich, complex flavors and premium quality, making it a favorite among coffee enthusiasts. Mexican coffees are crafted using 100% Arabica beans grown at high altitudes in regions like Chiapas, Oaxaca, and Veracruz. These beans deliver distinctive flavors with notes of chocolate, nuts, and spices, earning them global recognition.
                        </Paragraph>
                        <Paragraph>
                            Renowned brands such as{' '}
                            <Link href="https://www.cafemarino.com.mx/" target="_blank" rel="noopener noreferrer" className="underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#017E80]">Marino Coffee</Link>
                            {' '}and BUNA Coffee lead the way in sustainability and ethical sourcing. Marino Coffee offers hand-roasted beans from Chiapas, Veracruz, and Oaxaca, highlighting citrus and chocolate undertones. <Link href="https://buna.mx/" target="_blank" rel="noopener noreferrer" className="underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#017E80]"> BUNA Coffee</Link> focuses on ecosystem regeneration and features organic blends with flavors like piloncillo, cacao, and nuts. For the ultimate experience, consider single-origin Mexican coffee from regions like the El Triunfo Biosphere Reserve. These Fairtrade and Organic coffees not only taste amazing but also support local communities. From light, fruity Veracruz Reserve to bold, chocolatey Oaxaca Reserve, Mexican coffee caters to every palate with its diverse and captivating flavors.
                        </Paragraph>
                    </div>
                </div>
                <div className="pt-8 max-w-2xl mx-auto">
                    <HighlightText>A Tour Through Mexico’s Coffee Regions</HighlightText>
                </div>
                {[1, 2].map((i) => (
                    <div className="pt-8 max-w-2xl mx-auto" key={i}>
                        <Heading level={2}>
                            The Highlands of Chiapas and Oaxaca
                        </Heading>
                        <div className="w-full text-base leading-relaxed">
                            <Paragraph>
                                Mexico's coffee landscape is richly diverse, and two of its most renowned coffee-growing regions are Chiapas and Oaxaca. Located in the southern part of the country, these regions boast high altitudes, fertile volcanic soils, and a climate that is ideal for coffee production.
                            </Paragraph>
                            <Paragraph>
                                Chiapas, for instance, is known for its rich, nutty flavor profiles, often described as having a medium body and balanced acidity with notes of chocolate and nuts.
                            </Paragraph>
                            <Paragraph>
                                In Oaxaca, the coffee is characterized by a more complex taste, featuring notes of fruit and chocolate. The region's unique microclimates and high altitudes contribute to the distinct flavor profiles, making Oaxacan coffee a favorite among those who appreciate a lighter to medium body with bright acidity and citrus and floral undertones.
                            </Paragraph>
                        </div>
                    </div>
                ))}
                <div className="pt-8">
                    <FigureImage
                        src="/chiapas.jpg"
                        alt="A cozy coffee shop in Chiapas, Mexico, with local decor and fresh coffee on the table."
                        caption="A cozy coffee shop in Chiapas, Mexico, with local decor and fresh coffee on the table."
                    />
                </div>
                <div className="pt-8 max-w-2xl mx-auto">
                    <Heading level={2}>
                        The Highlands of Chiapas and Oaxaca
                    </Heading>
                    <div className="w-full text-base leading-relaxed">
                        <Paragraph>
                            Mexico's coffee landscape is richly diverse, and two of its most renowned coffee-growing regions are Chiapas and Oaxaca. Located in the southern part of the country, these regions boast high altitudes, fertile volcanic soils, and a climate that is ideal for coffee production.
                        </Paragraph>
                        <Paragraph>
                            Chiapas, for instance, is known for its rich, nutty flavor profiles, often described as having a medium body and balanced acidity with notes of chocolate and nuts.
                        </Paragraph>
                        <Paragraph>
                            In Oaxaca, the coffee is characterized by a more complex taste, featuring notes of fruit and chocolate. The region's unique microclimates and high altitudes contribute to the distinct flavor profiles, making Oaxacan coffee a favorite among those who appreciate a lighter to medium body with bright acidity and citrus and floral undertones.
                        </Paragraph>
                    </div>
                </div>
            </section>
            <section className="bg-[#EFF0E9] py-16 px-4 md:py-26 sm:hidden">
                <div className="bg-white p-4">
                    <FigureImage
                        src="/chiapas.jpg"
                        alt="A cozy coffee shop in Chiapas, Mexico, with local decor and fresh coffee on the table."
                        caption="A cozy coffee shop in Chiapas, Mexico, with local decor and fresh coffee on the table."
                        className="pb-4"
                    />
                    <div>
                        <Heading level={3} className="font-dk-otago uppercase text-xl text-[#017E80]">
                            Mexico City Private Experience
                        </Heading>
                        <p className="font-excelsior">An upscale dinner journey through Roma Norte’s culinary icons</p>
                    </div>
                    <div>
                        <div className="flex justify-between items-center gap-4 pt-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <img src="/icons/clock.svg" alt="Clock icon" className="w-6 h-6 inline-block" />
                                    <p className="text-xs text-[#116C63]">DURATION</p>
                                </div>
                                <p>3 - 4 hours</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <img src="/icons/group.svg" alt="Calendar icon" className="w-6 h-6 inline-block" />
                                    <p className="text-xs text-[#116C63]">GROUP SIZE</p>
                                </div>
                                8 - 12 people
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 pt-4">
                                <img src="/icons/knife.svg" alt="Calendar icon" className="w-6 h-6 inline-block" />
                                <p className="text-xs text-[#116C63]">WHAT’S INCLUDED</p>
                            </div>
                            <p>10+ tasting and drinks</p>
                        </div>
                        <div className="pt-4">
                            <p className="text-right text-lg">From: <span className="font-bold">USD 90</span></p>
                        </div>
                        <div className="flex justify-between items-center gap-4 pt-4">
                            <Link href="/tours" className="py-2 text-[#017E80] underline text-sm">Learn More</Link>
                            <BookNowButton />
                        </div>
                    </div>
                </div>
            </section>
            <section className="hidden sm:block bg-[#EFF0E9] py-16 px-4">
                <div className="flex max-w-2xl mx-auto gap-6 h-62">
                    <FigureImage
                        src="/chiapas.jpg"
                        alt="A cozy coffee shop in Chiapas, Mexico, with local decor and fresh coffee on the table."
                        caption="A cozy coffee shop in Chiapas, Mexico, with local decor and fresh coffee on the table."
                        className="p-4 border border-[#B9B9B9] w-1/4 h-full ml-0"
                        imgClassName="h-full object-cover"
                    />
                    <div className="w-3/4">
                        <div className="flex justify-between">
                            <p>MEXICO PRIVATE EXPERIENCE</p>
                            <p className="text-right text-sm">From: <span className="font-bold">USD 90</span></p>
                        </div>
                        <div className="border-b border-t border-[#B9B9B9] py-4 my-4 flex justify-between items-center">
                            <div>
                                <div className="flex items-center gap-2">
                                    <img src="/icons/clock.svg" alt="Clock icon" className="w-6 h-6 inline-block" />
                                    <p className="text-xs text-[#116C63]">DURATION</p>
                                </div>
                                <p>3 - 4 hours</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <img src="/icons/group.svg" alt="Calendar icon" className="w-6 h-6 inline-block" />
                                    <p className="text-xs text-[#116C63]">GROUP SIZE</p>
                                </div>
                                8 - 12 people
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <img src="/icons/knife.svg" alt="Calendar icon" className="w-6 h-6 inline-block" />
                                    <p className="text-xs text-[#116C63]">WHAT’S INCLUDED</p>
                                </div>
                                <p>10+ tasting and drinks</p>
                            </div>
                        </div>
                        <div>
                            <p>Explore the Palermo neighborhood of Buenos Aires through
                                your taste buds with this small-group tour.</p>
                        </div>
                        <div className="flex justify-between items-center gap-4 pt-4">
                            <Link href="/tours" className="py-2 text-[#017E80] underline text-sm">Learn More</Link>
                            <BookNowButton />
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-2xl mx-auto">
                <div>
                    <HighlightText>A Lasting Impression</HighlightText>
                    <div className="w-full text-base leading-relaxed">
                        <Paragraph>
                            Mexico's coffee landscape is richly diverse, and two of its most renowned coffee-growing regions are Chiapas and Oaxaca. Located in the southern part of the country, these regions boast high altitudes, fertile volcanic soils, and a climate that is ideal for coffee production.
                        </Paragraph>
                        <Paragraph>
                            Chiapas, for instance, is known for its rich, nutty flavor profiles, often described as having a medium body and balanced acidity with notes of chocolate and nuts.
                        </Paragraph>
                        <Paragraph>
                            In Oaxaca, the coffee is characterized by a more complex taste, featuring notes of fruit and chocolate. The region's unique microclimates and high altitudes contribute to the distinct flavor profiles, making Oaxacan coffee a favorite among those who appreciate a lighter to medium body with bright acidity and citrus and floral undertones.
                        </Paragraph>
                    </div>
                </div>
            </section>
        </main>
    );
}