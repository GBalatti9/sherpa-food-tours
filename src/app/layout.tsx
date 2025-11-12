import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/free-mode';
// import NavBar from "@/ui/cmponents/nav-bar";
import Footer from "../ui/components/footer";
import NavBarWrapper from "@/ui/components/nav-bar-wrapper";
import { wp } from "@/lib/wp";
import FareharborScript from "@/ui/components/FareharborScript";
import Script from "next/script";
import { Cookies } from "./Cookies";
import MarketingScripts from "@/ui/components/marketing-scripts";

const excelsior = localFont({
  src: [
    {
      path: "./fonts/Excelsior.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Excelsior_Italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-excelsior",
});

const dkOtago = localFont({
  src: "./fonts/DK_Otago.woff2",
  variable: "--font-dk-otago",
  weight: "400",
  style: "normal",
});


export const metadata: Metadata = {
  title: "Sherpa Food Tours - Best Food Tours & Culinary Experiences Worldwide",
  description: "Experience authentic food tours around the world. Enjoy local flavors, cultural insights, and unique culinary adventures in top cities.",
  keywords: [
    "food tours",
    "culinary tours",
    "best food tours worldwide",
    "gourmet tours",
    "local food tours",
    "walking food tours",
    "street food tours",
    "food experiences",
    "authentic culinary experiences",
    "food and culture tours",
    "unique food tours",
    "food tours with local guides",
    "top city food tours",
    "culinary experiences in top cities",
    "international food tours",
    "cultural food tours",
    "food adventures",
    "food tastings",
    "food and wine tours",
    "food travel experiences"
  ],
  creator: "Gastón Balatti",
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const citiesRaw = await wp.getAllCities(); // fetch server-side directo
  let cities: { city: string; slug: string; flag: { img: string; alt: string } }[] = [];

  if (citiesRaw && citiesRaw.length > 0) {
    cities = await Promise.all(
      citiesRaw.map(async (city: {
        title: { rendered: string };
        slug: string;
        acf: { country_flag: number };
      }) => {
        return {
          city: city.title.rendered,
          slug: city.slug,
          flag: await wp.getPostImage(city.acf.country_flag)
        };
      })
    );
  }

  return (
    <html lang="en">
      <head>
        <Cookies />
      </head>
      <body className={`${excelsior.variable} ${dkOtago.variable} antialiased`}>

        {/* <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=572272225503800&ev=PageView&noscript=1"
          />
        </noscript> */}
        <NavBarWrapper cities={cities} />
        {children}
        <Footer cities={cities} />
        <FareharborScript />

        <MarketingScripts />
      </body>
    </html>
  );
}

