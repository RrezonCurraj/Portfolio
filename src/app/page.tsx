import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import dynamic from "next/dynamic";

const About = dynamic(() => import("@/components/About").then(mod => mod.About));
const Skills = dynamic(() => import("@/components/Skills").then(mod => mod.Skills));
const Projects = dynamic(() => import("@/components/Projects").then(mod => mod.Projects));
const Experience = dynamic(() => import("@/components/Experience").then(mod => mod.Experience));
const Contact = dynamic(() => import("@/components/Contact").then(mod => mod.Contact));
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
