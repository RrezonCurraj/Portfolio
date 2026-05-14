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
        <div className="bg-[#1e293b] border-2 border-[var(--color-primary)] px-3 py-2 md:px-6 md:py-3 flex items-center gap-8 pointer-events-auto transform transition-transform hover:translate-y-1 hover:-translate-x-1 shadow-[4px_4px_0px_var(--color-primary)]">
          <Link
            href="/"
            aria-label="Rrezon Curraj home"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="font-black text-xl md:text-2xl tracking-tighter text-[#f8fafc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
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
                  className={`transition-colors relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${isActive ? "text-[var(--color-primary)]" : "text-zinc-400 hover:text-[var(--color-primary)]"}`}
                >
                  {item.name}
                  <span className={`absolute -bottom-1 left-0 w-full h-[2px] bg-[var(--color-primary)] transition-transform origin-left ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100"}`} />
                </Link>
              );
            })}
            <button
              onClick={openCommandPalette}
              aria-label="Open command palette"
              className="text-zinc-500 hover:text-[var(--color-primary)] transition-colors font-mono text-xs tracking-widest border border-zinc-700 px-2 py-1 hover:border-[var(--color-primary)]"
            >
              ⌘K
            </button>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-2 md:gap-4">
          <button
            onClick={toggleMode}
            aria-pressed={isRecruiterMode}
            className={`border-2 px-2 py-2 md:px-4 md:py-3 font-black font-mono uppercase tracking-widest text-[10px] md:text-sm transition-colors inline-block transform hover:translate-y-1 hover:-translate-x-1 shadow-[4px_4px_0px_currentColor] hover:shadow-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a] ${
              isRecruiterMode
                ? "bg-[#0f172a] text-[var(--color-primary)] border-[var(--color-primary)]"
                : "bg-white text-[#0f172a] border-[#0f172a]"
            }`}
          >
            <span className="hidden md:inline">[ RECRUITER MODE: {isRecruiterMode ? "ON" : "OFF"} ]</span>
            <span className="md:hidden">[ RECRUITER: {isRecruiterMode ? "ON" : "OFF"} ]</span>
          </button>
          <Link
            href="#contact"
            aria-label="Go to contact section"
            className="hidden md:inline-block bg-[var(--color-primary)] text-[#0f172a] border-2 border-[var(--color-primary)] px-6 py-3 font-black font-mono uppercase tracking-widest text-sm hover:bg-[#1e293b] hover:text-[var(--color-primary)] transition-colors transform hover:translate-y-1 hover:-translate-x-1 shadow-[4px_4px_0px_var(--color-primary)] hover:shadow-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a]"
          >
            [ INITIALIZE ]
          </Link>
        </div>
      </div>
    </nav>
  );
}
