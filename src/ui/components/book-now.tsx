"use client";

export default function BookNowButton({ link, data_tour }: { link?: string; data_tour?: string }) {
  return (
    !link ?
      <button
        className="book-now-button"
        disabled={true}
        style={{opacity: ".8", pointerEvents: "none"}}
      >
        Book Now
      </button>
      :
      
      <a href={link} target="_blank" rel="noopener noreferrer" className="book-now-button" data-fareharbor-lightframe={data_tour}>Book Now</a>
  );
}
