// components/NavBarWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import { useFareHarbor } from "@/context/fareharbor-context";
import NavBar from "./nav-bar";


export default function NavBarWrapper({cities, tours}: {cities: {id: number; city: string; slug: string; flag: {img: string; alt: string}; fareharborLink?: string | null}[]; tours?: {slug: string; fareharborLink: string | null}[]}) {
  const pathname = usePathname();
  const { fareharborLink: contextLink } = useFareHarbor();

  // Derive fareharbor link from cities/tours data based on current page
  let fareharborLink: string | null = contextLink;
  const citySlugMatch = pathname.match(/^\/city\/([^/]+)/);
  const tourSlugMatch = pathname.match(/^\/tour\/([^/?]+)/);
  if (citySlugMatch) {
    const citySlug = citySlugMatch[1];
    const city = cities.find(c => c.slug === citySlug);
    if (city?.fareharborLink) {
      fareharborLink = city.fareharborLink;
    }
  } else if (tourSlugMatch && tours) {
    const tourSlug = tourSlugMatch[1];
    const tour = tours.find(t => t.slug === tourSlug);
    if (tour?.fareharborLink) {
      fareharborLink = tour.fareharborLink;
    }
  }

  return <NavBar currentPath={pathname} cities={cities} fareharborLink={fareharborLink} />;
}
