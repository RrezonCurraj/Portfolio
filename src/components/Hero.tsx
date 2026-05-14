"use client";

import { useRef, useState, useEffect } from "react";
import { portfolioData } from "@/data/portfolio";
import { ArrowRight, Download } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { TextReveal } from "@/components/ui/TextReveal";
import { prefersReducedMotion } from "@/lib/motion";
import { useDeviceTilt } from "@/lib/useDeviceTilt";
import { TiltEnableButton } from "@/components/TiltEnableButton";
import { HeroTicker } from "@/components/HeroTicker";
import { MobileGridFX } from "@/components/MobileGridFX";
import dynamic from "next/dynamic";
const ThreeBackground = dynamic(() => import("@/components/ThreeBackground").then(mod => mod.ThreeBackground), { ssr: false });

type BgVariant = "none" | "three" | "grid";

// Tilt parallax helpers — each layer picks a translate amount in px.
const tilt = (xPx: number, yPx: number): React.CSSProperties => ({
  transform: `translate3d(calc(var(--tilt-x, 0) * ${xPx}px), calc(var(--tilt-y, 0) * ${yPx}px), 0)`,
  willChange: "transform",
});

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bg, setBg] = useState<BgVariant>("none");
  const [heroInView, setHeroInView] = useState(true);

  const { status: tiltStatus, enable: enableTilt } = useDeviceTilt();

  // Hide the tilt button once hero scrolls off — tapping it elsewhere does nothing visible.
  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting),
      { threshold: 0.15 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const isMobile = window.matchMedia("(pointer: coarse), (max-width: 767px)").matches;
    if (isMobile) {
      const rafId = requestAnimationFrame(() => setBg("grid"));
      return () => cancelAnimationFrame(rafId);
    }

    let mounted = false;
    const mountThree = () => {
      if (!mounted) {
        mounted = true;
        setBg("three");
        cleanup();
      }
    };

    const timer = setTimeout(mountThree, 2500);

    const cleanup = () => {
      window.removeEventListener("mousemove", mountThree);
      window.removeEventListener("scroll", mountThree);
      clearTimeout(timer);
    };

    window.addEventListener("mousemove", mountThree, { once: true });
    window.addEventListener("scroll", mountThree, { once: true });

    return cleanup;
  }, []);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.from(".hero-fade-in", {
      y: 20,
      opacity: 0,
      duration: 0.4,
      stagger: 0.05,
      delay: 0,
      ease: "power2.out",
    });
  }, { scope: containerRef });

  return (
    <>
      <section ref={containerRef} className="min-h-screen flex flex-col justify-center px-4 md:px-12 pt-24 md:pt-32 relative overflow-hidden">
        {bg === "three" && <ThreeBackground />}
        {bg === "grid" && (
          <div style={tilt(20, 20)} className="absolute inset-0 z-0">
            <MobileGridFX />
          </div>
        )}

        <div className="w-full max-w-[1400px] mx-auto z-10 relative">
          <div className="hero-fade-in mb-8 md:mb-12 flex justify-start" style={tilt(-12, -10)}>
            <span className="text-[var(--color-primary)] font-mono text-xs md:text-sm tracking-[0.2em] uppercase block border-2 border-[var(--color-primary)] px-3 py-2 md:px-4 md:py-2 bg-[#1e293b] shadow-[4px_4px_0_0_rgba(34,197,94,1)]">
              {"// " + portfolioData.personal.role}
            </span>
          </div>

          <div className="mb-12 md:mb-16 space-y-0 leading-[1] md:leading-[0.9] relative flex flex-col" style={tilt(36, 24)}>
            <div className="block z-0 relative left-0 md:left-4">
              <TextReveal
                className="text-[clamp(2.5rem,10vw,7rem)] font-sans font-black tracking-tighter text-white uppercase max-md:whitespace-normal md:whitespace-nowrap"
                activeColor="var(--color-primary)"
              >
                I BUILD
              </TextReveal>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-baseline md:gap-x-6 relative z-10 -mt-2">
              <TextReveal
                className="text-[clamp(2.5rem,10vw,7rem)] font-sans font-black tracking-tighter text-white uppercase max-md:whitespace-normal md:whitespace-nowrap"
                activeColor="var(--color-primary)"
              >
                DIGITAL
              </TextReveal>

              <TextReveal
                className="text-[clamp(2.5rem,10vw,7rem)] font-sans font-black tracking-tighter text-[var(--color-primary)] text-glow uppercase max-md:whitespace-normal md:whitespace-nowrap drop-shadow-lg"
                delay={0.2}
                activeColor="white"
              >
                EXPERIENCES
              </TextReveal>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-end" style={tilt(-16, -10)}>
            <div className="hero-fade-in md:col-span-6 text-white/80 text-base md:text-xl font-mono leading-relaxed bg-[#1e293b] p-6 md:p-8 border-2 border-white/10 shadow-xl relative">
              <p>{portfolioData.personal.bio}</p>
              <div className="absolute top-0 left-0 w-2 h-full bg-[var(--color-primary)]"></div>
            </div>

            <div className="hero-fade-in md:col-start-8 md:col-span-5 flex flex-wrap gap-4 justify-start md:justify-end">
              <a
                href="#projects"
                aria-label="View my projects"
                className="bg-[var(--color-primary)] text-[#0f172a] px-6 py-4 md:px-8 md:py-4 font-black font-sans uppercase tracking-wider text-sm md:text-base border-2 border-[var(--color-primary)] hover:-translate-y-1 hover:translate-x-1 hover:shadow-[-4px_4px_0_0_rgba(248,250,252,1)] active:translate-y-0 active:translate-x-0 active:shadow-none transition-all duration-200 flex items-center gap-3 w-full sm:w-auto justify-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a]"
              >
                View Work <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href="/Rrezon_Curraj_CV.pdf"
                download
                aria-label="Download my CV as PDF"
                className="bg-[#1e293b] px-6 py-4 md:px-8 md:py-4 font-black font-sans uppercase tracking-wider text-sm md:text-base text-white border-2 border-white/20 hover:border-white hover:-translate-y-1 hover:translate-x-1 hover:shadow-[-4px_4px_0_0_rgba(34,197,94,1)] active:translate-y-0 active:translate-x-0 active:shadow-none transition-all duration-200 flex items-center gap-3 w-full sm:w-auto justify-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a]"
              >
                CV <Download className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href="#contact"
                aria-label="Go to contact section"
                className="bg-[#0f172a] px-6 py-4 md:px-8 md:py-4 font-black font-sans uppercase tracking-wider text-sm md:text-base text-white border-2 border-white/20 hover:border-white hover:-translate-y-1 hover:translate-x-1 hover:shadow-[-4px_4px_0_0_rgba(34,197,94,1)] active:translate-y-0 active:translate-x-0 active:shadow-none transition-all duration-200 w-full sm:w-auto text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a]"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </section>
      <HeroTicker />
      {heroInView && <TiltEnableButton status={tiltStatus} onEnable={enableTilt} />}
    </>
  );
}
