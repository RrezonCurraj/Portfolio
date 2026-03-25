"use client";

import { useRef } from "react";
import { portfolioData } from "@/data/portfolio";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { TextReveal } from "@/components/ui/TextReveal";
import dynamic from "next/dynamic";
const ThreeBackground = dynamic(() => import("@/components/ThreeBackground").then(mod => mod.ThreeBackground), { ssr: false });
export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".hero-fade-in", {
      y: 20,
      opacity: 0,
      duration: 0.4,
      stagger: 0.05,
      delay: 0,
      ease: "power2.out",
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="min-h-screen flex flex-col justify-center px-4 md:px-12 pt-24 relative overflow-hidden bg-grid">
      <ThreeBackground />

      <div className="w-full max-w-[1400px] mx-auto z-10 relative">
        <div className="hero-fade-in mb-12 flex justify-start">
          <span className="text-[var(--color-primary)] font-mono text-xs md:text-sm tracking-[0.2em] uppercase block border border-[var(--color-primary)]/30 px-4 py-2 bg-black/50 backdrop-blur-md">
            {"// " + portfolioData.personal.role}
          </span>
        </div>
        
        <div className="mb-16 space-y-0 leading-[0.9] relative flex flex-col">
          <div className="block z-0 relative left-0 md:left-4">
            <TextReveal 
              className="text-[clamp(3rem,8vw,7rem)] font-sans font-black tracking-tighter text-white uppercase whitespace-nowrap"
              activeColor="var(--color-primary)"
            >
              I BUILD
            </TextReveal>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-baseline gap-x-6 relative z-10 -mt-2">
            <TextReveal 
              className="text-[clamp(3rem,8vw,7rem)] font-sans font-black tracking-tighter text-white uppercase whitespace-nowrap"
              activeColor="var(--color-primary)"
            >
              DIGITAL
            </TextReveal>
            
            <TextReveal 
              className="text-[clamp(3rem,8vw,7rem)] font-sans font-black tracking-tighter text-[var(--color-primary)] text-glow uppercase whitespace-nowrap" 
              delay={0.2}
              activeColor="white"
            >
              EXPERIENCES
            </TextReveal>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <p className="hero-fade-in md:col-span-5 text-white/70 text-lg md:text-xl font-mono leading-relaxed bg-black/40 backdrop-blur-sm p-6 border-l-2 border-[var(--color-primary)]">
            {portfolioData.personal.bio}
          </p>
          
          <div className="hero-fade-in md:col-start-8 md:col-span-5 flex flex-wrap gap-4 justify-start md:justify-end">
            <a 
              href="#projects"
              className="bg-[var(--color-primary)] text-black px-8 py-4 font-black font-sans uppercase tracking-wider text-sm md:text-base hover:bg-white hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_40px_rgba(204,255,0,0.3)] flex items-center gap-3"
            >
              View Work <ArrowRight className="w-5 h-5" />
            </a>
            <a 
              href="#contact"
              className="px-8 py-4 font-black font-sans uppercase tracking-wider text-sm md:text-base text-white border border-white/20 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-all duration-300"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
