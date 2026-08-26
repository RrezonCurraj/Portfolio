"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { useMode } from "@/components/Providers";
import { prefersReducedMotion } from "@/lib/motion";
import { openCommandPalette } from "@/components/CommandPalette";

const navItems = [
  { name: "About", id: "about" },
  { name: "Skills", id: "skills" },
  { name: "Projects", id: "projects" },
  { name: "Experience", id: "experience" },
];

export function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const { isRecruiterMode, toggleMode } = useMode();
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    navItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.from(navRef.current, {
      y: -100,
      duration: 0.3,
      ease: "power2.out",
    });
  }, { scope: navRef });

  return (
    <nav
      ref={navRef}
      aria-label="Primary"
      className="fixed top-0 left-0 w-full z-50 px-4 md:px-12 py-4 md:py-6 pointer-events-none"
    >
      <div className="max-w-[1400px] mx-auto flex justify-between items-start">
        <div className="pointer-events-auto flex items-center gap-8 border-2 border-control bg-surface px-3 py-2 shadow-[4px_4px_0px_var(--color-accent)] transition-transform hover:-translate-x-1 hover:translate-y-1 md:px-6 md:py-3">
          <Link
            href="/"
            aria-label="Rrezon Curraj home"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="text-xl font-black tracking-tighter text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:text-2xl"
          >
            RREZON<span className="text-[var(--color-primary)]">_</span>
          </Link>
          <div className="hidden lg:flex items-center gap-8 font-mono text-sm uppercase tracking-widest font-bold">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <Link
                  key={item.name}
                  href={`#${item.id}`}
                  className={`group relative transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isActive ? "text-primary" : "text-muted hover:text-primary"}`}
                >
                  {item.name}
                  <span className={`absolute -bottom-1 left-0 w-full h-[2px] bg-[var(--color-primary)] transition-transform origin-left ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100"}`} />
                </Link>
              );
            })}
            <button
              onClick={openCommandPalette}
              aria-label="Open command palette"
              className="border border-border-strong px-2 py-1 font-mono text-xs tracking-widest text-muted-soft transition-colors hover:border-primary hover:text-primary"
            >
              ⌘K
            </button>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-2 md:gap-4">
          <button
            onClick={toggleMode}
            aria-pressed={isRecruiterMode}
            className={`inline-block transform border-2 px-2 py-2 font-mono text-[10px] font-black uppercase tracking-widest shadow-[4px_4px_0px_currentColor] transition-colors hover:-translate-x-1 hover:translate-y-1 hover:shadow-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background md:px-4 md:py-3 md:text-sm ${
              isRecruiterMode
                ? "border-primary bg-background text-primary"
                : "border-foreground bg-surface text-foreground"
            }`}
          >
            <span className="hidden md:inline">[ RECRUITER MODE: {isRecruiterMode ? "ON" : "OFF"} ]</span>
            <span className="md:hidden">[ RECRUITER: {isRecruiterMode ? "ON" : "OFF"} ]</span>
          </button>
          <Link
            href="#contact"
            aria-label="Go to contact section"
            className="hidden transform border-2 border-control bg-accent px-6 py-3 font-mono text-sm font-black uppercase tracking-widest text-accent-foreground shadow-[4px_4px_0px_var(--color-accent)] transition-colors hover:-translate-x-1 hover:translate-y-1 hover:bg-surface hover:text-primary hover:shadow-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background md:inline-block"
          >
            [ INITIALIZE ]
          </Link>
        </div>
      </div>
    </nav>
  );
}
