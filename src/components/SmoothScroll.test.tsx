import { act, render } from "@testing-library/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SmoothScroll } from "./SmoothScroll";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({ usePathname: jest.fn(() => "/") }));

beforeEach(() => { jest.mocked(usePathname).mockReturnValue("/"); history.replaceState(null, "", "/"); });
afterEach(() => { history.replaceState(null, "", "/"); });

jest.mock("lenis", () =>
  jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    raf: jest.fn(),
    destroy: jest.fn(),
  })),
);

jest.mock("gsap", () => ({
  __esModule: true,
  default: {
    registerPlugin: jest.fn(),
    ticker: { add: jest.fn(), remove: jest.fn() },
  },
}));

jest.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: { update: jest.fn(), refresh: jest.fn() },
}));

it("refreshes heading positions once when content resizes and cancels pending refreshes on unmount", () => {
  jest.useFakeTimers();
  const originalObserver = window.ResizeObserver;
  let resize: ResizeObserverCallback | undefined;
  const disconnect = jest.fn();
  window.ResizeObserver = class {
    constructor(callback: ResizeObserverCallback) {
      resize = callback;
    }
    observe() {}
    unobserve() {}
    disconnect = disconnect;
  } as unknown as typeof ResizeObserver;
  jest.mocked(ScrollTrigger.refresh).mockClear();
  try {
    const { unmount } = render(
      <SmoothScroll>
        <details>
          <summary>Experience</summary>More content
        </details>
      </SmoothScroll>,
    );
    expect(resize).toBeDefined();
    resize!([], {} as ResizeObserver);
    resize!([], {} as ResizeObserver);
    jest.advanceTimersByTime(32);
    expect(ScrollTrigger.refresh).toHaveBeenCalledTimes(1);
    resize!([], {} as ResizeObserver);
    unmount();
    jest.advanceTimersByTime(32);
    expect(ScrollTrigger.refresh).toHaveBeenCalledTimes(1);
    expect(disconnect).toHaveBeenCalledTimes(1);
  } finally {
    window.ResizeObserver = originalObserver;
    jest.useRealTimers();
  }
});

it("removes the exact animation callback it registered", () => {
  const { unmount } = render(
    <SmoothScroll>
      <div>Page</div>
    </SmoothScroll>,
  );
  const callback = (gsap.ticker.add as jest.Mock).mock.calls[0][0];

  unmount();

  expect(gsap.ticker.remove).toHaveBeenCalledWith(callback);
});

it("keeps native scrolling when reduced motion is preferred", () => {
  const originalMatchMedia = window.matchMedia;
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches: query === "(prefers-reduced-motion: reduce)",
  }));

  try {
    jest.clearAllMocks();
    render(
      <SmoothScroll>
        <div>Page</div>
      </SmoothScroll>,
    );
    expect(Lenis).not.toHaveBeenCalled();
    expect(gsap.ticker.add).not.toHaveBeenCalled();
  } finally {
    window.matchMedia = originalMatchMedia;
  }
});

it("scrolls to encoded fragment IDs without interpreting them as CSS selectors", () => {
  const scrollTo = jest.fn();
  (Lenis as unknown as jest.Mock).mockImplementationOnce(() => ({
    on: jest.fn(),
    raf: jest.fn(),
    destroy: jest.fn(),
    scrollTo,
  }));
  const { getByText } = render(
    <SmoothScroll>
      <a href="#project%3Aone">Jump</a>
      <section id="project:one">Target</section>
    </SmoothScroll>,
  );
  getByText("Jump").dispatchEvent(
    new MouseEvent("click", { bubbles: true, cancelable: true }),
  );
  expect(scrollTo).toHaveBeenCalledWith(
    getByText("Target"),
    expect.objectContaining({ onComplete: expect.any(Function) }),
  );
  expect(window.location.hash).toBe("#project%3Aone");
  scrollTo.mock.calls[0][1].onComplete();
  expect(getByText("Target")).toHaveFocus();
});

it("preserves modified clicks and links with missing fragment targets", async () => {
  render(
    <SmoothScroll>
      <a href="#missing">Missing</a>
    </SmoothScroll>,
  );
  const anchor = document.querySelector("a")!;
  const modified = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    ctrlKey: true,
  });
  anchor.dispatchEvent(modified);
  expect(modified.defaultPrevented).toBe(false);
  const missing = new MouseEvent("click", { bubbles: true, cancelable: true });
  anchor.dispatchEvent(missing);
  expect(missing.defaultPrevented).toBe(false);
  await new Promise(resolve => setTimeout(resolve, 0));
});

it("honors the section scroll margin when scrolling beneath a sticky header", () => {
  const scrollTo = jest.fn();
  (Lenis as unknown as jest.Mock).mockImplementationOnce(() => ({
    on: jest.fn(),
    raf: jest.fn(),
    destroy: jest.fn(),
    scrollTo,
  }));
  const { getByText } = render(
    <SmoothScroll>
      <a href="#work">View work</a>
      <section id="work" style={{ scrollMarginTop: "110px" }}>
        Work section
      </section>
    </SmoothScroll>,
  );
  getByText("View work").dispatchEvent(
    new MouseEvent("click", { bubbles: true, cancelable: true }),
  );
  expect(scrollTo).toHaveBeenCalledWith(
    getByText("Work section"),
    expect.objectContaining({ offset: -110 }),
  );
});

