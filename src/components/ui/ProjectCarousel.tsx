"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useImperativeHandle, useRef, useState, type Ref, type KeyboardEvent, type PointerEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import { portfolioCopy, type Project } from "@/data/portfolio";
import type { ProjectCarouselEngine } from "@/lib/project-carousel";
import { cn } from "@/lib/utils";
import styles from "./ProjectCarousel.module.css";

gsap.registerPlugin(useGSAP);

export interface ProjectCarouselHandle { seek: (position: number | null) => void }

export function ProjectCarousel({ projects, index, onIndexChange, ref }: {
  projects: Project[];
  index: number;
  onIndexChange: (index: number) => void;
  ref?: Ref<ProjectCarouselHandle>;
}) {
  const copy = portfolioCopy.projects.carousel;
  const stage = useRef<HTMLDivElement>(null);
  const engine = useRef<ProjectCarouselEngine | null>(null);
  const activeIndex = useRef(index);
  const scrollPosition = useRef<number | null>(null);
  const titleStage = useRef<HTMLDivElement>(null);
  const titlePosition = useRef({ value: index });
  const titleTween = useRef<gsap.core.Tween | null>(null);
  const titleRows = useRef<{
    projects: Project[];
    titles: { element: HTMLElement; offset: number }[];
    actions: { element: HTMLElement; offset: number }[];
    descriptions: { element: HTMLElement; offset: number }[];
  } | null>(null);
  const renderTitles = useCallback((position: number) => {
    titlePosition.current.value = position;
    const host = titleStage.current;
    if (!host) return;
    if (titleRows.current?.projects !== projects) {
      const rows = (selector: string) => Array.from(host.querySelectorAll<HTMLElement>(selector), element => ({ element, offset: NaN }));
      titleRows.current = {
        projects, titles: rows("[data-carousel-title]"), actions: rows("[data-carousel-actions]"), descriptions: rows("[data-carousel-description]"),
      };
    }
    titleRows.current.titles.forEach((row, i) => {
      const offset = Math.max(-1.2, Math.min(1.2, i - position));
      if (row.offset === offset) return;
      row.offset = offset;
      const distance = Math.min(1, Math.abs(offset));
      gsap.set(row.element, {
        force3D: true,
        y: 0,
        yPercent: offset * 115,
        rotationX: offset * -12,
        skewY: offset * 2,
        opacity: Math.max(0, 1 - distance * distance * (3 - 2 * distance)),
      });
    });
    titleRows.current.actions.forEach((row, i) => {
      const offset = Math.max(-1.2, Math.min(1.2, (i - position) * 1.12));
      if (row.offset === offset) return;
      row.offset = offset;
      const distance = Math.min(1, Math.abs(offset));
      gsap.set(row.element, {
        force3D: true, y: 0, yPercent: offset * 100,
        opacity: Math.max(0, 1 - distance * distance * (3 - 2 * distance)),
      });
    });
    titleRows.current.descriptions.forEach((row, i) => {
      const offset = Math.max(-1.2, Math.min(1.2, i - position));
      if (row.offset === offset) return;
      row.offset = offset;
      const distance = Math.min(1, Math.abs(offset));
      gsap.set(row.element, {
        force3D: true, y: 0, yPercent: offset * 100,
        opacity: Math.max(0, 1 - distance * distance * (3 - 2 * distance)),
      });
    });
  }, [projects]);
  useGSAP(() => {
    renderTitles(activeIndex.current);
    return () => { titleTween.current?.kill(); titleRows.current = null; };
  }, { scope: titleStage });
  useImperativeHandle(ref, () => ({
    seek(position) {
      scrollPosition.current = position;
      titleTween.current?.kill();
      renderTitles(position ?? activeIndex.current);
      if (position === null) engine.current?.show(activeIndex.current);
      else engine.current?.seek(position);
    },
  }), [renderTitles]);
  const gesture = useRef({ x: 0, y: 0, lastX: 0, dragging: false, down: false });
  const [ready, setReady] = useState(false);
  const project = projects[index];
  const title = project.displayTitle ?? project.title;
  const destination = project.caseStudy ? `/projects/${project.slug}` : project.link;
  const move = (delta: number) => onIndexChange((index + delta + projects.length) % projects.length);

  useEffect(() => {
    activeIndex.current = index;
    if (scrollPosition.current !== null) return;
    engine.current?.show(index);
    titleTween.current?.kill();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) renderTitles(index);
    else titleTween.current = gsap.to(titlePosition.current, {
      value: index, duration: 0.65, ease: "power3.out",
      onUpdate: () => renderTitles(titlePosition.current.value),
    });
  }, [index, renderTitles]);

  useEffect(() => {
    const host = stage.current;
    if (!host || !("IntersectionObserver" in window)) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let controller = new AbortController();
    let loading = false;
    const stop = () => {
      controller.abort();
      engine.current?.dispose();
      engine.current = null;
      host.style.removeProperty("--carousel-card-width");
      host.style.removeProperty("--carousel-card-height");
      setReady(false);
    };
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting) || preference.matches || loading) return;
      loading = true;
      const signal = controller.signal;
      void import("@/lib/project-carousel")
        .then(({ createProjectCarousel }) => createProjectCarousel(host, projects, activeIndex.current, onIndexChange, stop, signal))
        .then(instance => {
          if (signal.aborted) { instance?.dispose(); return; }
          engine.current = instance;
          if (scrollPosition.current === null) instance?.show(activeIndex.current);
          else instance?.seek(scrollPosition.current);
          setReady(Boolean(instance));
        })
        .catch(() => { if (!signal.aborted) stop(); });
    }, { rootMargin: "200px" });
    const onPreference = () => {
      stop();
      controller = new AbortController();
      loading = false;
      observer.unobserve(host);
      observer.observe(host);
    };
    observer.observe(host);
    preference.addEventListener("change", onPreference);
    return () => {
      controller.abort();
      observer.disconnect();
      preference.removeEventListener("change", onPreference);
      engine.current?.dispose();
      engine.current = null;
    };
  }, [projects, onIndexChange]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Home") onIndexChange(0);
    else if (event.key === "End") onIndexChange(projects.length - 1);
    else move(event.key === "ArrowRight" ? 1 : -1);
  }
  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0 || projects.length < 2) return;
    gesture.current = { x: event.clientX, y: event.clientY, lastX: event.clientX, dragging: false, down: true };
  }
  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const g = gesture.current;
    if (!g.down) return;
    const dx = event.clientX - g.x;
    const dy = event.clientY - g.y;
    if (!g.dragging && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) { g.down = false; return; }
    if (!g.dragging && Math.abs(dx) > 8) {
      g.dragging = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (g.dragging) {
      event.preventDefault();
      engine.current?.drag((event.clientX - g.lastX) / Math.max(120, event.currentTarget.clientWidth * 0.55));
    }
    g.lastX = event.clientX;
  }
  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    const g = gesture.current;
    g.down = false;
    if (!g.dragging) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (engine.current) engine.current.snap();
    else if (Math.abs(event.clientX - g.x) > 30) move(event.clientX < g.x ? 1 : -1);
  }

  return (
    <div className="project-carousel" role="region" aria-roledescription="carousel" aria-label={copy.label}>
      <div ref={titleStage} className={styles.headingBlock}>
      <h3 id={`project-${project.slug}`} className={cn("carousel-title", styles.title)} aria-label={title}>
        {projects.map((item, i) => <span key={item.slug} data-carousel-title aria-hidden="true"
          className={styles.titleLine} style={{ opacity: i === 0 ? 1 : 0 }}>
          {item.displayTitle ?? item.title}
        </span>)}
      </h3>
      <div className={styles.actionsViewport}>
        {projects.map((item, i) => {
          const href = item.caseStudy ? `/projects/${item.slug}` : item.link;
          return <div key={item.slug} data-carousel-actions className={styles.actionsLine}
            aria-hidden={i !== index} inert={i !== index} style={{ opacity: i === 0 ? 1 : 0, pointerEvents: i === index ? "auto" : "none" }}>
            {href && <Link href={href} className={styles.action} {...(!item.caseStudy ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              {copy.viewProject}<ArrowUpRight size={14} aria-hidden="true" />
            </Link>}
            {item.github && <a href={item.github} target="_blank" rel="noopener noreferrer" className={styles.action}>
              {copy.viewSource}<ArrowUpRight size={14} aria-hidden="true" />
            </a>}
          </div>;
        })}
      </div>
      <div className={styles.descriptionViewport}>
        {projects.map((item, i) => <p key={item.slug} data-carousel-description
          className={styles.descriptionLine} aria-hidden={i !== index} style={{ opacity: i === 0 ? 1 : 0 }}>
          {item.summary ?? item.description}
        </p>)}
      </div>
      </div>
      <div ref={stage} className={cn("carousel-stage", styles.stage, ready && "is-ready")} role="group" aria-label={copy.previews}
        aria-describedby="carousel-instructions" tabIndex={0} onKeyDown={onKeyDown}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
        onPointerCancel={() => { gesture.current.down = false; engine.current?.show(index); }}
        onDragStart={event => event.preventDefault()}
        onClickCapture={event => { if (event.detail > 0 && gesture.current.dragging) { event.preventDefault(); event.stopPropagation(); } }}>
        <Link href={destination} className={cn("carousel-preview", styles.preview, project.imageStyle === "brand" && "brand-visual")}
          aria-label={`${title} — ${project.caseStudy ? portfolioCopy.projects.caseStudy : portfolioCopy.projects.live}`}
          {...(!project.caseStudy ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {project.image && <Image src={project.image} alt={project.title} fill sizes="(max-width: 767px) 84vw, 60vw" draggable={false} />}
        </Link>
      </div>
      <p id="carousel-instructions" className="sr-only">{copy.hint}</p>
      <p className="sr-only" aria-live="polite" aria-atomic="true">{title} {index + 1} / {projects.length}</p>
    </div>
  );
}
