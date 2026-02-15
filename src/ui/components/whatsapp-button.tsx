"use client";

import Link from "next/link";

function buildWhatsAppUrl(value: string): string {
  if (value.startsWith("http")) return value;
  const cleaned = value.replace(/[\s\-()]/g, "");
  return `https://wa.me/${cleaned}`;
}

export default function WhatsAppFloatingButton({ whatsapp }: { whatsapp: string }) {
  const href = buildWhatsAppUrl(whatsapp);

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg hover:bg-[#20bd5a] transition-colors duration-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="white"
        className="w-8 h-8"
      >
        <path d="M16.004 0h-.008C7.174 0 .002 7.174.002 16.002c0 3.502 1.13 6.746 3.05 9.384L1.058 31.4l6.234-1.96a15.93 15.93 0 008.712 2.564c8.826 0 15.998-7.174 15.998-16.002C32.002 7.174 24.83 0 16.004 0zm9.32 22.604c-.396 1.112-1.95 2.034-3.2 2.304-.856.182-1.972.326-5.732-1.232-4.81-1.992-7.908-6.876-8.146-7.196-.23-.32-1.912-2.548-1.912-4.862s1.21-3.448 1.64-3.92c.43-.472.94-.59 1.254-.59.36 0 .722.004 1.038.02.332.014.778-.126 1.218.93.456 1.092 1.548 3.78 1.684 4.056.136.276.228.598.046.962-.182.364-.274.59-.548.91-.274.32-.576.714-.822.958-.274.274-.56.572-.24 1.122.32.548 1.424 2.35 3.058 3.808 2.1 1.874 3.87 2.454 4.42 2.73.548.274.868.228 1.188-.138.32-.364 1.366-1.594 1.73-2.14.364-.548.728-.456 1.228-.274.502.182 3.182 1.502 3.728 1.776.548.274.912.41 1.048.638.136.228.136 1.32-.26 2.432z" />
      </svg>
    </Link>
  );
}
