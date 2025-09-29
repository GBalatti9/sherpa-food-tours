"use client";

export default function BookNowButton({ link, data_tour }: { link?: string; data_tour?: string }) {
  return (
    <button
      className="book-now-button"
      data-fareharbor-lightframe={data_tour}
      onClick={() => {
        if (!link) return;
        // importante: asegurarse de que el script de FareHarbor ya esté cargado
        window.location.href = link;
      }}
    >
      Book Now
    </button>
  );
}
