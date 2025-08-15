
import React from "react";

type HeadingProps = {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  id?: string;
  className?: string;
};

export default function Heading({
  level = 1,
  children,
  id,
  className = "",
}: HeadingProps) {
  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;
  const base =
    level === 1
      ? "text-3xl leading-tight tracking-tight text-[#017E80] w-full mb-4"
      : level === 2
      ? "text-2xl tracking-wide mb-2 text-[#017E80]"
      : "text-xl mb-2";
  return (
    <Tag id={id} className={`${base} ${className}`}>
      {children}
    </Tag>
  );
}
