"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
];

export function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6"
    >
      <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 flex items-center gap-6 shadow-2xl">
        <Link 
          href="/" 
          onClick={(e) => {
            if (window.location.pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="font-bold text-xl tracking-tighter text-white"
        >
          RC<span className="text-[var(--color-primary)]">.</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-zinc-400 hover:text-[var(--color-primary)] transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <Link 
          href="#contact"
          className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-bold hover:bg-[var(--color-primary)] transition-colors"
        >
          Hire Me
        </Link>
      </div>
    </motion.nav>
  );
}
