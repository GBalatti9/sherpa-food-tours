export const GA_ID: string | undefined = process.env.NEXT_PUBLIC_GA_ID;

export const pageview = (url: string): void => {
  if (!GA_ID || typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("config", GA_ID, {
    page_path: url,
  });
};

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}


