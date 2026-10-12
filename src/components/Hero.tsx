"use client";

import { useRef } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { portfolioCopy, portfolioData } from "@/data/portfolio";
import { COMPACT_LAYOUT_QUERY } from "@/lib/useCompactLayout";
import styles from "./Hero.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function Hero() {
  const container = useRef<HTMLElement>(null);
  const copy = portfolioCopy.hero;
  useGSAP(
    () => {
      if (!container.current) return;
      const heading = container.current.querySelector("h1");
      if (!heading) return;
      const lines = heading.querySelectorAll<HTMLElement>(
        `.${styles.lineInner}`,
      );
      const masks = heading.querySelectorAll<HTMLElement>(
        `.${styles.lineMask}`,
      );
      const media = gsap.matchMedia();

      media.add(
        {
          all: "all",
          compact: COMPACT_LAYOUT_QUERY,
          reducedMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { compact, reducedMotion } = context.conditions ?? {};
          if (reducedMotion) return;

          gsap.fromTo(
            lines,
            { yPercent: 105, skewY: compact ? 1.25 : 1.5, rotation: compact ? 0.3 : 0.45 },
            {
              yPercent: 0,
              skewY: 0,
              rotation: 0,
              duration: compact ? 0.72 : 0.95,
              stagger: compact ? 0.09 : 0.13,
              ease: "power3.out",
              clearProps: "transform",
            },
          );

          const departures = compact ? [-5, 4, -3] : [-8, 6, -4];
          gsap.fromTo(masks, { xPercent: 0 }, {
            xPercent: (index) => departures[index % departures.length],
            ease: "none",
            scrollTrigger: {
              trigger: heading,
              start: "clamp(top 16%)",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        },
      );

      return () => media.revert();
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
      <div className="hero-meta">
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
        className="hero-heading"
      >
        {copy.lines.map((line, index) => (
          <span key={line} className={styles.lineMask} aria-hidden="true">
            <span className={styles.lineInner}>
              {line}
              {index === copy.lines.length - 1 && (
                <span className="accent-period">.</span>
              )}
            </span>
          </span>
        ))}
      </h1>
      <div className="hero-bottom">
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
      <div className="hero-footnote">
        <span>{copy.discipline}</span>
        <a href="#projects">
          {copy.scroll}
          <ArrowDownRight size={14} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
