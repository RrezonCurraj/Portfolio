"use client";

import { useEffect, useRef, useState } from "react";
import { portfolioData } from "@/data/portfolio";
import { ExternalLink, Github, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextReveal } from "@/components/ui/TextReveal";
import Image from "next/image";
import Link from "next/link";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

// Peek between stacked cards. Pin offset under the floating navbar is responsive.
const STAGGER = 18;
const pin = () =>
  typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches ? 104 : 72;

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  // A card growing/shrinking shifts every card below it — re-measure the pins.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [expanded]);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const cards = gsap.utils.toArray<HTMLElement>(".project-card");
    if (cards.length < 2) return;

    cards.forEach((card, i) => {
      const next = cards[i + 1];
      // The last card is the top of the deck — it never gets buried.
      if (!next) return;

      // The further back a card ends up, the smaller and blurrier it sinks.
      const depth = cards.length - 1 - i;

      gsap.fromTo(
        card,
        { scale: 1, filter: "blur(0px) brightness(1)" },
        {
          scale: 1 - depth * 0.04,
          filter: `blur(${Math.min(depth * 3, 9)}px) brightness(${1 - depth * 0.12})`,
          transformOrigin: "center top",
          ease: "none",
          scrollTrigger: {
            trigger: card,
            // Blur in over the single transition where the next card slides up and covers this one.
            start: () => `top top+=${pin() + i * STAGGER}`,
            endTrigger: next,
            end: () => `top top+=${pin() + (i + 1) * STAGGER}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="projects" className="py-24 bg-[#0f172a] relative z-10">
      <div className="container mx-auto px-4 md:px-12 mb-16 flex justify-between items-end border-b-4 border-white/10 pb-6">
        <TextReveal activeColor="var(--color-primary)" className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter">PROJECTS</TextReveal>
        <div className="hidden md:block text-[var(--color-primary)] font-mono text-xl border-2 border-[var(--color-primary)] px-4 py-2 bg-[#1e293b]">
          [ {portfolioData.projects.length} WORKS ]
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-12">
        <div className="relative max-w-5xl mx-auto [--pin:72px] lg:[--pin:104px]">
          {portfolioData.projects.map((project, index) => (
            <article
              key={index}
              aria-labelledby={`project-title-${index}`}
              style={{ top: `calc(var(--pin) + ${index * STAGGER}px)`, zIndex: index + 1 }}
              className={`project-card group sticky mb-[8vh] last:mb-0 ${
                expanded.has(index) ? "" : "h-[84svh] max-h-[700px]"
              } lg:h-auto lg:max-h-none bg-[#1e293b] border-2 border-white/10 overflow-hidden hover:border-[var(--color-primary)] transition-colors duration-300 flex flex-col lg:flex-row shadow-[0_24px_60px_-18px_rgba(0,0,0,0.85)]`}
            >
              {/* Media */}
              <div className={`relative w-full flex-1 ${
                expanded.has(index) ? "min-h-[44vw]" : "min-h-0"
              } lg:flex-none lg:w-[46%] lg:min-h-[22rem] overflow-hidden border-b-2 lg:border-b-0 lg:border-r-2 border-white/10 bg-zinc-900`}>
                <Image
                  src={project.image}
                  alt={`${project.title} Preview`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 46vw"
                  className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 filter grayscale group-hover:grayscale-0"
                />

                <div className="absolute top-0 right-0 px-4 py-3 bg-[#0f172a]/90 font-mono text-sm font-bold text-white/70 border-l-2 border-b-2 border-white/10 group-hover:bg-[var(--color-primary)] group-hover:text-[#0f172a] transition-colors z-10">
                  0{index + 1}
                </div>

                <div className="absolute inset-0 bg-[#0f172a]/80 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity hidden lg:flex flex-col items-center justify-center gap-4 z-20">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Launch ${project.title} (opens in new tab)`}
                    className="px-8 py-4 bg-[var(--color-primary)] text-[#0f172a] font-bold uppercase tracking-widest border-2 border-[var(--color-primary)] hover:bg-transparent hover:text-[var(--color-primary)] hover:-translate-y-1 hover:translate-x-1 hover:shadow-[-4px_4px_0_0_rgba(248,250,252,1)] transition-all duration-200 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white"
                  >
                    Launch <ExternalLink size={20} aria-hidden="true" />
                  </a>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View source code for ${project.title} on GitHub (opens in new tab)`}
                    className="px-8 py-4 bg-[#1e293b] border-2 border-white/20 text-white font-bold uppercase tracking-widest hover:border-white hover:-translate-y-1 hover:translate-x-1 hover:shadow-[-4px_4px_0_0_rgba(248,250,252,1)] transition-all duration-200 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-primary)]"
                  >
                    Code <Github size={20} aria-hidden="true" />
                  </a>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 relative flex flex-col shrink-0 lg:flex-1 lg:min-h-0">
                <div className="hidden sm:flex items-center gap-3 mb-4 font-mono text-xs uppercase tracking-widest text-white/40">
                  <span className="h-2 w-2 bg-[var(--color-primary)]" aria-hidden="true" />
                  <span className="truncate">{project.title}</span>
                </div>

                <h3 id={`project-title-${index}`} className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4 uppercase tracking-tighter group-hover:text-[var(--color-primary)] transition-colors">
                  {project.title}
                </h3>
                <p
                  id={`project-desc-${index}`}
                  className={`text-zinc-400 mb-3 lg:mb-6 text-base font-mono leading-relaxed border-l-4 border-[var(--color-primary)] pl-4 lg:line-clamp-none ${
                    expanded.has(index) ? "" : "line-clamp-3"
                  }`}
                >
                  {project.description}
                </p>

                {project.description.trim().length > 130 && (
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    aria-expanded={expanded.has(index)}
                    aria-controls={`project-desc-${index}`}
                    className="lg:hidden self-start mb-6 font-mono text-xs uppercase tracking-widest text-[var(--color-primary)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                  >
                    {expanded.has(index) ? "− Less" : "+ More"}
                  </button>
                )}

                {"metrics" in project && project.metrics && project.metrics.length > 0 && (
                  <ul className="mb-6 space-y-1.5 hidden sm:block">
                    {project.metrics.map((m) => (
                      <li
                        key={m}
                        className="font-mono text-xs uppercase tracking-wider text-zinc-300 flex items-start gap-2"
                      >
                        <span className="text-[var(--color-primary)] mt-0.5">▸</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {"caseStudy" in project && project.caseStudy && (
                  <Link
                    href={`/projects/${project.slug}`}
                    aria-label={`Read case study for ${project.title}`}
                    className="hidden lg:inline-flex items-center gap-2 self-start mb-6 px-4 py-2 border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-mono text-xs uppercase tracking-widest hover:bg-[var(--color-primary)] hover:text-[#0f172a] transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1e293b]"
                  >
                    Read Case Study <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                )}

                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-[#0f172a] text-xs font-mono uppercase tracking-wider border border-white/10 text-zinc-300 group-hover:border-[var(--color-primary)] transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="lg:hidden mt-5 pt-5 border-t-2 border-white/10 flex flex-col gap-3">
                  <div className="flex gap-3">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Launch ${project.title} (opens in new tab)`}
                      className="flex-1 px-4 py-3 bg-[var(--color-primary)] text-[#0f172a] font-bold uppercase tracking-widest text-sm border-2 border-[var(--color-primary)] flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white"
                    >
                      Launch <ExternalLink size={16} aria-hidden="true" />
                    </a>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View source code for ${project.title} on GitHub (opens in new tab)`}
                      className="flex-1 px-4 py-3 bg-[#0f172a] border-2 border-white/20 text-white font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-primary)]"
                    >
                      Code <Github size={16} aria-hidden="true" />
                    </a>
                  </div>
                  {"caseStudy" in project && project.caseStudy && (
                    <Link
                      href={`/projects/${project.slug}`}
                      aria-label={`Read case study for ${project.title}`}
                      className="w-full px-4 py-3 border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-primary)]"
                    >
                      Read Case Study <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
