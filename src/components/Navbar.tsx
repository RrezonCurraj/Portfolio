"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Menu, Search, X } from "lucide-react";
import { portfolioCopy, portfolioData } from "@/data/portfolio";
import { useMode } from "@/components/Providers";
import { ThemeToggle } from "@/components/ThemeToggle";
import { RailNavigation } from "@/components/RailNavigation";
import { ScrollRuler } from "@/components/ScrollRuler";
import { openCommandPalette } from "@/components/CommandPalette";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { isRecruiterMode, toggleMode, theme } = useMode();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scroll, setScroll] = useState({ progress: 0, active: "home" });
  const menuButton = useRef<HTMLButtonElement>(null);
  const copy = portfolioCopy.header;

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const height = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
      );
      const distance = Math.max(0, height - window.innerHeight);
      const progress = distance
        ? Math.min(100, Math.max(0, (window.scrollY / distance) * 100))
        : 0;
      const sections = portfolioCopy.navigation
        .flatMap(({ id }) => {
          const element = document.getElementById(id);
          return element
            ? [
                {
                  id,
                  top: element.getBoundingClientRect().top + window.scrollY,
                },
              ]
            : [];
        })
        .sort((a, b) => a.top - b.top);
      const cursor = Math.max(0, window.scrollY) + window.innerHeight * 0.22;
      const current =
        progress === 100
          ? sections.at(-1)
          : (sections.filter((section) => section.top <= cursor).at(-1) ??
            sections[0]);
      const active = current?.id ?? "home";
      setScroll((previous) =>
        previous.progress === progress && previous.active === active
          ? previous
          : { progress, active },
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(schedule);
    observer?.observe(document.body);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer?.disconnect();
    };
  }, [isRecruiterMode]);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);

  const sectionLinks = (mobile = false) =>
    portfolioCopy.navigation.map((item) => (
      <a
        key={item.id}
        href={`#${item.id}`}
        className={cn("section-link", scroll.active === item.id && "is-active")}
        aria-current={scroll.active === item.id ? "location" : undefined}
        onClick={() => {
          if (mobile) setMenuOpen(false);
        }}
      >
        {item.label}
      </a>
    ));

  return (
    <>
      <header className="site-header">
        <Link
          href="/"
          className="wordmark"
          aria-label={`${portfolioData.personal.name} home`}
          onClick={(event) => {
            if (window.location.pathname !== "/") return;
            event.preventDefault();
            if (isRecruiterMode) toggleMode();
            window.scrollTo({
              top: 0,
              behavior: prefersReducedMotion() ? "instant" : "smooth",
            });
            setMenuOpen(false);
          }}
        >
          {portfolioData.personal.name.split(" ")[0].toLowerCase()}
          <span aria-hidden="true">®</span>
        </Link>
        <span className="header-role">{portfolioData.personal.role}</span>
        <div className="header-actions">
          {isRecruiterMode && (
            <button
              type="button"
              className="text-link resume-return"
              aria-label={copy.portfolio}
              onClick={toggleMode}
            >
              <ArrowLeft size={16} aria-hidden="true" />
              <span>{copy.portfolio}</span>
            </button>
          )}
          <button
            type="button"
            onClick={openCommandPalette}
            aria-label={copy.commands}
            className="icon-button command-trigger"
          >
            <Search size={17} aria-hidden="true" />
          </button>
          <ThemeToggle />
          {!isRecruiterMode && (
            <a
              href="#contact"
              className="header-contact"
              aria-label={copy.contact}
            >
              {copy.contact}
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          )}
          <button
            ref={menuButton}
            type="button"
            className="icon-button menu-trigger"
            aria-label={menuOpen ? copy.closeMenu : copy.openMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <Menu size={20} aria-hidden="true" />
            )}
          </button>
        </div>
        {menuOpen && (
          <nav
            id="mobile-navigation"
            className="mobile-navigation"
            aria-label={copy.mobileSections}
          >
            {sectionLinks(true)}
          </nav>
        )}
      </header>
      <aside className="scroll-rail">
        <RailNavigation
          items={portfolioCopy.navigation}
          activeId={scroll.active}
          enabled={!isRecruiterMode}
          theme={theme}
          label={copy.sections}
        />
        <ScrollRuler progress={scroll.progress} label={copy.progress} />
        <span className="rail-progress" aria-hidden="true">
          {String(Math.round(scroll.progress)).padStart(2, "0")}%
        </span>
      </aside>
    </>
  );
}
