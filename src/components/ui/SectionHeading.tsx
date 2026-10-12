"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { COMPACT_LAYOUT_QUERY } from "@/lib/useCompactLayout";
import { cn } from "@/lib/utils";
import styles from "./SectionHeading.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function SectionHeading({
  number,
  title,
  description,
  compactTitle,
}: {
  number: string;
  title: string;
  description?: string;
  compactTitle?: string;
}) {
  const heading = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const root = heading.current;
    if (!root) return;
    const media = gsap.matchMedia();
    media.add({
      all: "all",
      compact: COMPACT_LAYOUT_QUERY,
      reduce: "(prefers-reduced-motion: reduce)",
    }, context => {
      if (context.conditions?.reduce ||
          (context.conditions?.compact && root.closest(".disclosure-desktop-heading"))) return;
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 90%",
          end: "top 48%",
          scrub: true,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "none" },
      });
      timeline
        .fromTo(root.querySelector(`.${styles.titleInner}`),
          { yPercent: 105, skewY: context.conditions?.compact ? 1 : 1.5 },
          { yPercent: 0, skewY: 0 }, 0)
        .fromTo(root.querySelector(`.${styles.rule}`),
          { scaleX: 0 }, { scaleX: 1 }, 0);
    });
    return () => media.revert();
  }, { scope: heading });

  return (
    <div ref={heading} className={cn("section-heading", styles.heading)}>
      <div className="section-heading-title">
        <span className="section-number">{number}</span>
        <h2 className={styles.titleMask}><span className={styles.titleInner}>{compactTitle ? <><span className="desktop-copy">{title}</span><span className="compact-copy">{compactTitle}</span></> : title}</span></h2>
      </div>
      {description && <p>{description}</p>}
      <span className={styles.rule} aria-hidden="true" />
    </div>
  );
}
