"use client";

import { useCallback, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { portfolioCopy, portfolioData } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCarousel, type ProjectCarouselHandle } from "@/components/ui/ProjectCarousel";
import { scrollImmediately } from "@/lib/scroll";
import { COMPACT_LAYOUT_QUERY } from "@/lib/useCompactLayout";
import { cn } from "@/lib/utils";
import styles from "./Projects.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function Projects() {
  const copy = portfolioCopy.projects;
  const [index, setIndex] = useState(0);
  const projects = portfolioData.projects;
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const carousel = useRef<ProjectCarouselHandle>(null);
  const scrollTrigger = useRef<ScrollTrigger | null>(null);

  const selectProject = useCallback((next: number) => {
    const trigger = scrollTrigger.current;
    if (trigger && projects.length > 1) {
      carousel.current?.seek(next);
      scrollImmediately(trigger.start + (next / (projects.length - 1)) * (trigger.end - trigger.start));
    }
    setIndex(next);
  }, [projects.length]);

  useGSAP(() => {
    const root = section.current;
    const runway = track.current;
    const sticky = panel.current;
    if (!root || !runway || !sticky || projects.length < 2) return;
    const media = gsap.matchMedia();
    media.add({ all: "all", reduce: "(prefers-reduced-motion: reduce)" }, context => {
      if (context.conditions?.reduce) return;
      root.setAttribute("data-scroll-driven", "");
      if (!runway.offsetHeight) { root.removeAttribute("data-scroll-driven"); return; }
      const position = { value: 0 };
      const animation = gsap.to(position, {
        value: projects.length - 1,
        ease: "none",
        onUpdate: () => {
          carousel.current?.seek(position.value);
          setIndex(Math.round(position.value));
        },
        scrollTrigger: {
          trigger: runway,
          start: () => {
            const top = (document.querySelector(".site-header")?.getBoundingClientRect().height ?? 88) + 12;
            const start = window.matchMedia(COMPACT_LAYOUT_QUERY).matches ? Math.max(top, window.innerHeight * 0.3) : top;
            return `top top+=${start}`;
          },
          end: "bottom bottom-=12",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      scrollTrigger.current = animation.scrollTrigger ?? null;
      return () => {
        scrollTrigger.current = null;
        carousel.current?.seek(null);
        root.removeAttribute("data-scroll-driven");
      };
    });
    return () => media.revert();
  }, { scope: section, dependencies: [projects.length], revertOnUpdate: true });
  const project = projects[index] ?? projects[0];

  return (
    <section ref={section} id="projects" className={cn("section-shell content-section projects-section", styles.section)} style={{ "--carousel-scroll-steps": Math.max(0, projects.length - 1) } as CSSProperties}>
      <SectionHeading number={copy.number} title={copy.title} description={copy.intro} />
      {project && <>
        <div ref={track} className={cn("project-scroll-track", styles.track)}><div ref={panel} className={cn("project-scroll-panel", styles.panel)}>
        <ProjectCarousel ref={carousel} projects={projects} index={index} onIndexChange={selectProject} />
        </div></div>
      </>}
      <a href="#contact" className="text-link work-contact-prompt">{portfolioCopy.mobile.contactPrompt}<ArrowUpRight size={18} aria-hidden="true" /></a>
    </section>
  );
}
