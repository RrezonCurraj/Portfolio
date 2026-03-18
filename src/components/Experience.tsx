"use client";

import { useRef } from "react";
import { portfolioData } from "@/data/portfolio";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger);

export function Experience() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Animate Line
    gsap.fromTo(".timeline-line", 
      { height: "0%" },
      { 
        height: "100%", 
        ease: "none",
        scrollTrigger: {
          trigger: ".timeline-wrapper",
          start: "top center",
          end: "bottom center",
          scrub: 1,
        }
      }
    );

    // Fade in items
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
    <section ref={containerRef} id="experience" className="py-32 px-4 md:px-12 bg-black text-white bg-grid relative z-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-20 flex flex-col md:flex-row justify-between items-start md:items-end border-b-4 border-white pb-8 gap-8">
             <h2 className="text-6xl sm:text-7xl md:text-9xl font-black uppercase tracking-tighter text-outline">
               EXPERIENCE
             </h2>
             <span className="font-mono text-xl md:text-2xl text-[var(--color-primary)] font-bold">
               [ CAREER ARCHIVE ]
             </span>
        </div>
        
        <div className="timeline-wrapper flex flex-col w-full">
          {portfolioData.experience.map((job, index) => (
            <div key={index} className="timeline-item group relative grid grid-cols-1 md:grid-cols-12 gap-8 py-12 border-b-2 border-white/20 hover:border-white transition-colors duration-300">
              
              <div className="md:col-span-3 font-mono">
                <div className="text-2xl md:text-4xl font-bold text-white/50 mb-2">0{index + 1}</div>
                <div className="text-lg md:text-xl text-[var(--color-primary)] tracking-tight uppercase group-hover:bg-[var(--color-primary)] group-hover:text-black inline-block px-2 transition-colors duration-300">
                  {job.period}
                </div>
              </div>
              
              <div className="md:col-span-9 flex flex-col">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter group-hover:text-[var(--color-primary)] group-hover:translate-x-4 transition-all duration-300">
                    {job.company}
                  </h3>
                  <p className="text-xl md:text-2xl font-serif italic text-white/80 border border-white/20 px-4 py-2 self-start md:self-auto group-hover:border-white transition-colors duration-300">
                    {job.role}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 font-mono text-zinc-400 text-lg md:text-xl leading-relaxed mt-4">
                  <ul className="space-y-4">
                    {job.description.split('\n').filter(Boolean).map((line, i) => (
                      <li key={i} className="flex gap-4">
                        <span className="text-[var(--color-primary)]">&gt;</span>
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
