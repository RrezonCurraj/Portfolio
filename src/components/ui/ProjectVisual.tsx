"use client";

import { type ReactNode, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { COMPACT_LAYOUT_QUERY } from "@/lib/useCompactLayout";
import styles from "./ProjectVisual.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function ProjectVisual({
  href,
  label,
  index,
  external = false,
  className,
  children,
}: {
  href: string;
  label: string;
  index: number;
  external?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const visual = useRef<HTMLAnchorElement>(null);

  useGSAP(() => {
    const frame = visual.current;
    if (!frame || !frame.querySelector("img")) return;
    const media = gsap.matchMedia();
    media.add({
      all: "all",
      compact: COMPACT_LAYOUT_QUERY,
      reduce: "(prefers-reduced-motion: reduce)",
    }, context => {
      if (context.conditions?.reduce) return;
      const compact = context.conditions?.compact;
      const panels = frame.querySelectorAll(`.${styles.panel}`);
      const image = frame.querySelector(`.${styles.imageMotion}`);
      gsap.set(panels, {
        rotationX: 0,
        opacity: 1,
        transformPerspective: 900,
        transformOrigin: "50% 100%",
      });
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: frame,
          start: "top 88%",
          end: compact ? "top 30%" : "top 26%",
          scrub: true,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "none" },
      });
      timeline
        .to(panels, { rotationX: -90, duration: 0.76, stagger: 0.12 }, 0)
        .to(panels, { opacity: 0, duration: 0.08, stagger: 0.12 }, 0.68)
        .fromTo(image,
          { scale: compact ? 1.14 : 1.2, yPercent: compact ? 3 : 5 },
          { scale: 1, yPercent: 0, duration: 1 }, 0);
    });
    return () => media.revert();
  }, { scope: visual });

  return (
    <Link ref={visual} href={href} className={cn("project-visual", styles.frame, className)}
      aria-label={label} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      <span className={cn("project-image-motion", styles.imageMotion)}>
        <span className="project-image-hover">{children}</span>
      </span>
      <span className={styles.panel} aria-hidden="true" />
      <span className={styles.panel} aria-hidden="true" />
      <span className={styles.panel} aria-hidden="true" />
      <span className="project-index">{String(index + 1).padStart(2, "0")}</span>
    </Link>
  );
}
