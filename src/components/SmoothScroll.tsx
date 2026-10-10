"use client";

import { type ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";
import { cancelSectionNavigation, navigateToSection, IMMEDIATE_SCROLL_EVENT, SECTION_SCROLL_EVENT, type SectionScrollRequest } from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  useEffect(() => {
    let mounted = true;
    let frame = 0;
    const scheduleRefresh = () => {
      if (!mounted || frame) return;
      frame = requestAnimationFrame(() => { frame = 0; ScrollTrigger.refresh(true); });
    };
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(scheduleRefresh);
    observer?.observe(document.body);
    document.fonts?.ready.then(scheduleRefresh);
    return () => { mounted = false; cancelAnimationFrame(frame); observer?.disconnect(); };
  }, []);

  useEffect(() => {
    const lenis = prefersReducedMotion() ? null : new Lenis({
      duration: 0.8,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical", gestureOrientation: "vertical", smoothWheel: true, touchMultiplier: 1,
    });
    lenis?.on("scroll", ScrollTrigger.update);
    const onTick = (time: number) => lenis?.raf(time * 1000);
    if (lenis) gsap.ticker.add(onTick);

    const handleSectionScroll = (event: Event) => {
      if (!lenis) return;
      const request = (event as CustomEvent<SectionScrollRequest>).detail;
      event.preventDefault();
      lenis.scrollTo(request.target, { offset: request.offset, immediate: request.immediate, force: true, onComplete: request.onComplete });
    };
    const handleImmediateScroll = (event: Event) => {
      const top = (event as CustomEvent<number>).detail;
      if (!lenis || typeof top !== "number" || !Number.isFinite(top)) return;
      event.preventDefault();
      const wasStopped = lenis.isStopped;
      lenis.stop();
      lenis.scrollTo(top, { immediate: true, force: true });
      if (!wasStopped) lenis.start();
    };
    const handleAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !(event.target instanceof Element)) return;
      const anchor = event.target.closest("a");
      if (!anchor || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
      const href = anchor.getAttribute("href");
      if (!href?.startsWith("#") || href === "#") return;
      let id: string;
      try { id = decodeURIComponent(href.slice(1)); } catch { return; }
      if (!document.getElementById(id)) return;
      event.preventDefault();
      void navigateToSection(href);
    };
    document.addEventListener("click", handleAnchorClick);
    window.addEventListener(SECTION_SCROLL_EVENT, handleSectionScroll);
    window.addEventListener(IMMEDIATE_SCROLL_EVENT, handleImmediateScroll);
    return () => {
      lenis?.destroy();
      if (lenis) gsap.ticker.remove(onTick);
      document.removeEventListener("click", handleAnchorClick);
      window.removeEventListener(SECTION_SCROLL_EVENT, handleSectionScroll);
      window.removeEventListener(IMMEDIATE_SCROLL_EVENT, handleImmediateScroll);
      cancelSectionNavigation();
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    const restore = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (location.hash) void navigateToSection(location.hash, { history: "none", focus: false, behavior: "instant" });
      });
    };
    restore();
    window.addEventListener("hashchange", restore);
    window.addEventListener("popstate", restore);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", restore);
      window.removeEventListener("popstate", restore);
      cancelSectionNavigation();
    };
  }, [pathname]);

  return <>{children}</>;
}
