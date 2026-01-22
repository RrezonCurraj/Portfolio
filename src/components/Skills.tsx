"use client";

import { useRef } from "react";
import { portfolioData } from "@/data/portfolio";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextReveal } from "@/components/ui/TextReveal";

gsap.registerPlugin(ScrollTrigger);

export function Skills() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // REMOVED card fade-in animation to guarantee visibility
    // Cards are now static visible elements

    // Animate Progress Bars (This gives the requested scroll effect safely)
    gsap.utils.toArray(".skill-bar-fill").forEach((bar: any) => {
      gsap.fromTo(bar, 
        { scaleX: 0 },
        { 
          scaleX: 1,
          duration: 1.5,
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
    <section ref={containerRef} id="skills" className="py-24 px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
            <TextReveal activeColor="var(--color-primary)" className="text-3xl sm:text-4xl md:text-6xl font-bold inline-block">Technical Skills</TextReveal>
        </div>
        
        <div className="skills-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {portfolioData.skills.map((skill) => (
            <div 
              key={skill.name}
              className="skill-item p-6 rounded-2xl bg-zinc-900 border border-white/5 hover:border-[var(--color-primary)] transition-all duration-300 group hover:-translate-y-2"
            >
              <h3 className="text-xl font-bold mb-3 group-hover:text-[var(--color-primary)] transition-colors">
                {skill.name}
              </h3>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="skill-bar-fill h-full bg-[var(--color-primary)] origin-left" 
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
