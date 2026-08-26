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
      <section ref={containerRef} className="hero-stage relative flex min-h-screen flex-col justify-center overflow-hidden px-4 pt-24 md:px-12 md:pt-32">
        {bg === "three" && <ThreeBackground />}
        {bg === "grid" && (
          <div style={tilt(20, 20)} className="absolute inset-0 z-0">
            <MobileGridFX />
          </div>
        )}

        <div className="w-full max-w-[1400px] mx-auto z-10 relative">
          <div className="hero-fade-in mb-8 md:mb-12 flex justify-start" style={tilt(-12, -10)}>
            <span className="block border-2 border-primary bg-surface px-3 py-2 font-mono text-xs uppercase tracking-[0.2em] text-primary shadow-[4px_4px_0_0_var(--color-accent)] md:px-4 md:py-2 md:text-sm">
              {"// " + portfolioData.personal.role}
            </span>
          </div>

          <div className="mb-12 md:mb-16 space-y-0 leading-[1] md:leading-[0.9] relative flex flex-col" style={tilt(36, 24)}>
            <div className="block z-0 relative left-0 md:left-4">
              <TextReveal
                className="text-[clamp(2.5rem,10vw,7rem)] font-sans font-black tracking-tighter text-foreground uppercase max-md:whitespace-normal md:whitespace-nowrap"
                activeColor="var(--color-primary)"
              >
                I BUILD
              </TextReveal>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-baseline md:gap-x-6 relative z-10 -mt-2">
              <TextReveal
                className="text-[clamp(2.5rem,10vw,7rem)] font-sans font-black tracking-tighter text-foreground uppercase max-md:whitespace-normal md:whitespace-nowrap"
                activeColor="var(--color-primary)"
              >
                DIGITAL
              </TextReveal>

              <TextReveal
                className="text-[clamp(2.5rem,10vw,7rem)] font-sans font-black tracking-tighter text-[var(--color-primary)] text-glow uppercase max-md:whitespace-normal md:whitespace-nowrap drop-shadow-lg"
                delay={0.2}
                activeColor="var(--foreground)"
              >
                EXPERIENCES
              </TextReveal>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-end" style={tilt(-16, -10)}>
            <div className="hero-panel relative border-2 border-border bg-surface p-6 font-mono text-base leading-relaxed text-foreground/80 shadow-xl md:col-span-6 md:p-8 md:text-xl">
              <p>{portfolioData.personal.bio}</p>
              <div className="absolute top-0 left-0 h-full w-2 bg-accent"></div>
            </div>

            <div className="hero-fade-in md:col-start-8 md:col-span-5 flex flex-wrap gap-4 justify-start md:justify-end">
              <a
                href="#projects"
                className="flex w-full items-center justify-center gap-3 border-2 border-control bg-accent px-6 py-4 font-sans text-sm font-black uppercase tracking-wider text-accent-foreground transition-all duration-200 hover:-translate-y-1 hover:translate-x-1 hover:shadow-[-4px_4px_0_0_var(--color-foreground)] active:translate-x-0 active:translate-y-0 active:shadow-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto md:px-8 md:py-4 md:text-base"
              >
                View Work <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href="/Rrezon_Curraj_CV.pdf"
                download
                aria-label="Download my CV as PDF"
                className="flex w-full items-center justify-center gap-3 border-2 border-border-strong bg-surface px-6 py-4 font-sans text-sm font-black uppercase tracking-wider text-foreground transition-all duration-200 hover:-translate-y-1 hover:translate-x-1 hover:border-foreground hover:shadow-[-4px_4px_0_0_var(--color-accent)] active:translate-x-0 active:translate-y-0 active:shadow-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto md:px-8 md:py-4 md:text-base"
              >
                CV <Download className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href="#contact"
                aria-label="Go to contact section"
                className="w-full border-2 border-border-strong bg-background px-6 py-4 text-center font-sans text-sm font-black uppercase tracking-wider text-foreground transition-all duration-200 hover:-translate-y-1 hover:translate-x-1 hover:border-foreground hover:shadow-[-4px_4px_0_0_var(--color-accent)] active:translate-x-0 active:translate-y-0 active:shadow-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto md:px-8 md:py-4 md:text-base"
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
