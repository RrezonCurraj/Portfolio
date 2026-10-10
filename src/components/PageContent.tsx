"use client";

import { useMode } from "@/components/Providers";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Experience } from "@/components/Experience";
import { Contributions } from "@/components/Contributions";
import { Contact } from "@/components/Contact";
import { RecruiterDashboard } from "@/components/RecruiterDashboard";
import { useEffect, useRef } from "react";

export function PageContent() {
  const { isRecruiterMode } = useMode();
  const content = useRef<HTMLDivElement>(null);
  const previousMode = useRef(isRecruiterMode);
  useEffect(() => {
    if (previousMode.current === isRecruiterMode) return;
    previousMode.current = isRecruiterMode;
    window.scrollTo({ top: 0, behavior: "instant" });
    content.current
      ?.querySelector<HTMLElement>("h1")
      ?.focus({ preventScroll: true });
  }, [isRecruiterMode]);
  return (
    <div ref={content}>
      {isRecruiterMode ? (
        <RecruiterDashboard />
      ) : (
        <>
          <Hero />
          <Projects />
          <About />
          <Skills />
          <Experience />
          <Contributions />
          <Contact />
        </>
      )}
    </div>
  );
}
