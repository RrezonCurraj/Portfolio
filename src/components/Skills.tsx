"use client";

import { useRef } from "react";
import { portfolioData } from "@/data/portfolio";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger);

export function Skills() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>(".skill-bar-fill").forEach((bar) => {
      gsap.fromTo(bar, 
        { scaleX: 0 },
        { 
          scaleX: 1,
          duration: 0.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: bar,
            start: "top 95%", 
          }
        }
      );
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="skills" className="py-32 px-4 md:px-12 bg-[var(--color-primary)] text-[#0f172a] w-full overflow-hidden border-y-4 border-[#0f172a]">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-20 flex justify-between items-end border-b-4 border-[#0f172a] pb-8">
            <h2 className="text-6xl sm:text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none">
              ABILITIES
            </h2>
            <div className="hidden md:block font-mono text-xl font-bold uppercase bg-[#0f172a] text-[var(--color-primary)] px-4 py-2 border-2 border-[#0f172a]">
              {"// Core Stack"}
            </div>
        </div>
        
        <div className="skills-list flex flex-col gap-8 md:gap-12">
          {portfolioData.skills.map((skill, index) => (
            <div 
              key={skill.name}
              className="skill-item relative group flex flex-col md:flex-row items-center border-b-2 border-[#0f172a]/20 pb-8 hover:border-[#0f172a] transition-colors"
            >
              <div className="w-full md:w-1/3 flex items-center gap-6 mb-4 md:mb-0">
                <span className="font-mono text-xl md:text-2xl font-bold opacity-50 group-hover:opacity-100 transition-opacity">0{index + 1}</span>
                <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter group-hover:translate-x-4 transition-transform duration-300">
                  {skill.name}
                </h3>
              </div>
              
              <div className="w-full md:w-2/3 h-12 md:h-16 border-4 border-[#0f172a] relative overflow-hidden bg-[#0f172a]/10">
                <div 
                  className="skill-bar-fill h-full bg-[#0f172a] origin-left shadow-[inset_-4px_0_0_rgba(255,255,255,0.2)]" 
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
