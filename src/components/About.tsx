import Image from "next/image";
import profileImg from "@/images/profile.png";
import { TextReveal } from "@/components/ui/TextReveal";

export function About() {
  return (
    <section id="about" className="py-32 px-4 md:px-12 bg-black text-white relative border-y-2 border-white/10 overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--color-primary)] rounded-full blur-[250px] opacity-5 pointer-events-none" />
      <div className="max-w-[1400px] mx-auto grid md:grid-cols-12 gap-12 items-center relative z-10">
        
        <div className="md:col-span-7 flex flex-col justify-center">
          <div className="mb-12 flex flex-col">
            <TextReveal
              className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter text-white"
              activeColor="var(--color-primary)"
            >
              SYSTEM
            </TextReveal>
            <TextReveal
              className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter text-[var(--color-primary)] text-glow"
              activeColor="white"
              delay={0.1}
            >
              STATUS
            </TextReveal>
          </div>
          <div className="space-y-6 text-lg md:text-2xl font-mono text-zinc-400 max-w-2xl border-l-4 border-[var(--color-primary)] pl-6 py-2">
            <p className="leading-relaxed">
              &gt; Analyzing core directives... <br/>
              <span className="text-white">With a passion for design and code, I bridge the gap between aesthetics and functionality.</span>
            </p>
            <p className="leading-relaxed">
              &gt; Loading secondary protocols... <br/>
              <span className="text-white">I start every project with a clear goal: to create something that not only looks good but works perfectly.</span>
            </p>
            <p className="leading-relaxed">
              &gt; Executing idle routines... <br/>
              <span className="text-white">When I&apos;m not coding, you can find me exploring new technologies, contributing to open source, or designing user interfaces that delight users.</span>
            </p>
          </div>
        </div>

        <div className="md:col-span-5 relative group">
          <div className="aspect-[3/4] bg-zinc-900 overflow-hidden border-2 border-white/20 relative z-10 hover:border-[var(--color-primary)] transition-colors duration-500">
            <Image 
              src={profileImg} 
              alt="Rrezon Profile" 
              fill
              className="object-cover object-center filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-black/20 mix-blend-overlay"></div>
            <div className="absolute bottom-6 left-6 right-6">
               <div className="bg-[var(--color-primary)] text-black font-mono font-bold text-sm uppercase px-4 py-2 inline-block">
                 ID: RREZON_01
               </div>
            </div>
          </div>
          <div className="absolute -top-4 -right-4 w-full h-full border-2 border-[var(--color-primary)] z-0 hidden md:block group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
          
          {/* Decorative Elements */}
          <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-30">
             {[...Array(10)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-[var(--color-primary)] rounded-full"></div>
             ))}
          </div>
        </div>
        
      </div>
    </section>
  );
}
