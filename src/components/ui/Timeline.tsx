"use client";

import Image, { type StaticImageData } from "next/image";
import { useId, useRef, type CSSProperties, type KeyboardEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollImmediately } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import styles from "./Timeline.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export interface TimelineItem {
  id: string;
  period: string;
  title: string;
  role: string;
  description: string;
}

export function Timeline({ items, title, periodLabel, label, hint, image, imageAlt, headingLevel = 3 }: {
  items: TimelineItem[];
  title: string;
  periodLabel: string;
  label: string;
  hint: string;
  image?: StaticImageData;
  imageAlt?: string;
  headingLevel?: 3 | 4;
}) {
  const hintId = useId();
  const Heading = headingLevel === 4 ? "h4" : "h3";
  const root = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const slider = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);

  useGSAP(() => {
    const section = root.current;
    const frame = viewport.current;
    const track = slider.current;
    if (!section || !frame || !track || !items.length) return;
    const media = gsap.matchMedia();
    media.add({ all: "all", reduce: "(prefers-reduced-motion: reduce)", short: "(max-height: 600px)" }, context => {
      if (context.conditions?.reduce || context.conditions?.short) return;
      section.setAttribute("data-animated", "");
      if (!frame.clientWidth) { section.removeAttribute("data-animated"); return; }
      const milestones = Array.from(track.querySelectorAll<HTMLElement>("[data-milestone]")).map(element => {
        const stem = element.querySelector<HTMLElement>("[data-stem]");
        const dot = element.querySelector<HTMLElement>("[data-dot]");
        const content = Array.from(element.querySelectorAll<HTMLElement>("[data-reveal]"));
        gsap.set(stem, { scaleY: 0 });
        gsap.set(dot, { scale: 0 });
        gsap.set(content, { force3D: true, y: 24, opacity: 0 });
        return {
          element,
          left: 0,
          eased: undefined as number | undefined,
          stem: gsap.quickSetter(stem, "scaleY"),
          dotX: gsap.quickSetter(dot, "scaleX"),
          dotY: gsap.quickSetter(dot, "scaleY"),
          content: content.map(node => ({
            y: gsap.quickSetter(node, "y", "px"),
            opacity: gsap.quickSetter(node, "opacity"),
          })),
        };
      });
      let width = 0;
      let travel = 0;
      const distance = () => travel;
      const measure = () => {
        width = frame.clientWidth;
        travel = Math.max(0, track.scrollWidth - width);
        const left = frame.getBoundingClientRect().left;
        const x = Number(gsap.getProperty(track, "x"));
        for (const milestone of milestones) {
          milestone.left = milestone.element.getBoundingClientRect().left - left - x;
        }
        section.style.setProperty("--timeline-travel", `${travel}px`);
      };
      measure();
      const reveal = () => {
        const offset = Number(gsap.getProperty(track, "x"));
        for (const milestone of milestones) {
          const x = milestone.left + offset;
          const amount = gsap.utils.clamp(0, 1, (width * 0.95 - x) / (width * 0.42));
          const eased = 1 - Math.pow(1 - amount, 3);
          if (milestone.eased === eased) continue;
          milestone.eased = eased;
          milestone.stem(eased);
          milestone.dotX(eased);
          milestone.dotY(eased);
          for (const content of milestone.content) {
            content.y(24 * (1 - eased));
            content.opacity(eased);
          }
        }
      };
      const animation = gsap.timeline({
        defaults: { ease: "none" },
        onUpdate: reveal,
        scrollTrigger: {
          trigger: section,
          start: () => `top top+=${(document.querySelector(".site-header")?.getBoundingClientRect().height ?? 88) + 12}`,
          end: () => `+=${Math.max(1, distance())}`,
          scrub: true,
          invalidateOnRefresh: true,
          onRefreshInit: measure,
          onRefresh: reveal,
        },
      });
      animation.to(track, { x: () => -distance(), duration: 1 }, 0)
        .fromTo(progress.current, { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
      trigger.current = animation.scrollTrigger ?? null;
      reveal();
      const resize = new ResizeObserver(() => {
        const nextWidth = frame.clientWidth;
        const nextTravel = Math.max(0, track.scrollWidth - nextWidth);
        if (width === nextWidth && travel === nextTravel) return;
        measure();
        ScrollTrigger.refresh();
      });
      resize.observe(frame);
      return () => {
        resize.disconnect();
        trigger.current = null;
        section.removeAttribute("data-animated");
        section.style.removeProperty("--timeline-travel");
      };
    });
    return () => media.revert();
  }, { scope: root, dependencies: [items.length], revertOnUpdate: true });

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const scroll = trigger.current;
    if (!scroll || event.target !== event.currentTarget || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const frame = viewport.current!;
    const track = slider.current!;
    const distance = Math.max(1, track.scrollWidth - frame.clientWidth);
    const x = Number(gsap.getProperty(track, "x"));
    const left = frame.getBoundingClientRect().left;
    const stops = [0, ...Array.from(track.querySelectorAll<HTMLElement>("[data-milestone]")).map(item =>
      gsap.utils.clamp(0, 1, (item.getBoundingClientRect().left - left - x - (frame.clientWidth - item.offsetWidth) / 2) / distance)), 1];
    const next = event.key === "Home" ? 0 : event.key === "End" ? 1
      : event.key === "ArrowRight" ? stops.find(stop => stop > scroll.progress + 0.002) ?? 1
      : stops.reverse().find(stop => stop < scroll.progress - 0.002) ?? 0;
    scrollImmediately(scroll.start + next * (scroll.end - scroll.start));
  }

  if (!items.length) return null;
  return (
    <div ref={root} className={styles.root} style={{ "--milestone-count": items.length } as CSSProperties}>
      <div ref={viewport} className={styles.viewport} tabIndex={0} role="group" aria-label={label} aria-describedby={hintId} onKeyDown={onKeyDown}>
        <div ref={slider} className={styles.slider}>
          <div className={styles.intro}>
            {image && <div className={styles.portrait}><Image src={image} alt={imageAlt ?? ""} fill sizes="280px" /></div>}
            <p className={styles.introTitle}>{title}</p>
            <p className={styles.periodLabel}>{periodLabel}</p>
          </div>
          <ol className={styles.milestones} aria-label={label}>
            <li role="presentation" className={styles.baseline} aria-hidden="true"><div ref={progress} className={styles.progress} /></li>
            {items.map((item, index) => (
              <li key={item.id} data-milestone className={cn(styles.milestone, index % 2 ? styles.bottom : styles.top)} style={{ gridColumn: index + 1 }}>
                <div data-stem className={styles.stem} aria-hidden="true" />
                <div data-dot className={styles.dot} aria-hidden="true" />
                <div data-reveal>
                  <p className={styles.period}>{item.period}</p>
                  <Heading className={styles.company}>{item.title}</Heading>
                  <p className={styles.role}>{item.role}</p>
                </div>
                <ul data-reveal className={styles.description}>
                  {item.description.split("\n").filter(Boolean).map(line => <li key={line}>{line.replace(/^[•-]\s*/, "")}</li>)}
                </ul>
              </li>
            ))}
          </ol>
        </div>
        <p id={hintId} className={styles.hint}>{hint}</p>
      </div>
    </div>
  );
}
