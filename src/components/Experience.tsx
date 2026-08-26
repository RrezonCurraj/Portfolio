"use client";

import { useRef } from "react";
import { portfolioData } from "@/data/portfolio";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";


gsap.registerPlugin(ScrollTrigger);

export function Experience() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.utils.toArray<HTMLElement>(".timeline-item").forEach((item) => {
      gsap.from(item, {
        opacity: 0,
        x: -30,
        duration: 0.4,
        scrollTrigger: {
          trigger: item,
          start: "top 80%",
        }
      });
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="experience" className="relative z-10 border-t-4 border-border bg-background px-4 py-32 text-foreground md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-20 flex flex-col items-start justify-between gap-8 border-b-4 border-border-strong pb-8 md:flex-row md:items-end">
             <h2 className="text-6xl sm:text-7xl md:text-9xl font-black uppercase tracking-tighter text-outline drop-shadow-xl">
               EXPERIENCE
             </h2>
             <span className="border-2 border-primary bg-surface px-4 py-2 font-mono text-xl font-bold text-primary md:text-2xl">
               [ CAREER ARCHIVE ]
             </span>
        </div>
        
        <div className="timeline-wrapper flex flex-col w-full gap-8">
          {portfolioData.experience.map((job, index) => (
            <div key={index} className="timeline-item editorial-card group relative grid grid-cols-1 gap-8 border-2 border-border bg-surface p-8 transition-all duration-300 hover:-translate-y-2 hover:translate-x-2 hover:border-primary hover:shadow-[-8px_8px_0_0_var(--color-accent)] md:grid-cols-12 md:p-12">
              
              <div className="md:col-span-3 font-mono">
                <div className="mb-2 text-2xl font-bold text-foreground/30 md:text-4xl">0{index + 1}</div>
                <div className="inline-block border border-primary px-3 py-1 text-lg uppercase tracking-tight text-primary transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-foreground md:text-xl">
                  {job.period}
                </div>
              </div>
              
              <div className="md:col-span-9 flex flex-col">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
                  <h3 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter group-hover:text-[var(--color-primary)] transition-all duration-300">
                    {job.company}
                  </h3>
                  <p className="self-start border-2 border-border-strong px-4 py-2 font-mono text-xl text-foreground transition-colors duration-300 group-hover:border-primary group-hover:bg-background md:text-2xl xl:self-auto">
                    {job.role}
                  </p>
                </div>
                
                <div className="mt-4 grid grid-cols-1 border-l-4 border-primary bg-background/50 p-6 font-mono text-lg leading-relaxed text-muted-strong md:text-xl">
                  <ul className="space-y-4">
                    {job.description.split('\n').filter(Boolean).map((line, i) => (
                      <li key={i} className="flex gap-4">
                        <span className="text-[var(--color-primary)] font-black">&gt;</span>
                        <span className="transition-colors duration-500 group-hover:text-foreground">{line.replace(/^[•-]\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
