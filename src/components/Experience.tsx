"use client";

import { useRef } from "react";
import { portfolioData } from "@/data/portfolio";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextReveal } from "@/components/ui/TextReveal";

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
    gsap.utils.toArray(".timeline-item").forEach((item: any) => {
      gsap.from(item, {
        opacity: 0,
        x: -30,
        duration: 0.8,
        scrollTrigger: {
          trigger: item,
          start: "top 80%",
        }
      });
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="experience" className="py-32 px-6 bg-black">
      <div className="max-w-4xl mx-auto">
        <div className="mb-20 text-center">
             <TextReveal activeColor="var(--color-primary)" className="text-3xl sm:text-4xl md:text-6xl font-bold inline-block">Work Experience</TextReveal>
        </div>
        
        <div className="timeline-wrapper relative space-y-16">
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-zinc-800">
             <div className="timeline-line w-full bg-[var(--color-primary)] absolute top-0 left-0" />
          </div>

          {portfolioData.experience.map((job, index) => (
            <div key={index} className="timeline-item relative flex flex-col md:flex-row gap-8 md:gap-0 items-start md:items-center group">
              <div className="md:w-1/2 md:pr-16 md:text-right md:order-1 order-2 pl-12 md:pl-0">
                <h3 className="text-3xl font-bold text-white group-hover:text-[var(--color-primary)] transition-colors">{job.company}</h3>
                <p className="text-[var(--color-primary)] font-medium text-lg mb-4">{job.role}</p>
                <ul className="space-y-2 text-left md:text-right">
                  {job.description.split('\n').filter(Boolean).map((line, i) => (
                    <li key={i} className="text-zinc-400 leading-relaxed flex md:justify-end gap-3 md:gap-3 relative pl-4 md:pl-0 md:pr-0">
                      {/* Mobile Line Indicator (Left) */}
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-[var(--color-primary)] md:hidden rounded-full opacity-40" />
                      
                      <span className="md:order-1 text-left md:text-right">{line.replace(/^[•-]\s*/, '')}</span>
                      
                      {/* Desktop Line Indicator (Right) */}
                      <div className="hidden md:flex flex-col justify-center items-center self-stretch py-1.5 md:order-2 opacity-40">
                        <span className="w-[2px] h-full bg-[var(--color-primary)] rounded-full" />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="absolute left-[-6px] md:left-1/2 md:-ml-1.5 w-4 h-4 bg-zinc-900 border-2 border-[var(--color-primary)] rounded-full z-10 md:order-2 order-1 group-hover:bg-[var(--color-primary)] group-hover:scale-150 transition-all duration-300" />
              
              <div className="md:w-1/2 md:pl-16 md:order-3 order-3 pl-12 md:pl-0">
                <span className="inline-block px-5 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-mono text-zinc-300">
                  {job.period}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
