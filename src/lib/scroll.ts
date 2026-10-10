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
