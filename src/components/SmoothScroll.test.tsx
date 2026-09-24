import { render } from "@testing-library/react";
import gsap from "gsap";
import { SmoothScroll } from "./SmoothScroll";
import Lenis from "lenis";

jest.mock("lenis", () => jest.fn().mockImplementation(() => ({
  on: jest.fn(),
  raf: jest.fn(),
  destroy: jest.fn(),
})));

jest.mock("gsap", () => ({
  __esModule: true,
  default: {
    registerPlugin: jest.fn(),
    ticker: { add: jest.fn(), remove: jest.fn() },
  },
}));

jest.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: { update: jest.fn() } }));

it("removes the exact animation callback it registered", () => {
  const { unmount } = render(<SmoothScroll><div>Page</div></SmoothScroll>);
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
    render(<SmoothScroll><div>Page</div></SmoothScroll>);
    expect(Lenis).not.toHaveBeenCalled();
    expect(gsap.ticker.add).not.toHaveBeenCalled();
  } finally {
    window.matchMedia = originalMatchMedia;
  }
});

it('scrolls to encoded fragment IDs without interpreting them as CSS selectors', () => {
  const scrollTo = jest.fn();
  (Lenis as unknown as jest.Mock).mockImplementationOnce(() => ({ on: jest.fn(), raf: jest.fn(), destroy: jest.fn(), scrollTo }));
  const { getByText } = render(<SmoothScroll><a href="#project%3Aone">Jump</a><section id="project:one">Target</section></SmoothScroll>);
  getByText('Jump').dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  expect(scrollTo).toHaveBeenCalledWith(getByText('Target'), expect.objectContaining({ onComplete: expect.any(Function) }));
  expect(window.location.hash).toBe('#project%3Aone');
  scrollTo.mock.calls[0][1].onComplete();
  expect(getByText('Target')).toHaveFocus();
});

it('preserves modified clicks and links with missing fragment targets', () => {
  render(<SmoothScroll><a href="#missing">Missing</a></SmoothScroll>);
  const anchor = document.querySelector('a')!;
  const modified = new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true });
  anchor.dispatchEvent(modified);
  expect(modified.defaultPrevented).toBe(false);
  const missing = new MouseEvent('click', { bubbles: true, cancelable: true });
  anchor.dispatchEvent(missing);
  expect(missing.defaultPrevented).toBe(false);
});
