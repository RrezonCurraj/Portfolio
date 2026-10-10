export const IMMEDIATE_SCROLL_EVENT = "portfolio:immediate-scroll";

export function scrollImmediately(top: number) {
  const request = new CustomEvent<number>(IMMEDIATE_SCROLL_EVENT, {
    detail: top,
    cancelable: true,
  });
  if (window.dispatchEvent(request)) {
    window.scrollTo({ top, behavior: "instant" });
  }
}

export const SECTION_SCROLL_EVENT = "portfolio:section-scroll";
export type SectionScrollRequest = {
  target: HTMLElement;
  offset: number;
  immediate: boolean;
  onComplete: () => void;
};

let navigationRun = 0;
let cancelPending: (() => void) | undefined;

export function cancelSectionNavigation() {
  navigationRun += 1;
  cancelPending?.();
  cancelPending = undefined;
}

export async function navigateToSection(id: string, options: {
  history?: "push" | "none";
  focus?: boolean;
  behavior?: "smooth" | "instant";
} = {}): Promise<boolean> {
  let decoded: string;
  try { decoded = decodeURIComponent(id.replace(/^#/, "")); } catch { return false; }
  if (!decoded) return false;
  const target = document.getElementById(decoded);
  if (!target) return false;
  cancelSectionNavigation();
  const run = navigationRun;
  const disclosures = new Set<HTMLDetailsElement>();
  document.querySelectorAll<HTMLDetailsElement>("details[data-mobile-anchor]").forEach(details => {
    if (details.dataset.mobileAnchor === decoded) disclosures.add(details);
  });
  let ancestor = target.closest("details");
  while (ancestor) {
    disclosures.add(ancestor);
    ancestor = ancestor.parentElement?.closest("details") ?? null;
  }
  let revealed = false;
  disclosures.forEach(details => {
    if (!details.open) { details.open = true; revealed = true; }
  });
  if (revealed) {
    await new Promise<void>(resolve => {
      let frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => { cancelPending = undefined; resolve(); });
      });
      cancelPending = () => { cancelAnimationFrame(frame); resolve(); };
    });
  }
  if (run !== navigationRun || !target.isConnected) return false;
  if (options.history !== "none") {
    const hash = `#${encodeURIComponent(decoded)}`;
    if (location.hash !== hash) history.pushState(null, "", hash);
  }
  const immediate = options.behavior === "instant" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const onComplete = () => {
    if (run !== navigationRun || !target.isConnected || options.focus === false) return;
    const previous = target.getAttribute("tabindex");
    if (previous === null) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    if (previous === null) target.removeAttribute("tabindex");
  };
  const request = new CustomEvent<SectionScrollRequest>(SECTION_SCROLL_EVENT, {
    cancelable: true,
    detail: { target, offset: -(parseFloat(getComputedStyle(target).scrollMarginTop) || 0), immediate, onComplete },
  });
  if (window.dispatchEvent(request)) {
    const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY + request.detail.offset);
    if (immediate) {
      window.scrollTo({ top, behavior: "instant" });
      onComplete();
    } else {
      const finish = () => { cleanup(); onComplete(); };
      const timer = window.setTimeout(finish, 1000);
      const cleanup = () => {
        clearTimeout(timer);
        window.removeEventListener("scrollend", finish);
        cancelPending = undefined;
      };
      cancelPending = cleanup;
      window.addEventListener("scrollend", finish, { once: true });
      window.scrollTo({ top, behavior: "smooth" });
    }
  }
  return true;
}
