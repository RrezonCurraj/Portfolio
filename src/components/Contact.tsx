"use client";

import { portfolioData } from "@/data/portfolio";
import { Mail, Linkedin, Github } from "lucide-react";
import { TextReveal } from "@/components/ui/TextReveal";

export function Contact() {
  return (
    <section className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 text-center px-6">
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <TextReveal activeColor="var(--color-primary)" className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold tracking-tighter whitespace-nowrap">
                    Let&apos;s Work Together
                </TextReveal>
            </div>
            
            <p className="text-zinc-400 text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed">
                Have a project in mind? I&apos;m always open to discussing new ideas and opportunities.
            </p>
            
            <a 
              href={`mailto:${portfolioData.personal.email}`}
              className="inline-flex items-center gap-2 md:gap-3 bg-[var(--color-primary)] text-black px-6 py-3 md:px-10 md:py-5 rounded-full font-bold text-base md:text-xl hover:bg-white transition-all hover:scale-105 mb-16"
            >
              <Mail className="w-6 h-6" />
              Say Hello
            </a>
            
            <div className="flex justify-center gap-10">
              <a href={portfolioData.personal.github} className="text-zinc-500 hover:text-white transition-colors transform hover:scale-110">
                <Github className="w-10 h-10" />
              </a>
              <a href={portfolioData.personal.linkedin} className="text-zinc-500 hover:text-white transition-colors transform hover:scale-110">
                <Linkedin className="w-10 h-10" />
              </a>
            </div>
        </div>
        
        <footer className="absolute bottom-8 text-center text-zinc-700 text-sm">
            © {new Date().getFullYear()} RrezonCurraj. Built with Next.js & GSAP.
        </footer>
    </section>
  );
}
