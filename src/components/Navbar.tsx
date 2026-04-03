"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { useMode } from "@/components/Providers";

const navItems = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
];

export function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const { isRecruiterMode, toggleMode } = useMode();

  useGSAP(() => {
    gsap.from(navRef.current, {
      y: -100,
      duration: 0.3,
      ease: "power2.out",
    });
  }, { scope: navRef });

  return (
    <nav 
      ref={navRef}
      className="fixed top-0 left-0 w-full z-50 px-4 md:px-12 py-4 md:py-6 pointer-events-none"
    >
      <div className="max-w-[1400px] mx-auto flex justify-between items-start">
        <div className="bg-[#1e293b] border-2 border-[var(--color-primary)] px-4 py-3 md:px-6 flex items-center gap-8 pointer-events-auto transform transition-transform hover:translate-y-1 hover:-translate-x-1 shadow-[4px_4px_0px_var(--color-primary)]">
          <Link 
            href="/" 
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="font-black text-2xl tracking-tighter text-[#f8fafc]"
          >
            RREZON<span className="text-[var(--color-primary)]">_</span>
          </Link>
          <div className="hidden lg:flex items-center gap-6 font-mono text-sm uppercase tracking-widest font-bold">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-zinc-400 hover:text-[var(--color-primary)] transition-colors relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[var(--color-primary)] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            ))}
          </div>
        </div>
        
        <div className="pointer-events-auto flex items-center gap-4">
          <button 
            onClick={toggleMode}
            className={`border-2 px-4 py-3 font-black font-mono uppercase tracking-widest text-xs md:text-sm transition-colors inline-block transform hover:translate-y-1 hover:-translate-x-1 shadow-[4px_4px_0px_currentColor] hover:shadow-none ${
              isRecruiterMode 
                ? "bg-[#0f172a] text-[var(--color-primary)] border-[var(--color-primary)]" 
                : "bg-white text-[#0f172a] border-[#0f172a]"
            }`}
          >
            [ RECRUITER MODE: {isRecruiterMode ? "ON" : "OFF"} ]
          </button>
          <Link 
            href="#contact"
            className="hidden md:inline-block bg-[var(--color-primary)] text-[#0f172a] border-2 border-[var(--color-primary)] px-6 py-3 font-black font-mono uppercase tracking-widest text-sm hover:bg-[#1e293b] hover:text-[var(--color-primary)] transition-colors transform hover:translate-y-1 hover:-translate-x-1 shadow-[4px_4px_0px_var(--color-primary)] hover:shadow-none"
          >
            [ INITIALIZE ]
          </Link>
        </div>
      </div>
    </nav>
  );
}
