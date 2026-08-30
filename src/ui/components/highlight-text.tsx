
import React from "react";

type HighlightTextProps = {
  children: React.ReactNode;
  className?: string;
};

export default function HighlightText({ children, className = "" }: HighlightTextProps) {
  return (
    <span className={`text-xl text-[#D24718] uppercase tracking-wide mb-2 font-dk-otago block ${className}`}>
      {children}
    </span>
  );
}
