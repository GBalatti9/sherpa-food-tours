"use client";

import Script from "next/script";

export const Cookies = () => {
  return (
    <Script
      id="cookiebot"
      src="https://consent.cookiebot.com/uc.js"
      data-cbid="729496f6-91b1-40d8-96c6-0121e2352322"
      data-blockingmode="auto"
      type="text/javascript"
      strategy="beforeInteractive" 
      onError={(e) => {
        console.error('Cookiebot failed to load', e);
      }}
    />
  );
};
