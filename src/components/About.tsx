import { portfolioData } from "@/data/portfolio";
import Image from "next/image";
import profileImg from "@/images/profile.png";
import { TextReveal } from "@/components/ui/TextReveal";

export function About() {
  return (
    <section id="about" className="py-24 px-6 bg-zinc-900/50">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="text-center md:text-left">
          <TextReveal activeColor="var(--color-primary)" className="text-4xl md:text-5xl font-bold mb-6">About Me</TextReveal>
          <div className="w-20 h-1 bg-[var(--color-primary)] mb-8 mx-auto md:mx-0" />
          <p className="text-zinc-400 text-lg leading-relaxed mb-6">
            With a passion for design and code, I bridge the gap between aesthetics and functionality.
            I start every project with a clear goal: to create something that not only looks good but works perfectly.
          </p>
          <p className="text-zinc-400 text-lg leading-relaxed">
            When I&apos;m not coding, you can find me exploring new technologies, contributing to open source,
            or designing user interfaces that delight users.
          </p>
        </div>
        <div className="relative">
          <div className="aspect-square rounded-2xl bg-zinc-800 overflow-hidden border border-white/10 relative z-10">
            <Image 
              src={profileImg} 
              alt="Rrezon Profile" 
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-[var(--color-primary)] rounded-2xl z-0" />
        </div>
      </div>
    </section>
  );
}
