import { fireEvent, render, screen } from "@testing-library/react";
import { Navbar } from "@/components/Navbar";
import { ModeProvider } from "@/components/Providers";
import { ScrollRuler } from "@/components/ScrollRuler";

beforeEach(() => {
  Object.defineProperty(window, "innerHeight", { configurable: true, value: 1000 });
  Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
  Object.defineProperty(document.documentElement, "scrollHeight", {
    configurable: true,
    value: 3000,
  });
  Object.defineProperty(document.body, "scrollHeight", {
    configurable: true,
    value: 3000,
  });
  jest.mocked(window.scrollTo).mockClear();
});

function ruler() {
  render(
    <ModeProvider>
      <Navbar />
    </ModeProvider>,
  );
  const element = screen.getByLabelText("Page scroll progress");
  element.getBoundingClientRect = () =>
    ({ top: 20, height: 500 }) as DOMRect;
  element.setPointerCapture = jest.fn();
  element.hasPointerCapture = jest.fn(() => true);
  element.releasePointerCapture = jest.fn();
  return element;
}

function pointer(
  element: Element,
  type: string,
  clientY: number,
  options: { button?: number; isPrimary?: boolean; pointerId?: number } = {},
) {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    clientY,
    button: options.button ?? 0,
  });
  Object.defineProperties(event, {
    pointerId: { value: options.pointerId ?? 7 },
    isPrimary: { value: options.isPrimary ?? true },
  });
  fireEvent(element, event);
}

it("maps a captured ruler drag to document scroll and clamps outside the track", () => {
  const element = ruler();
  pointer(element, "pointerdown", 270);
  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 1000, behavior: "instant" });
  expect(element).toHaveAttribute("role", "slider");
  expect(element).toHaveAttribute("aria-orientation", "vertical");
  expect(element).toHaveAttribute("data-dragging", "true");
  expect(element.setPointerCapture).toHaveBeenCalledWith(7);
  pointer(element, "pointermove", 900);
  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 2000, behavior: "instant" });
  pointer(element, "pointermove", -20);
  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: "instant" });
  pointer(element, "pointerup", -20);
  expect(element).not.toHaveAttribute("data-dragging");
  expect(element.releasePointerCapture).toHaveBeenCalledWith(7);
  jest.mocked(window.scrollTo).mockClear();
  pointer(element, "pointermove", 270);
  expect(window.scrollTo).not.toHaveBeenCalled();
});

it("ignores secondary buttons and non-primary pointers", () => {
  const element = ruler();
  pointer(element, "pointerdown", 270, { button: 2 });
  pointer(element, "pointerdown", 270, { isPrimary: false });
  expect(window.scrollTo).not.toHaveBeenCalled();
  expect(element.setPointerCapture).not.toHaveBeenCalled();
});

it("ends dragging on cancel or lost capture without moving on later events", () => {
  const element = ruler();
  pointer(element, "pointerdown", 270);
  pointer(element, "pointercancel", 270);
  expect(element).not.toHaveAttribute("data-dragging");
  jest.mocked(window.scrollTo).mockClear();
  pointer(element, "pointermove", 520);
  expect(window.scrollTo).not.toHaveBeenCalled();
  pointer(element, "pointerdown", 270);
  pointer(element, "lostpointercapture", 270);
  expect(element).not.toHaveAttribute("data-dragging");
  jest.mocked(window.scrollTo).mockClear();
  pointer(element, "pointermove", 520);
  expect(window.scrollTo).not.toHaveBeenCalled();
});

it("distinguishes pointer focus after release from keyboard and blur focus", () => {
  const element = ruler();
  pointer(element, "pointerdown", 270);
  expect(element).toHaveFocus();
  expect(element).toHaveAttribute("data-pointer-focus", "true");
  pointer(element, "pointerup", 900);
  expect(element).toHaveFocus();
  expect(element).not.toHaveAttribute("data-dragging");
  expect(element).toHaveAttribute("data-pointer-focus", "true");
  fireEvent.keyDown(element, { key: "ArrowDown" });
  expect(element).not.toHaveAttribute("data-pointer-focus");
  pointer(element, "pointerdown", 270);
  expect(element).toHaveAttribute("data-pointer-focus", "true");
  fireEvent.blur(element);
  expect(element).not.toHaveAttribute("data-pointer-focus");
});

it("supports arrow, page, Home and End keys using current scroll position", () => {
  const element = ruler();
  expect(element).toHaveAttribute("tabindex", "0");
  Object.defineProperty(window, "scrollY", { configurable: true, value: 1000 });
  fireEvent.keyDown(element, { key: "ArrowUp" });
  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 960, behavior: "instant" });
  fireEvent.keyDown(element, { key: "ArrowDown" });
  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 1040, behavior: "instant" });
  fireEvent.keyDown(element, { key: "PageDown" });
  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 1900, behavior: "instant" });
  fireEvent.keyDown(element, { key: "PageUp" });
  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 100, behavior: "instant" });
  fireEvent.keyDown(element, { key: "Home" });
  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: "instant" });
  fireEvent.keyDown(element, { key: "End" });
  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 2000, behavior: "instant" });
  jest.mocked(window.scrollTo).mockClear();
  fireEvent.keyDown(element, { key: "Tab" });
  expect(window.scrollTo).not.toHaveBeenCalled();
});

it("stays at zero when content fits in the viewport", () => {
  Object.defineProperty(document.documentElement, "scrollHeight", { configurable: true, value: 1000 });
  Object.defineProperty(document.body, "scrollHeight", { configurable: true, value: 1000 });
  const element = ruler();
  pointer(element, "pointerdown", 520);
  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: "instant" });
  fireEvent.keyDown(element, { key: "End" });
  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: "instant" });
});

it("preserves the thumb grab offset and maps its available travel without an initial jump", () => {
  const element = ruler();
  const handle = element.querySelector<HTMLElement>(".ruler-handle");
  expect(handle).toBeInTheDocument();
  handle!.getBoundingClientRect = () => ({ top: 226, height: 88 }) as DOMRect;
  Object.defineProperty(window, "scrollY", { configurable: true, value: 1000 });
  pointer(handle!, "pointerdown", 294);
  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 1000, behavior: "instant" });
  expect(element.setPointerCapture).toHaveBeenCalledWith(7);
  pointer(element, "pointermove", 397);
  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 1500, behavior: "instant" });
  pointer(element, "pointermove", 1000);
  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 2000, behavior: "instant" });
  pointer(element, "pointermove", -20);
  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: "instant" });
  pointer(element, "pointerup", -20);
  jest.mocked(window.scrollTo).mockClear();
  pointer(element, "pointermove", 397);
  expect(window.scrollTo).not.toHaveBeenCalled();
});

it("shows nearby whole percentages in the lens without exceeding document bounds", () => {
  const { container, rerender } = render(<ScrollRuler progress={0} label="Page scroll progress" />);
  const lensValues = () => Array.from(container.querySelectorAll(".ruler-lens-tick"), (tick) => Number(tick.textContent));
  expect(lensValues()).toEqual([0, 1, 2, 3, 4]);
  rerender(<ScrollRuler progress={62.6} label="Page scroll progress" />);
  expect(lensValues()).toEqual([61, 62, 63, 64, 65]);
  rerender(<ScrollRuler progress={100} label="Page scroll progress" />);
  expect(lensValues()).toEqual([96, 97, 98, 99, 100]);
  expect(container.querySelector(".ruler-handle")).toHaveStyle({ top: "100%", transform: "translateY(-100%)" });
});
