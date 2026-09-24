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
