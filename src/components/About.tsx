import Image from "next/image";
import profileImg from "@/images/profile.png";
import { TextReveal } from "@/components/ui/TextReveal";

export function About() {
  return (
    <section id="about" className="py-32 px-4 md:px-12 bg-[#0f172a] text-[#f8fafc] relative border-t-4 border-[#1e293b] overflow-hidden bg-grid">
      <div 
        className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full pointer-events-none opacity-20" 
        style={{ background: "radial-gradient(circle, var(--color-primary) 0%, transparent 60%)" }}
      />
      <div className="max-w-[1400px] mx-auto grid md:grid-cols-12 gap-12 items-center relative z-10">
        
        <div className="md:col-span-7 flex flex-col justify-center">
          <div className="mb-12 flex flex-col">
            <TextReveal
              className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter text-[#f8fafc]"
              activeColor="var(--color-primary)"
            >
              SYSTEM
            </TextReveal>
            <TextReveal
              className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter text-[var(--color-primary)] text-glow drop-shadow-lg"
              activeColor="white"
              delay={0.1}
            >
              STATUS
            </TextReveal>
          </div>
          <div className="space-y-6 text-lg md:text-2xl font-mono text-zinc-300 max-w-2xl border-l-4 border-[var(--color-primary)] pl-6 py-2 bg-[#1e293b] p-8 shadow-[8px_8px_0_0_rgba(34,197,94,1)]">
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

        <div className="md:col-span-5 relative group mt-12 md:mt-0">
          <div className="aspect-[3/4] bg-[#1e293b] overflow-hidden border-4 border-white/20 relative z-10 hover:border-[var(--color-primary)] hover:-translate-y-2 hover:translate-x-2 transition-all duration-300 shadow-[-12px_12px_0_0_rgba(34,197,94,1)]">
            <Image 
              src={profileImg} 
              alt="Rrezon Profile" 
              fill
              className="object-cover object-center filter grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-[#0f172a]/30 mix-blend-overlay"></div>
            <div className="absolute bottom-6 left-6 right-6">
               <div className="bg-[var(--color-primary)] text-[#0f172a] font-mono font-bold text-sm uppercase px-4 py-2 border-2 border-[#0f172a] inline-block shadow-[4px_4px_0_0_rgba(15,23,42,1)]">
                 ID: RREZON_01
               </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-3 opacity-60">
             {[...Array(8)].map((_, i) => (
                <div key={i} className="w-3 h-3 bg-[var(--color-primary)]"></div>
             ))}
          </div>
        </div>
        
      </div>
    </section>
  );
}
