"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { useCompactLayout } from "@/lib/useCompactLayout";
import { cn } from "@/lib/utils";

export function ResponsiveDisclosure({ anchorId, title, desktopHeading, headingLevel = 2, children, className }: {
  anchorId: string;
  title: string;
  desktopHeading: ReactNode;
  headingLevel?: 2 | 3;
  children: ReactNode;
  className?: string;
}): React.JSX.Element {
  const compact = useCompactLayout();
  const root = useRef<HTMLDetailsElement>(null);
  const compactOpen = useRef(false);
  const compactMode = useRef(compact);
  const Heading = headingLevel === 3 ? "h3" : "h2";

  useLayoutEffect(() => {
    const details = root.current;
    if (!details) return;
    compactMode.current = compact;
    let target: HTMLElement | null = null;
    try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch {}
    const ownsHash = !!target && (target.id === anchorId || details.contains(target));
    const focus = document.activeElement;
    const summary = details.querySelector("summary");
    const containsFocus = focus !== summary && details.contains(focus);
    details.open = !compact || compactOpen.current || ownsHash || containsFocus;
    if (!compact && focus === summary) {
      const heading = details.querySelector<HTMLElement>(".disclosure-desktop-heading :is(h2,h3)");
      if (heading) {
        heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
        heading.removeAttribute("tabindex");
      }
    }
  }, [compact, anchorId]);

  return (
    <details ref={root} open data-mobile-anchor={anchorId} className={cn("responsive-disclosure", className)} onToggle={event => {
      if (compactMode.current) compactOpen.current = event.currentTarget.open;
    }}>
      <summary className="disclosure-summary">
        <Heading>{title}</Heading>
        <ChevronDown size={18} className="details-chevron" aria-hidden="true" />
      </summary>
      <div className="disclosure-content">
        <div className="disclosure-desktop-heading">{desktopHeading}</div>
        {children}
      </div>
    </details>
  );
}
