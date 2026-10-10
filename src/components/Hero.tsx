"use client";

import { useRef } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { portfolioCopy, portfolioData } from "@/data/portfolio";
import { prefersReducedMotion } from "@/lib/motion";

export function Hero() {
  const container = useRef<HTMLElement>(null);
  const copy = portfolioCopy.hero;
  useGSAP(
    () => {
      if (!container.current || prefersReducedMotion()) return;
      gsap.from(".hero-enter", {
        y: 18,
        opacity: 0,
        duration: 0.65,
        stagger: 0.07,
        ease: "power2.out",
        clearProps: "all",
      });
    },
    { scope: container },
  );

  return (
    <section
      id="home"
      ref={container}
      className="hero section-shell"
      aria-labelledby="hero-heading"
    >
      <div className="hero-meta hero-enter">
        <span>{portfolioData.personal.name}</span>
        <span className="availability">
          <span aria-hidden="true" />
          {copy.availability}
        </span>
      </div>
      <h1
        id="hero-heading"
        tabIndex={-1}
        aria-label={portfolioData.personal.role}
        className="hero-heading hero-enter"
      >
        {copy.lines.map((line, index) => (
          <span key={line}>
            {line}
            {index === copy.lines.length - 1 && (
              <span className="accent-period">.</span>
            )}
          </span>
        ))}
      </h1>
      <div className="hero-bottom hero-enter">
        <p>{portfolioData.personal.bio}</p>
        <div className="hero-links">
          <a href="#projects" className="text-link">
            <span className="desktop-copy">{copy.work}</span>
            <span className="compact-copy">{portfolioCopy.mobile.work}</span>
            <ArrowDownRight size={23} aria-hidden="true" />
          </a>
          <a
            href="/Rrezon_Curraj_CV.pdf"
            download
            className="text-link muted-link hero-cv"
          >
            {copy.cv}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="hero-footnote hero-enter">
        <span>{copy.discipline}</span>
        <a href="#projects">
          {copy.scroll}
          <ArrowDownRight size={14} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
