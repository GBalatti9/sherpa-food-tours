"use client";

import Link from "next/link";
import { MouseEvent } from "react";

type AskForItProps = {
  isButton?: boolean;
  className?: string;
};

const scrollToAskForIt = (event: MouseEvent<HTMLElement>) => {
  event.preventDefault();

  if (typeof document === "undefined") return;

  const section = document.getElementById("askForIt");
  if (!section) return;

  const navbar = document.querySelector("nav");
  const offset = navbar ? navbar.getBoundingClientRect().height + 16 : 0;
  const top = section.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({ top, behavior: "smooth" });
};

export default function AskForIt({
  isButton = false,
  className = "book-now-button",
}: AskForItProps) {
  if (isButton) {
    return (
      <button type="button" className={className} onClick={scrollToAskForIt}>
        Ask For It
      </button>
    );
  }

  return (
    <Link href="#askForIt" className={className} onClick={scrollToAskForIt}>
      Ask For It
    </Link>
  );
}
