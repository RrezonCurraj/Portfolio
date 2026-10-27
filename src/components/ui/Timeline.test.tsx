import { act, fireEvent, render } from "@testing-library/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Timeline } from "@/components/ui/Timeline";

const items = [0, 1, 2].map(index => ({
  id: `milestone-${index}`,
  title: `Company ${index}`,
  period: "2020–2024",
  role: "Developer",
  description: "Shipped accessible experiences.",
}));

function renderTimeline(reducedMotion = false) {
  const originalMatchMedia = window.matchMedia;
  const originalObserver = window.ResizeObserver;
  let width = 400;
  let travel = 1000;
  let start = 500;
  let resize: ResizeObserverCallback | undefined;
  const disconnect = jest.fn();
  window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: query === "all" || (reducedMotion && query === "(prefers-reduced-motion: reduce)"), media: query, onchange: null,
    addListener: jest.fn(), removeListener: jest.fn(),
    addEventListener: jest.fn(), removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
  window.ResizeObserver = class {
    constructor(callback: ResizeObserverCallback) { resize = callback; }
    observe() {}
    unobserve() {}
    disconnect = disconnect;
  } as unknown as typeof ResizeObserver;
  const isViewport = (element: HTMLElement) => element.getAttribute("role") === "group";
  const clientWidth = jest.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (this: HTMLElement) {
    return isViewport(this) ? width : 0;
  });
  const scrollWidth = jest.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockImplementation(function (this: HTMLElement) {
    return this.parentElement && isViewport(this.parentElement) ? width + travel : 0;
  });
  const offsetWidth = jest.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(function (this: HTMLElement) {
    return this.hasAttribute("data-milestone") ? 320 : 0;
  });
  const milestoneReads = jest.fn();
  const rect = jest.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
    let left = 30;
    if (this.hasAttribute("data-milestone")) {
      milestoneReads();
      const index = Array.from(this.parentElement!.querySelectorAll("[data-milestone]")).indexOf(this);
      const track = this.closest('[role="group"]')!.firstElementChild!;
      left += start + index * 400 + Number(gsap.getProperty(track, "x"));
    }
    return { top: 0, bottom: 600, left, right: left + width, x: left, y: 0, width, height: 600, toJSON() {} } as DOMRect;
  });
  const view = render(<Timeline items={items} title="Experience" periodLabel="2020–2024" label="Career timeline" hint="Scroll to explore" />);
  const viewport = view.getByRole("group");
  const root = viewport.parentElement!;
  const trigger = ScrollTrigger.getAll().find(entry => entry.trigger === root)!;
  const milestones = Array.from(root.querySelectorAll<HTMLElement>("[data-milestone]"));
  const dispose = () => {
    view.unmount();
    rect.mockRestore(); clientWidth.mockRestore(); scrollWidth.mockRestore(); offsetWidth.mockRestore();
    window.matchMedia = originalMatchMedia;
    window.ResizeObserver = originalObserver;
  };
  return {
    ...view, root, viewport, trigger, milestones, milestoneReads, disconnect,
    resize() {
      width = 500; travel = 1200; start = 600;
      act(() => { resize!([], {} as ResizeObserver); });
    },
    dispose,
  };
}

it("reveals milestones without per-frame geometry reads or tween allocations", () => {
  const fixture = renderTimeline();
  const set = jest.spyOn(gsap, "set");
  try {
    expect(Number(gsap.getProperty(fixture.milestones[0].querySelector("[data-reveal]")!, "opacity"))).toBe(0);
    fixture.milestoneReads.mockClear();
    set.mockClear();
    act(() => { fixture.trigger.animation!.progress(0.604); });
    expect(fixture.milestoneReads).not.toHaveBeenCalled();
    expect(set).not.toHaveBeenCalled();
    const stem = fixture.milestones[1].querySelector<HTMLElement>("[data-stem]")!;
    const content = fixture.milestones[1].querySelector<HTMLElement>("[data-reveal]")!;
    expect(Number(gsap.getProperty(stem, "scaleY"))).toBeCloseTo(0.875, 3);
    expect(Number(gsap.getProperty(content, "y"))).toBeCloseTo(3, 3);
    expect(Number(gsap.getProperty(content, "opacity"))).toBeCloseTo(0.875, 3);
    act(() => { fixture.trigger.animation!.progress(0.5); });
    expect(Number(gsap.getProperty(content, "opacity"))).toBe(0);
    act(() => { fixture.trigger.animation!.progress(0.604); });
    expect(Number(gsap.getProperty(content, "opacity"))).toBeCloseTo(0.875, 3);
  } finally { set.mockRestore(); fixture.dispose(); }
});

it("does not rewrite milestones that stay fully revealed or hidden", () => {
  const fixture = renderTimeline();
  const observer = new MutationObserver(() => {});
  try {
    act(() => { fixture.trigger.animation!.progress(0.6); });
    observer.observe(fixture.milestones[0], { subtree: true, attributes: true, attributeFilter: ["style"] });
    observer.observe(fixture.milestones[2], { subtree: true, attributes: true, attributeFilter: ["style"] });
    act(() => { fixture.trigger.animation!.progress(0.604); });
    expect(observer.takeRecords()).toHaveLength(0);
  } finally { observer.disconnect(); fixture.dispose(); }
});

it("refreshes reveal geometry after resize and keeps keyboard navigation aligned", () => {
  const fixture = renderTimeline();
  try {
    fixture.resize();
    act(() => { fixture.trigger.animation!.progress(0.525); });
    const content = fixture.milestones[1].querySelector<HTMLElement>("[data-reveal]")!;
    expect(Number(gsap.getProperty(content, "opacity"))).toBeCloseTo(0.875, 3);
    act(() => { fixture.trigger.animation!.progress(0.1); });
    jest.mocked(window.scrollTo).mockClear();
    fireEvent.keyDown(fixture.viewport, { key: "ArrowRight" });
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: fixture.trigger.start + 510, behavior: "instant" });
    fixture.unmount();
    expect(fixture.disconnect).toHaveBeenCalledTimes(1);
    expect(fixture.root).not.toHaveAttribute("data-animated");
    expect(fixture.root.style.getPropertyValue("--timeline-travel")).toBe("");
    expect(ScrollTrigger.getAll().some(entry => entry.trigger === fixture.root)).toBe(false);
    for (const element of fixture.root.querySelectorAll<HTMLElement>("[data-stem], [data-dot], [data-reveal]")) {
      expect(element.style.transform).toBe("");
      expect(element.style.opacity).toBe("");
    }
  } finally { fixture.dispose(); }
});

it("keeps the static timeline free of animation work with reduced motion", () => {
  const fixture = renderTimeline(true);
  try {
    expect(fixture.root).not.toHaveAttribute("data-animated");
    expect(fixture.trigger).toBeUndefined();
    for (const element of fixture.root.querySelectorAll<HTMLElement>("[data-stem], [data-dot], [data-reveal]")) {
      expect(element.style.transform).toBe("");
      expect(element.style.opacity).toBe("");
    }
  } finally { fixture.dispose(); }
});
