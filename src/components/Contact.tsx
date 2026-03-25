"use client";

import { portfolioData } from "@/data/portfolio";
import { Mail, Linkedin, Github } from "lucide-react";
import { TextReveal } from "@/components/ui/TextReveal";

export function Contact() {
  return (
    <section className="w-full h-full flex flex-col items-center justify-center bg-[#050505] text-center px-4 md:px-12 bg-grid relative overflow-hidden">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] pointer-events-none opacity-10" 
          style={{ background: "radial-gradient(ellipse, var(--color-primary) 0%, transparent 60%)" }}
        />
        
        <div className="w-full max-w-[1400px] mx-auto z-10">
            <div className="mb-12 relative">
                <TextReveal activeColor="var(--color-primary)" className="text-6xl sm:text-8xl md:text-[12rem] font-black uppercase tracking-tighter whitespace-nowrap text-white leading-none mx-auto">
                    INITIATE
                </TextReveal>
                <div className="text-5xl sm:text-7xl md:text-[9rem] font-serif italic text-white mix-blend-screen -mt-8 md:-mt-16">
                    Contact
                </div>
            </div>
            
            <p className="text-zinc-500 font-mono text-sm md:text-xl mb-12 max-w-xl mx-auto uppercase tracking-widest border-y-2 border-white/10 py-4">
                [ Awaiting directive... ]
            </p>
            
            <a 
              href={`mailto:${portfolioData.personal.email}`}
              className="group relative inline-flex items-center justify-center gap-4 bg-[var(--color-primary)] text-black px-8 py-6 md:px-16 md:py-8 font-black uppercase tracking-[0.2em] text-lg md:text-2xl hover:bg-white transition-all hover:scale-[1.02] mb-20 overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.8)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-[shimmer_2s_infinite]" />
              <Mail className="w-8 h-8 relative z-10 group-hover:rotate-12 transition-transform" />
              <span className="relative z-10">Transmit Signal</span>
            </a>
            
            <div className="flex justify-center gap-8 mb-8">
              <a href={portfolioData.personal.github} className="p-4 border-2 border-white/20 text-zinc-500 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] hover:-translate-y-2 transition-all bg-black">
                <Github className="w-8 h-8 md:w-10 md:h-10" />
              </a>
              <a href={portfolioData.personal.linkedin} className="p-4 border-2 border-white/20 text-zinc-500 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] hover:-translate-y-2 transition-all bg-black">
                <Linkedin className="w-8 h-8 md:w-10 md:h-10" />
              </a>
            </div>
        </div>
        
        <footer className="absolute bottom-8 w-full flex justify-between px-12 text-zinc-700 font-mono text-xs uppercase tracking-widest">
            <span>© {new Date().getFullYear()} RREZON_CURRAJ</span>
            <span className="hidden md:inline">SYSTEM: ONLINE</span>
        </footer>
        
        {/* CSS for button shimmer */}
        <br className="hidden" />
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}} />
    </section>
  );
}
