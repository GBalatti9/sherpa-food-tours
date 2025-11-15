"use client";

import Script from "next/script";

export default function FareharborScript() {
  return (
    <Script
      src="https://fareharbor.com/embeds/api/v1/?autolightframe=yes"
      strategy="lazyOnload"
      id="fareharbor-script"
    />
  );
}
