"use client";

import { useRef } from "react";
import { portfolioData } from "@/data/portfolio";
import { ExternalLink, Github } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextReveal } from "@/components/ui/TextReveal";

gsap.registerPlugin(ScrollTrigger);

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const scrollContainer = containerRef.current;
    if (!scrollContainer) return;

    const mm = gsap.matchMedia();

    // Desktop: Horizontal Scroll
    mm.add("(min-width: 768px)", () => {
      const getScrollAmount = () => {
        const totalWidth = scrollContainer.scrollWidth;
        const viewportWidth = window.innerWidth;
        return Math.max(0, totalWidth - viewportWidth + 100); // +100 for some padding
      };
      
      gsap.to(scrollContainer, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => "+=" + getScrollAmount(),
          invalidateOnRefresh: true,
        }
      });
    });

    // Mobile: Stacking Cards Animation
    mm.add("(max-width: 767px)", () => {
      const cards = gsap.utils.toArray(".project-card");
      cards.forEach((card: any) => {
         gsap.to(card, {
            scale: 0.95, // Subtle scale to show depth
            opacity: 1,  // Keep fully visible so stack is clear
            scrollTrigger: {
               trigger: card,
               start: "top 15%", // When card hits the stack pile
               end: "bottom top", 
               scrub: true
            }
         });
      });
    });

  }, { scope: sectionRef });

  return (
    // Explicit overflow-visible for mobile to ensure sticky works
    <section ref={sectionRef} id="projects" className="min-h-screen py-24 bg-black flex flex-col justify-center overflow-visible md:overflow-hidden">
      <div className="container mx-auto px-6 mb-16">
        <TextReveal activeColor="var(--color-primary)" className="text-3xl sm:text-4xl md:text-6xl font-bold">Selected Projects</TextReveal>
      </div>
      
      <div 
        ref={containerRef} 
        className="flex flex-col md:flex-row gap-8 md:gap-12 px-6 w-full md:w-max"
      >
        {portfolioData.projects.map((project, index) => (
          <div
            key={index}
            className="project-card w-full md:w-[700px] flex-shrink-0 group relative bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden hover:border-[var(--color-primary)] transition-all duration-500 shadow-2xl md:static sticky"
            style={{ 
              zIndex: index + 1,
              // Dynamic top value creates the visible "1, 2, 3" stack pile
              top: `calc(100px + ${index * 20}px)` 
            }}
          >
            <div className="aspect-video bg-zinc-800 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-zinc-500 font-mono text-sm bg-zinc-800 group-hover:scale-105 transition-transform duration-700">
                {project.title} Preview
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                <a href={project.link} className="p-3 bg-white text-black rounded-full hover:bg-[var(--color-primary)] transition-colors transform hover:scale-110 duration-300">
                  <ExternalLink size={24} />
                </a>
                <a href="#" className="p-3 bg-zinc-800 text-white rounded-full hover:bg-[var(--color-primary)] hover:text-black transition-colors transform hover:scale-110 duration-300">
                  <Github size={24} />
                </a>
              </div>
            </div>
            
            <div className="p-6 md:p-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-[var(--color-primary)] transition-colors">
                {project.title}
              </h3>
              <p className="text-zinc-400 mb-8 text-base md:text-lg leading-relaxed">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span 
                    key={tech} 
                    className="px-4 py-1.5 bg-white/5 text-sm rounded-full border border-white/10 text-zinc-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
        <div className="hidden md:block w-[10vw] flex-shrink-0" />
      </div>
    </section>
  );
}
