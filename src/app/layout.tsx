import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/free-mode';
// import NavBar from "@/ui/components/nav-bar";
import Footer from "./components/footer";
import NavBarWrapper from "@/ui/components/nav-bar-wrapper";
import { wp } from "@/lib/wp";
import Script from "next/script";

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
  let cities = null;
  if (citiesRaw && citiesRaw.length > 0) {
    cities = citiesRaw.map((city: { title: { rendered: string }; slug: string }) => { return { city: city.title.rendered, slug: city.slug } })
  }

  return (
    <html lang="en">
      <body className={`${excelsior.variable} ${dkOtago.variable} antialiased`}>
        <NavBarWrapper cities={cities} />
        {children}
        <Footer />


        <Script
          src="https://fareharbor.com/embeds/api/v1/?autolightframe=yes"
          strategy="afterInteractive"
        />

        
      </body>
    </html>
  );
}
