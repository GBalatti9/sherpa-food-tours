// components/NavBarWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import NavBar from "./nav-bar";


export default function NavBarWrapper({cities}: {cities: {id: number; city: string; slug: string; flag: {img: string; alt: string}}[]}) {
  const pathname = usePathname();
  return <NavBar currentPath={pathname} cities={cities}/>;
}
