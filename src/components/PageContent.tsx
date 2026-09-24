"use client";

import { useMode } from "@/components/Providers";
import { Hero } from "@/components/Hero";
import dynamic from "next/dynamic";

const RecruiterDashboard = dynamic(() => import("@/components/RecruiterDashboard").then((mod) => mod.RecruiterDashboard));
const About = dynamic(() => import("@/components/About").then((mod) => mod.About));
const Skills = dynamic(() => import("@/components/Skills").then((mod) => mod.Skills));
const Projects = dynamic(() => import("@/components/Projects").then((mod) => mod.Projects));
const Contributions = dynamic(() => import("@/components/Contributions").then((mod) => mod.Contributions));
const Experience = dynamic(() => import("@/components/Experience").then((mod) => mod.Experience));
const Contact = dynamic(() => import("@/components/Contact").then((mod) => mod.Contact));

export function PageContent() {
  const { isRecruiterMode } = useMode();

  if (isRecruiterMode) {
    return <RecruiterDashboard />;
  }

  return (
    <>
      <div className="relative z-10 rounded-b-3xl border-b border-border bg-background shadow-[0_20px_50px_var(--page-shadow)]">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contributions />
        <Experience />
      </div>
      <Contact />
    </>
  );
}
