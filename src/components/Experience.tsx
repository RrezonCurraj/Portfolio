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
    <section ref={containerRef} id="experience" className="py-32 px-4 md:px-12 bg-[#0f172a] text-[#f8fafc] relative z-10 border-t-4 border-white/10">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-20 flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-white/20 pb-8 gap-8">
             <h2 className="text-6xl sm:text-7xl md:text-9xl font-black uppercase tracking-tighter text-outline drop-shadow-xl">
               EXPERIENCE
             </h2>
             <span className="font-mono text-xl md:text-2xl text-[var(--color-primary)] font-bold bg-[#1e293b] border-2 border-[var(--color-primary)] px-4 py-2">
               [ CAREER ARCHIVE ]
             </span>
        </div>
        
        <div className="timeline-wrapper flex flex-col w-full gap-8">
          {portfolioData.experience.map((job, index) => (
            <div key={index} className="timeline-item group relative grid grid-cols-1 md:grid-cols-12 gap-8 p-8 md:p-12 bg-[#1e293b] border-2 border-white/10 hover:border-[var(--color-primary)] hover:-translate-y-2 hover:translate-x-2 hover:shadow-[-8px_8px_0_0_rgba(34,197,94,1)] transition-all duration-300">
              
              <div className="md:col-span-3 font-mono">
                <div className="text-2xl md:text-4xl font-bold text-white/30 mb-2">0{index + 1}</div>
                <div className="text-lg md:text-xl text-[var(--color-primary)] tracking-tight uppercase group-hover:bg-[var(--color-primary)] group-hover:text-[#0f172a] inline-block px-3 py-1 transition-colors duration-300 border border-[var(--color-primary)]">
                  {job.period}
                </div>
              </div>
              
              <div className="md:col-span-9 flex flex-col">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
                  <h3 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter group-hover:text-[var(--color-primary)] transition-all duration-300">
                    {job.company}
                  </h3>
                  <p className="text-xl md:text-2xl font-mono text-white border-2 border-white/20 px-4 py-2 self-start xl:self-auto group-hover:border-[var(--color-primary)] group-hover:bg-[#0f172a] transition-colors duration-300">
                    {job.role}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 font-mono text-zinc-300 text-lg md:text-xl leading-relaxed mt-4 bg-[#0f172a]/50 p-6 border-l-4 border-[var(--color-primary)]">
                  <ul className="space-y-4">
                    {job.description.split('\n').filter(Boolean).map((line, i) => (
                      <li key={i} className="flex gap-4">
                        <span className="text-[var(--color-primary)] font-black">&gt;</span>
                        <span className="group-hover:text-white transition-colors duration-500">{line.replace(/^[•-]\s*/, '')}</span>
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
