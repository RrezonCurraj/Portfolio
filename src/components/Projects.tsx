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

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>(".project-card");
    cards.forEach((card, i) => {
      gsap.from(card, {
        y: 100,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top bottom-=100",
          toggleActions: "play none none reverse",
        }
      });
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="projects" className="py-24 bg-[#0f172a] relative z-10 bg-grid">
      <div className="container mx-auto px-4 md:px-12 mb-16 flex justify-between items-end border-b-4 border-white/10 pb-6">
        <TextReveal activeColor="var(--color-primary)" className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter">PROJECTS</TextReveal>
        <div className="hidden md:block text-[var(--color-primary)] font-mono text-xl border-2 border-[var(--color-primary)] px-4 py-2 bg-[#1e293b]">
          [ {portfolioData.projects.length} WORKS ]
        </div>
      </div>
      
      <div className="container mx-auto px-4 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {portfolioData.projects.map((project, index) => (
            <div
              key={index}
              className={`project-card group relative bg-[#1e293b] border-2 border-white/10 overflow-hidden hover:border-[var(--color-primary)] hover:-translate-y-2 hover:translate-x-2 hover:shadow-[-8px_8px_0_0_rgba(34,197,94,1)] transition-all duration-300 flex flex-col ${
                index % 2 === 1 ? 'lg:mt-24' : ''
              }`}
            >
              <div className="flex border-b-2 border-white/10 text-white/50 font-mono text-sm uppercase divide-x-2 divide-white/10 bg-[#0f172a]">
                <div className="p-4 flex-grow tracking-widest">{project.title}</div>
                <div className="p-4 w-16 text-center group-hover:bg-[var(--color-primary)] group-hover:text-[#0f172a] transition-colors font-bold">
                  0{index + 1}
                </div>
              </div>

              <div className="aspect-[4/3] bg-zinc-900 relative overflow-hidden">
                <Image 
                  src={project.image} 
                  alt={`${project.title} Preview`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 filter grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-[#0f172a]/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 z-20">
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-[var(--color-primary)] text-[#0f172a] font-bold uppercase tracking-widest border-2 border-[var(--color-primary)] hover:bg-transparent hover:text-[var(--color-primary)] hover:-translate-y-1 hover:translate-x-1 hover:shadow-[-4px_4px_0_0_rgba(248,250,252,1)] transition-all duration-200 flex items-center gap-2">
                    Launch <ExternalLink size={20} />
                  </a>
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-[#1e293b] border-2 border-white/20 text-white font-bold uppercase tracking-widest hover:border-white hover:-translate-y-1 hover:translate-x-1 hover:shadow-[-4px_4px_0_0_rgba(248,250,252,1)] transition-all duration-200 flex items-center gap-2">
                    Code <Github size={20} />
                  </a>
                </div>
              </div>
              
              <div className="p-6 md:p-8 relative flex-1 flex flex-col">
                <h3 className="text-3xl md:text-4xl font-black mb-4 uppercase tracking-tighter group-hover:text-[var(--color-primary)] transition-colors">
                  {project.title}
                </h3>
                <p className="text-zinc-400 mb-6 text-base font-mono leading-relaxed border-l-4 border-[var(--color-primary)] pl-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tech.map((tech) => (
                    <span 
                      key={tech} 
                      className="px-3 py-1 bg-[#0f172a] text-xs font-mono uppercase tracking-wider border border-white/10 text-zinc-300 group-hover:border-[var(--color-primary)] transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
