"use client";

import { useRef } from "react";
import { portfolioData } from "@/data/portfolio";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { TextReveal } from "@/components/ui/TextReveal";
import { ThreeBackground } from "@/components/ThreeBackground";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".hero-fade-in", {
      y: 20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      delay: 0.5,
      ease: "power2.out",
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="min-h-screen flex flex-col justify-center px-6 pt-24 relative overflow-hidden">
      {/* Background - Minimalist Glow */}
      <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-[var(--color-primary)] rounded-full blur-[200px] opacity-10 pointer-events-none" />
      
      {/* Three.js Background */}
      <ThreeBackground />

      <div className="max-w-6xl mx-auto w-full z-10">
        <div className="hero-fade-in mb-8">
          <span className="text-[var(--color-primary)] font-mono text-sm tracking-widest uppercase block border border-white/10 w-fit px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm">
            {portfolioData.personal.role}
          </span>
        </div>
        
        {/* Dual-Font Typography */}
        <div className="mb-10 space-y-0 leading-none">
          <div className="block -mb-2 md:mb-0">
            {/* Creative Serif - Standard Lime Glow */}
            <TextReveal 
              className="text-4xl sm:text-6xl md:text-8xl font-serif italic font-normal tracking-tight text-white whitespace-nowrap"
              activeColor="white"
            >
              I BUILD
            </TextReveal>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-4 md:gap-x-6">
            {/* Serious Sans - White Hover (Fixing the pink issue) */}
            <TextReveal 
              className="text-4xl sm:text-6xl md:text-8xl font-sans font-black tracking-tighter text-zinc-600 whitespace-nowrap"
              activeColor="white"
              baseColor="rgb(82, 82, 91)" // Explicit zinc-600 to prevent color capture errors
            >
              DIGITAL
            </TextReveal>
            
            {/* Creative Serif - Lime Glow */}
            <TextReveal 
              className="text-4xl sm:text-6xl md:text-8xl font-serif italic font-normal tracking-tight text-[var(--color-primary)] text-glow whitespace-nowrap" 
              delay={0.2}
              activeColor="white"
            >
              EXPERIENCES
            </TextReveal>
          </div>
        </div>

        <p className="hero-fade-in max-w-2xl text-zinc-400 text-lg md:text-xl leading-relaxed mb-12 font-sans font-light">
          {portfolioData.personal.bio}
        </p>
        
        <div className="hero-fade-in flex flex-wrap gap-4">
          <a 
            href="#projects"
            className="bg-white text-black px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-base md:text-lg flex items-center gap-2 hover:bg-[var(--color-primary)] transition-colors font-sans"
          >
            View Work <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          </a>
          <a 
            href="#contact"
            className="border border-white/10 text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-base md:text-lg hover:bg-white/5 transition-colors font-sans"
          >
            Contact Me
          </a>
        </div>
      </div>
    </section>
  );
}