it("cancels smooth momentum before handling an immediate ruler scroll", () => {
  const stop = jest.fn();
  const start = jest.fn();
  const scrollTo = jest.fn();
  (Lenis as unknown as jest.Mock).mockImplementationOnce(() => ({
    on: jest.fn(),
    raf: jest.fn(),
    destroy: jest.fn(),
    isStopped: false,
    stop,
    start,
    scrollTo,
  }));
  const { unmount } = render(<SmoothScroll><div>Page</div></SmoothScroll>);
  const event = new CustomEvent("portfolio:immediate-scroll", {
    cancelable: true,
    detail: 1250,
  });
  window.dispatchEvent(event);
  expect(event.defaultPrevented).toBe(true);
  expect(scrollTo).toHaveBeenCalledWith(1250, { immediate: true, force: true });
  expect(stop.mock.invocationCallOrder[0]).toBeLessThan(scrollTo.mock.invocationCallOrder[0]);
  expect(start.mock.invocationCallOrder[0]).toBeGreaterThan(scrollTo.mock.invocationCallOrder[0]);
  const invalid = new CustomEvent("portfolio:immediate-scroll", {
    cancelable: true,
    detail: NaN,
  });
  window.dispatchEvent(invalid);
  expect(invalid.defaultPrevented).toBe(false);
  expect(scrollTo).toHaveBeenCalledTimes(1);
  unmount();
  const afterUnmount = new CustomEvent("portfolio:immediate-scroll", {
    cancelable: true,
    detail: 100,
  });
  window.dispatchEvent(afterUnmount);
  expect(afterUnmount.defaultPrevented).toBe(false);
  expect(scrollTo).toHaveBeenCalledTimes(1);
});


it("reveals initial and history hashes with reduced motion without moving focus", async () => {
  jest.useFakeTimers();
  const original = window.matchMedia;
  window.matchMedia = jest.fn().mockImplementation(query => ({ matches: query === "(prefers-reduced-motion: reduce)" }));
  history.replaceState(null, "", "/#education");
  try {
    const { container } = render(<SmoothScroll><button>Keep focus</button><section id="education"><details data-mobile-anchor="education"><summary>Education</summary>Courses</details></section><section id="contact">Contact</section></SmoothScroll>);
    const button = container.querySelector("button")!;
    button.focus();
    await act(async () => { await jest.runOnlyPendingTimersAsync(); await jest.runOnlyPendingTimersAsync(); await jest.runOnlyPendingTimersAsync(); });
    expect(container.querySelector("details")!.open).toBe(true);
    expect(button).toHaveFocus();
    jest.mocked(window.scrollTo).mockClear();
    history.replaceState(null, "", "/#contact");
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    await act(async () => { await jest.runOnlyPendingTimersAsync(); });
    expect(window.scrollTo).toHaveBeenCalledTimes(1);
    expect(window.scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: "instant" }));
    expect(button).toHaveFocus();
  } finally { window.matchMedia = original; jest.useRealTimers(); }
});


it("corrects a case-study return hash when the persistent layout changes routes", async () => {
  jest.useFakeTimers();
  const scrollTo = jest.fn();
  (Lenis as unknown as jest.Mock).mockImplementationOnce(() => ({ on: jest.fn(), raf: jest.fn(), destroy: jest.fn(), scrollTo }));
  jest.mocked(usePathname).mockReturnValue("/projects/fibo");
  history.replaceState(null, "", "/projects/fibo");
  try {
    const { rerender, getByText } = render(<SmoothScroll><p>Case study</p></SmoothScroll>);
    await act(async () => { await jest.runOnlyPendingTimersAsync(); });
    history.replaceState(null, "", "/#projects");
    jest.mocked(usePathname).mockReturnValue("/");
    rerender(<SmoothScroll><section id="projects" style={{ scrollMarginTop: "113px" }}>Work section</section></SmoothScroll>);
    await act(async () => { await jest.runOnlyPendingTimersAsync(); });
    expect(scrollTo).toHaveBeenCalledWith(getByText("Work section"), expect.objectContaining({ offset: -113, immediate: true }));
  } finally { jest.useRealTimers(); }
});

it.each([
  '<a href="#work" download>Download</a>',
  '<a href="#work" target="_blank">Other tab</a>',
  '<a href="https://example.com/#work">External</a>',
  '<a href="#%ZZ">Malformed</a>',
])("preserves excluded native anchor actions: %s", markup => {
  const { container } = render(<SmoothScroll><section id="work">Work</section><div dangerouslySetInnerHTML={{ __html: markup }} /></SmoothScroll>);
  let intercepted = true;
  const protectTestNavigation = (event: Event) => { intercepted = event.defaultPrevented; event.preventDefault(); };
  document.addEventListener("click", protectTestNavigation, { once: true });
  container.querySelector("a")!.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  expect(intercepted).toBe(false);
});
