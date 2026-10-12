import { act, render, screen } from "@testing-library/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "@/components/ui/SectionHeading";

it("restores the visible heading and removes scroll work when reduced motion changes", () => {
  const originalMatchMedia = window.matchMedia;
  const listeners = new Set<() => void>();
  let reduced = false;
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    get matches() {
      return query === "all" ||
        (query === "(prefers-reduced-motion: reduce)" && reduced);
    },
    media: query,
    onchange: null,
    addListener: (listener: () => void) => listeners.add(listener),
    removeListener: (listener: () => void) => listeners.delete(listener),
    addEventListener: (_event: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_event: string, listener: () => void) => listeners.delete(listener),
    dispatchEvent: () => true,
  }));

  const now = jest.spyOn(Date, "now");
  now.mockReturnValue(10000);
  try {
    const { container, unmount } = render(
      <SectionHeading number="01" title="Selected work" description="Recent projects." />,
    );
    const measuredHeading = screen.getByRole("heading", { name: "Selected work" });
    const root = container.firstElementChild;
    const trigger = ScrollTrigger.getAll().find((item) => item.trigger === root);
    expect(trigger?.animation).toBeDefined();
    act(() => { trigger!.animation!.progress(0.25); });
    expect(measuredHeading.style.transform).toBe("");
    expect(screen.getByText("Recent projects.").style.transform).toBe("");

    reduced = true;
    now.mockReturnValue(10010);
    act(() => { listeners.forEach((listener) => listener()); });
    expect(ScrollTrigger.getAll().some((item) => item.trigger === root)).toBe(false);
    expect(measuredHeading).toBeVisible();
    expect(measuredHeading).toHaveAccessibleName("Selected work");
    measuredHeading.querySelectorAll<HTMLElement>("span").forEach((span) => {
      expect(span.style.transform).toBe("");
      expect(span.style.opacity).toBe("");
    });

    reduced = false;
    now.mockReturnValue(10020);
    act(() => { listeners.forEach((listener) => listener()); });
    expect(ScrollTrigger.getAll().some((item) => item.trigger === root)).toBe(true);
    unmount();
    expect(ScrollTrigger.getAll().some((item) => item.trigger === root)).toBe(false);
  } finally {
    window.matchMedia = originalMatchMedia;
    now.mockRestore();
  }
});
