import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { portfolioCopy, portfolioData } from "@/data/portfolio";

export const metadata: Metadata = {
  title: `${portfolioCopy.notFound.code} | ${portfolioData.personal.name}`,
};

export default function NotFound() {
  const copy = portfolioCopy.notFound;
  return (
    <main className="section-shell flex min-h-[90svh] flex-col justify-center py-20">
      <p className="eyebrow">{copy.code}</p>
      <h1 className="case-title">
        {copy.title}
        <span className="accent-period">.</span>
      </h1>
      <p className="max-w-md text-muted text-base leading-relaxed mb-8">
        {copy.description}
      </p>
      <Link href="/" className="text-link self-start">
        <ArrowLeft size={17} aria-hidden="true" />
        {copy.back}
      </Link>
    </main>
  );
}
