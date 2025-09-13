// components/NavBarWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import NavBar from "./nav-bar";


export default function NavBarWrapper() {
  const pathname = usePathname();
  return <NavBar currentPath={pathname} />;
}
