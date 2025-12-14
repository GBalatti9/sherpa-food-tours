import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "../ui/components/footer";
import NavBarWrapper from "@/ui/components/nav-bar-wrapper";
import { wp } from "@/lib/wp";
import FareharborScript from "@/ui/components/FareharborScript";
import { Cookies } from "./Cookies";
import MarketingScripts from "@/ui/components/marketing-scripts";
import { Suspense } from "react";
import { GoogleAnalytics } from '@next/third-parties/google'

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
  display: 'swap',
  fallback: ['system-ui', 'arial'],
  preload: true,
});

const dkOtago = localFont({
  src: "./fonts/DK_Otago.woff2",
  variable: "--font-dk-otago",
  weight: "400",
  style: "normal",
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
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
  creator: "Guillermo Borthwick",
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const citiesRaw = await wp.getAllCities(); // fetch server-side directo
  let cities: { id: number; city: string; slug: string; flag: { img: string; alt: string } }[] = [];

  if (citiesRaw && citiesRaw.length > 0) {
    cities = await Promise.all(
      citiesRaw.map(async (city: {
        id: number;
        title: { rendered: string };
        slug: string;
        acf: { country_flag: number };
      }) => {
        return {
          id: city.id,
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

        {/* Preconnect para recursos críticos de terceros */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />
        <link rel="preconnect" href="https://fareharbor.com" />
        <link rel="dns-prefetch" href="https://consent.cookiebot.com" />
        {/* Preconnect para imágenes de WordPress */}
        <link rel="preconnect" href="https://staging.sherpafoodtours.com" />
        <link rel="preconnect" href="https://www.sherpafoodtours.com" />
        <link rel="preconnect" href="https://sherpafoodtours.com" />
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
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )
        }

        <Suspense fallback={null}>
          <MarketingScripts />
        </Suspense>
      </body>
    </html>
  );
}


{/* <link rel="preconnect" href="https://staging.sherpafoodtours.com" />
<link rel="dns-prefetch" href="https://staging.sherpafoodtours.com" /> */}