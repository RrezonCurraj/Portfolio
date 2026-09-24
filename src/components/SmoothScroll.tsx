"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1,
    });

    // 1. Synchronize Lenis scrolling with GSAP's ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // 2. Use GSAP's ticker to drive Lenis animations
    // This ensures they run in the exact same animation frame
    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);

    // We do NOT disable lag smoothing, to prevent violent stutters if frames drop.

    const handleAnchorClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (!(e.target instanceof Element)) return;
      const anchor = e.target.closest("a");
      if (!anchor || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
      const href = anchor.getAttribute("href");
      if (!href?.startsWith("#") || href === "#") return;
      let id: string;
      try { id = decodeURIComponent(href.slice(1)); } catch { return; }
      const element = document.getElementById(id);
      if (!element) return;
      e.preventDefault();
      history.pushState(null, "", href);
      lenis.scrollTo(element, {
        onComplete: () => {
          const addedTabIndex = !element.hasAttribute("tabindex");
          if (addedTabIndex) element.setAttribute("tabindex", "-1");
          element.focus({ preventScroll: true });
          if (addedTabIndex) element.removeAttribute("tabindex");
        },
      });
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(onTick);
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  return <>{children}</>;
}
