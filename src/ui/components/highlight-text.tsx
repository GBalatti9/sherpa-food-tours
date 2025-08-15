
import React from "react";

type HighlightTextProps = {
  children: React.ReactNode;
  className?: string;
};

export default function HighlightText({ children, className = "" }: HighlightTextProps) {
  return (
    <span className={`text-xl text-[#E84F1A] uppercase tracking-wide mb-2 font-dk-otago block ${className}`}>
      {children}
    </span>
  );
}
