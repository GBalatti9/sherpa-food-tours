"use client";

const FAREHARBOR_BOOK_URL =
  "https://fareharbor.com/embeds/book/sherpafoodtours_argentina/?flow=1413860&ga4t=G-KJV962ZQ3V,1083513053.1749557566__1758810037;AW-16551382136,undefined__undefined;&language=en-us&full-items=yes&back=https://www.sherpafoodtours.com/&g4=yes";

export default function BookNowButton({ link, data_tour }: { link?: string; data_tour?: string }) {
  const href = link || FAREHARBOR_BOOK_URL;

  return (
    <button
      className="book-now-button"
      type="button"
      data-fareharbor-lightframe={data_tour}
      onClick={(e) => {
        e.preventDefault();
        const tempAnchor = document.createElement("a");
        tempAnchor.href = href;
        if (data_tour) {
          tempAnchor.setAttribute("data-fareharbor-lightframe", data_tour);
        }
        tempAnchor.style.display = "none";
        document.body.appendChild(tempAnchor);
        tempAnchor.click();
        tempAnchor.remove();
      }}
    >
      Book Now
    </button>
  );
}
