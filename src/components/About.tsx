import Image from "next/image";
import profileImg from "@/images/profile.png";
import { TextReveal } from "@/components/ui/TextReveal";

export function About() {
  return (
    <section id="about" className="relative overflow-hidden border-t-4 border-border bg-background px-4 py-32 text-foreground md:px-12">
      <div 
        className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full pointer-events-none opacity-20" 
        style={{ background: "radial-gradient(circle, var(--color-accent) 0%, transparent 60%)" }}
      />
      <div className="max-w-[1400px] mx-auto grid md:grid-cols-12 gap-12 items-center relative z-10">
        
        <div className="md:col-span-7 flex flex-col justify-center">
          <div className="mb-12 flex flex-col">
            <TextReveal
              className="text-5xl font-black uppercase tracking-tighter text-foreground sm:text-7xl md:text-8xl"
              activeColor="var(--color-primary)"
            >
              SYSTEM
            </TextReveal>
            <TextReveal
              className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter text-[var(--color-primary)] text-glow drop-shadow-lg"
              activeColor="var(--foreground)"
              delay={0.1}
            >
              STATUS
            </TextReveal>
          </div>
          <div className="editorial-card max-w-2xl space-y-6 border-l-4 border-primary bg-surface p-8 py-2 pl-6 font-mono text-lg text-muted-strong shadow-[8px_8px_0_0_var(--color-accent)] md:text-2xl">
            <p className="leading-relaxed">
              &gt; Analyzing core directives... <br/>
              <span className="text-foreground">With a passion for design and code, I bridge the gap between aesthetics and functionality.</span>
            </p>
            <p className="leading-relaxed">
              &gt; Loading secondary protocols... <br/>
              <span className="text-foreground">I start every project with a clear goal: to create something that not only looks good but works perfectly.</span>
            </p>
            <p className="leading-relaxed">
              &gt; Executing idle routines... <br/>
              <span className="text-foreground">When I&apos;m not coding, you can find me exploring new technologies, contributing to open source, or designing user interfaces that delight users.</span>
            </p>
          </div>
        </div>

        <div className="md:col-span-5 relative group mt-12 md:mt-0">
          <div className="relative z-10 aspect-[3/4] overflow-hidden border-4 border-border-strong bg-surface shadow-[-12px_12px_0_0_var(--color-accent)] transition-all duration-300 hover:-translate-y-2 hover:translate-x-2 hover:border-primary">
            <Image 
              src={profileImg} 
              alt="Rrezon Profile" 
              fill
              className="object-cover object-center filter grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-background/30 mix-blend-overlay"></div>
            <div className="absolute bottom-6 left-6 right-6">
               <div className="inline-block border-2 border-accent-foreground bg-accent px-4 py-2 font-mono text-sm font-bold uppercase text-accent-foreground shadow-[4px_4px_0_0_var(--color-accent-foreground)]">
                 ID: RREZON_01
               </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-3 opacity-60">
             {[...Array(8)].map((_, i) => (
                <div key={i} className="h-3 w-3 bg-accent"></div>
             ))}
          </div>
        </div>
        
      </div>
    </section>
  );
}
