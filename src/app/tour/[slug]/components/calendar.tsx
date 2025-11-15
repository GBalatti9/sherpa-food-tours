"use client";

export default function Calendar({link}: {link?: string}) {
  const defaultLink = "https://fareharbor.com/embeds/calendar/sherpafoodtours_argentina/items/627977/?flow=1385081&full-items=yes&fallback=simple";
  const srcLink = link || defaultLink;
  https://fareharbor.com/embeds/script/calendar/sherpafoodtours_mexico/items/628060/?flow=1385210&full-items=yes&fallback=simple
  
  
  return (
    <div className="fareharbor-calendar-wrap" style={{ minHeight: "600px" }}>
      <iframe
        key={srcLink}
        src={srcLink}
        frameBorder="0"
        width="100%"
        height="600"
        title="FareHarbor Calendar"
        style={{ border: "0" }}
        allow="payment"
      />
    </div>
  );
}
