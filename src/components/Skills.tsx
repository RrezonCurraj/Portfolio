"use client";

import { useRef } from "react";
import { portfolioData } from "@/data/portfolio";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";


gsap.registerPlugin(ScrollTrigger);

export function Skills() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.utils.toArray<HTMLElement>(".skill-group").forEach((group) => {
      gsap.from(group, {
        y: 32,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: { trigger: group, start: "top 90%" },
      });
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="skills" className="w-full overflow-hidden border-y-4 border-accent-foreground bg-accent px-4 py-32 text-accent-foreground md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-20 flex items-end justify-between border-b-4 border-accent-foreground pb-8">
            <h2 className="text-6xl sm:text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none">
              ABILITIES
            </h2>
            <div className="hidden border-2 border-accent-foreground bg-accent-foreground px-4 py-2 font-mono text-xl font-bold uppercase text-accent md:block">
              {"// Frontend First"}
            </div>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-3">
          {portfolioData.skillGroups.map((group, index) => (
            <article
              key={group.title}
              className="skill-group flex min-h-full flex-col border-4 border-accent-foreground bg-accent p-6 shadow-[8px_8px_0_0_var(--color-accent-foreground)] md:p-8"
            >
              <span className="mb-10 font-mono text-sm font-bold opacity-60">
                0{index + 1} / 03
              </span>
              <h3 className="mb-4 text-3xl font-black uppercase tracking-tighter md:text-4xl">
                {group.title}
              </h3>
              <p className="mb-8 font-mono text-sm leading-relaxed opacity-75">
                {group.description}
              </p>
              <div className="mt-auto flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="border-2 border-accent-foreground bg-accent-foreground px-3 py-2 font-mono text-xs font-bold uppercase tracking-wide text-accent"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
