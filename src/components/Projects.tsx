"use client";

import { useRef } from "react";
import { portfolioData } from "@/data/portfolio";
import { ExternalLink, Github } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextReveal } from "@/components/ui/TextReveal";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const scrollContainer = containerRef.current;
    if (!scrollContainer) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const getScrollAmount = () => {
        const totalWidth = scrollContainer.scrollWidth;
        const viewportWidth = window.innerWidth;
        return Math.max(0, totalWidth - viewportWidth + 100); 
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

    mm.add("(max-width: 767px)", () => {
      const cards = gsap.utils.toArray<HTMLElement>(".project-card");
      cards.forEach((card) => {
         gsap.to(card, {
            scale: 0.9, 
            opacity: 1,
            filter: "blur(10px)",
            scrollTrigger: {
               trigger: card,
               start: "top top", 
               end: "bottom 50%", 
               scrub: true,
            }
         });
      });
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="projects" className="py-8 md:h-screen bg-black flex flex-col overflow-visible md:overflow-hidden bg-grid relative z-10">
      <div className="container mx-auto px-6 mb-6 flex justify-between items-end border-b-2 border-white/10 pb-4">
        <TextReveal activeColor="var(--color-primary)" className="text-5xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter">PROJECTS</TextReveal>
        <div className="hidden md:block text-white/30 font-mono text-xl">
          [ {portfolioData.projects.length} WORKS ]
        </div>
      </div>
      
      <div 
        ref={containerRef}  
        className="flex flex-col md:flex-row gap-8 md:gap-16 px-6 w-full md:w-max md:flex-1 md:min-h-0"
      >
        {portfolioData.projects.map((project, index) => (
          <div
            key={index}
            className={`project-card w-full md:w-[800px] md:max-h-full flex-shrink-0 group relative bg-black border-2 border-white/10 overflow-hidden hover:border-[var(--color-primary)] hover:shadow-[10px_10px_0px_var(--color-primary)] transition-all duration-300 md:static sticky md:flex md:flex-col ${
              index === portfolioData.projects.length - 1 ? 'mb-0' : 'mb-[40vh]'
            } md:mb-0`}
            style={{ 
              zIndex: index + 1,
              top: '100px'
            }}
          >
            <div className="flex border-b-2 border-white/10 text-white/50 font-mono text-sm uppercase divide-x-2 divide-white/10">
              <div className="p-3 flex-grow tracking-widest">{project.title}</div>
              <div className="p-3 w-16 text-center group-hover:bg-[var(--color-primary)] group-hover:text-black transition-colors font-bold">
                0{index + 1}
              </div>
            </div>

            <div className="aspect-[16/9] md:aspect-[16/8] bg-zinc-900 relative overflow-hidden group-hover:scale-y-[0.98] transition-transform duration-500 origin-top">
              <Image 
                src={project.image} 
                alt={`${project.title} Preview`}
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 filter grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-black/60 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 backdrop-blur-none md:backdrop-blur-sm z-20">
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-[var(--color-primary)] text-black font-bold uppercase tracking-widest hover:bg-white hover:scale-110 transition-all duration-300 flex items-center gap-2">
                  Launch <ExternalLink size={20} />
                </a>
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-black border border-white/20 text-white font-bold uppercase tracking-widest hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:scale-110 transition-all duration-300 flex items-center gap-2">
                  Code <Github size={20} />
                </a>
              </div>
            </div>
            
            <div className="p-4 md:p-6 bg-black relative flex-1">
              <h3 className="text-3xl md:text-4xl font-black mb-3 uppercase tracking-tighter group-hover:text-[var(--color-primary)] transition-colors">
                {project.title}
              </h3>
              <p className="text-zinc-400 mb-4 text-base font-mono leading-relaxed border-l-2 border-white/10 pl-4 group-hover:border-[var(--color-primary)] transition-colors">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-3 mt-auto">
                {project.tech.map((tech) => (
                  <span 
                    key={tech} 
                    className="px-3 py-1 bg-white/5 text-xs font-mono uppercase tracking-wider border border-white/20 text-zinc-300 group-hover:border-[var(--color-primary)]/50 transition-colors"
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
