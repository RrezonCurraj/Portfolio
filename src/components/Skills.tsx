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
    // REMOVED card fade-in animation to guarantee visibility
    // Cards are now static visible elements

    // Animate Progress Bars (This gives the requested scroll effect safely)
    gsap.utils.toArray<HTMLElement>(".skill-bar-fill").forEach((bar) => {
      gsap.fromTo(bar, 
        { scaleX: 0 },
        { 
          scaleX: 1,
          duration: 0.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: bar,
            start: "top 95%", // Starts animating when bar enters viewport
          }
        }
      );
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="skills" className="py-32 px-4 md:px-12 bg-[#ccff00] text-black w-full overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-20 flex justify-between items-end border-b-4 border-black pb-8">
            <h2 className="text-6xl sm:text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none">
              ABILITIES
            </h2>
            <div className="hidden md:block font-mono text-xl font-bold uppercase">
              {"// Core Stack"}
            </div>
        </div>
        
        <div className="skills-list flex flex-col gap-8 md:gap-12">
          {portfolioData.skills.map((skill, index) => (
            <div 
              key={skill.name}
              className="skill-item relative group flex flex-col md:flex-row items-center border-b-2 border-black/20 pb-8 hover:border-black transition-colors"
            >
              <div className="w-full md:w-1/3 flex items-center gap-6 mb-4 md:mb-0">
                <span className="font-mono text-xl md:text-2xl font-bold opacity-30 group-hover:opacity-100 transition-opacity">0{index + 1}</span>
                <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter group-hover:translate-x-4 transition-transform duration-300">
                  {skill.name}
                </h3>
              </div>
              
              <div className="w-full md:w-2/3 h-12 md:h-16 border-4 border-black relative overflow-hidden bg-white/20">
                <div 
                  className="skill-bar-fill h-full bg-black origin-left" 
                  style={{ width: `${skill.level}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-end px-6 font-mono text-xl font-bold mix-blend-difference text-white pointer-events-none">
                  {skill.level}.00%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
