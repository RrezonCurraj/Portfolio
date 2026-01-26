import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-[var(--color-primary)] selection:text-black">
      <Navbar />
      
      <div className="relative z-10 bg-black mb-[85vh] shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-b-3xl border-b border-zinc-900">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
      </div>
      
      <div id="contact" className="h-px w-full" />
      
      <div className="fixed bottom-0 left-0 right-0 h-[85vh] z-0">
        <Contact />
      </div>
    </main>
  );
}
