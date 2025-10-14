import Link from "next/link";

export default function AskForIt({ link, data_tour }: { link?: string; data_tour?: string }) {
  return (
    <Link href="#askForIt" className="book-now-button">Ask For It</Link>
  );
}
