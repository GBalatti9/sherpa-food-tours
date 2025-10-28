import { notFound } from "next/navigation";

const pagesToKeep = [
  "traditional-argentine-drinks-and-where-to-try-them",
  "argentinian-desserts-list",
  "best-croquettes-in-amsterdam",
  "savour-the-traditions-the-best-spots-to-drink-mate-in-buenos-aires",
  "best-surinam-restaurants-amsterdam",
  "ultimate-guide-to-argentinas-food-culture",
  "sports-passion-in-buenos-aires-the-5-best-sports-bars",
  "best-dishoom-in-london",
  "cocktails-in-the-clouds-the-ultimate-rooftop-bars-in-buenos-aires",
  "where-italy-meets-argentina-best-italian-restaurants-in-buenos-aires",
  "explore-these-3-michelin-star-restaurants-in-buenos-aires",
  "michelin-star-restaurants-mexico-city",
  "best-ice-cream-in-argentina",
  "7-must-visit-breweries-in-buenos-aires-for-craft-beer-lovers",
  "best-restaurants-in-roma-norte-cdmx",
  "poulette-restaurants-in-paris",
  "traditional-argentine-drinks",
];

export default function Page({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  if (!pagesToKeep.includes(slug)) {
    notFound();
  }

  return null;
//   return <YourArticleTemplate slug={slug} />;
}
