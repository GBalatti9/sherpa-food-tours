"use client";

export default function BookNowButton({ link, data_tour }: { link?: string; data_tour?: string }) {
  console.log({link, data_tour});
  
  return (
    !link ? (
      <button
        className="book-now-button"
        disabled={true}
        style={{opacity: ".8", pointerEvents: "none"}}
        type="button"
      >
        Book Now
      </button>
    ) : (
      <button
        className="book-now-button"
        type="button"
        data-fareharbor-lightframe={data_tour}
        onClick={(e) => {
          e.preventDefault();
          if (!link) return;
          // Create a temporary anchor so FareHarbor lightframe intercepts the click
          const tempAnchor = document.createElement("a");
          tempAnchor.href = link;
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
    )
  );
}
