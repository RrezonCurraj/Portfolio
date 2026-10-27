import { act, fireEvent, render, screen } from "@testing-library/react";
import { ContributionSkyline } from "@/components/ui/contribution-skyline";

it("reuses month measurements and painter order when only legend colors change", () => {
  const frames = new Map<number, FrameRequestCallback>();
  let handle = 0;
  const raf = jest.spyOn(window, "requestAnimationFrame").mockImplementation(callback => {
    frames.set(++handle, callback);
    return handle;
  });
  const cancel = jest.spyOn(window, "cancelAnimationFrame").mockImplementation(id => { frames.delete(id); });
  const media = jest.spyOn(window, "matchMedia").mockImplementation(query => ({
    matches: query === "(prefers-reduced-motion: reduce)", media: query, onchange: null,
    addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => true,
  }));
  const previousResize = Object.getOwnPropertyDescriptor(globalThis, "ResizeObserver");
  const previousFonts = Object.getOwnPropertyDescriptor(document, "fonts");
  const fonts = new EventTarget();
  Object.defineProperty(document, "fonts", { configurable: true, value: fonts });
  Object.defineProperty(globalThis, "ResizeObserver", { configurable: true, writable: true, value: class {
    observe() {} unobserve() {} disconnect() {}
  } });
  const width = jest.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(390);
  const records = new WeakMap<HTMLCanvasElement, { geometry: unknown[][]; measure: jest.Mock; context: CanvasRenderingContext2D }>();
  const mockGetContext = function (this: HTMLCanvasElement) {
    let record = records.get(this);
    if (!record) {
      const geometry: unknown[][] = [];
      const measure = jest.fn((text: string) => ({ width: text.length * 6 }));
      const context = {
        clearRect: () => { geometry.length = 0; },
        measureText: measure,
        getImageData: () => ({ data: new Uint8ClampedArray([0, 0, 0, 255]) }),
        fillRect: () => {}, fill: () => {}, stroke: () => {}, setTransform: () => {},
        ...Object.fromEntries(["beginPath", "moveTo", "lineTo", "closePath", "arcTo", "fillText"].map(method =>
          [method, (...args: unknown[]) => { geometry.push([method, ...args]); }],
        )),
      } as unknown as CanvasRenderingContext2D;
      record = { geometry, measure, context };
      records.set(this, record);
    }
    return record.context;
  };
  const getContext = jest.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
    mockGetContext as unknown as typeof HTMLCanvasElement.prototype.getContext,
  );
  const flushFrames = () => act(() => {
    for (let i = 0; frames.size && i < 10; i++) {
      const pending = [...frames.values()];
      frames.clear();
      pending.forEach(callback => callback(performance.now() + (i + 1) * 16));
    }
  });
  let unmount: (() => void) | undefined;
  try {
    ({ unmount } = render(<ContributionSkyline data={[{ date: "2026-10-27", count: 12 }]} />));
    flushFrames();
    const canvas = screen.getByRole("img") as HTMLCanvasElement;
    const record = records.get(canvas)!;
    const geometry = record.geometry.map(command => [...command]);
    expect(geometry.some(command => command[0] === "fillText")).toBe(true);
    record.measure.mockClear();
    const sort = jest.spyOn(Array.prototype, "sort");
    try {
      fireEvent.mouseEnter(screen.getByRole("button", { name: "Highlight light days" }));
      flushFrames();
      expect(record.geometry).toEqual(geometry);
      expect(record.measure).not.toHaveBeenCalled();
      expect(sort.mock.instances.filter(array => array.length >= 365)).toHaveLength(0);
      fonts.dispatchEvent(new Event("loadingdone"));
      expect(record.measure).toHaveBeenCalled();
      record.measure.mockClear();
      unmount!();
      unmount = undefined;
      fonts.dispatchEvent(new Event("loadingdone"));
      expect(record.measure).not.toHaveBeenCalled();
    } finally { sort.mockRestore(); }
  } finally {
    unmount?.();
    getContext.mockRestore();
    width.mockRestore();
    media.mockRestore();
    raf.mockRestore();
    cancel.mockRestore();
    if (previousResize) Object.defineProperty(globalThis, "ResizeObserver", previousResize);
    else Reflect.deleteProperty(globalThis, "ResizeObserver");
    if (previousFonts) Object.defineProperty(document, "fonts", previousFonts);
    else Reflect.deleteProperty(document, "fonts");
  }
});
