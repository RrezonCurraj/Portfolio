import { BufferGeometry, Material, Scene, Texture, WebGLRenderer, type Mesh } from "three";
import { portfolioData } from "@/data/portfolio";
import { createProjectCarousel } from "@/lib/project-carousel";
import { createCarouselParticleField } from "@/lib/carousel-noise";

jest.mock("./carousel-noise", () => ({ createCarouselParticleField: jest.fn(() => null) }));

jest.mock("three", () => {
  const actual = jest.requireActual<typeof import("three")>("three");
  return {
    ...actual,
    WebGLRenderer: jest.fn().mockImplementation(() => {
      let ratio = 1;
      return {
        domElement: document.createElement("canvas"),
        capabilities: { getMaxAnisotropy: () => 8 },
        setPixelRatio: jest.fn((value: number) => { ratio = value; }),
        getPixelRatio: () => ratio,
        setClearColor: jest.fn(),
        setSize: jest.fn(),
        render: jest.fn(),
        dispose: jest.fn(),
        forceContextLoss: jest.fn(),
      };
    }),
  };
});

type Renderer = {
  domElement: HTMLCanvasElement;
  render: jest.Mock<void, [Scene]>;
  dispose: jest.Mock;
  forceContextLoss: jest.Mock;
};

async function createFixture() {
  const originals = {
    image: window.Image,
    resize: window.ResizeObserver,
    intersection: window.IntersectionObserver,
    raf: window.requestAnimationFrame,
    cancel: window.cancelAnimationFrame,
    hidden: Object.getOwnPropertyDescriptor(document, "hidden"),
  };
  let hidden = false;
  let frameId = 0;
  let time = performance.now();
  const frames = new Map<number, FrameRequestCallback>();
  window.requestAnimationFrame = jest.fn(callback => {
    const id = ++frameId;
    frames.set(id, callback);
    return id;
  });
  window.cancelAnimationFrame = jest.fn(id => { frames.delete(id); });
  Object.defineProperty(document, "hidden", { configurable: true, get: () => hidden });
  window.Image = class {
    width = 1200;
    height = 1600;
    onload: (() => void) | null = null;
    set src(_value: string) { queueMicrotask(() => this.onload?.()); }
  } as unknown as typeof Image;
  const canvas = jest.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation((() => ({
    fillStyle: "",
    fillRect() {},
    drawImage() {},
    getImageData: () => ({ data: new Uint8ClampedArray(32 * 32 * 4) }),
  })) as unknown as typeof HTMLCanvasElement.prototype.getContext);
  const resizeDisconnect = jest.fn();
  const intersectionDisconnect = jest.fn();
  let intersection: IntersectionObserverCallback | undefined;
  window.ResizeObserver = class {
    observe() {}
    disconnect = resizeDisconnect;
  } as unknown as typeof ResizeObserver;
  window.IntersectionObserver = class {
    constructor(callback: IntersectionObserverCallback) { intersection = callback; }
    observe() {}
    disconnect = intersectionDisconnect;
  } as unknown as typeof IntersectionObserver;
  const host = document.createElement("div");
  Object.defineProperties(host, { clientWidth: { value: 346 }, clientHeight: { value: 320 } });
  document.body.append(host);
  jest.mocked(WebGLRenderer).mockClear();
  const engine = (await createProjectCarousel(host, portfolioData.projects.slice(0, 3), 0, jest.fn(), jest.fn(), new AbortController().signal))!;
  const renderer = jest.mocked(WebGLRenderer).mock.results[0].value as Renderer;
  const scene = renderer.render.mock.calls[0][0];
  renderer.render.mockClear();
  let disposed = false;
  const dispose = () => { if (!disposed) { engine.dispose(); disposed = true; } };
  return {
    engine, renderer, scene, host, frames, resizeDisconnect, intersectionDisconnect,
    cancel: window.cancelAnimationFrame as jest.Mock,
    flushFrame() {
      time += 16;
      const pending = [...frames.values()];
      frames.clear();
      pending.forEach(callback => callback(time));
    },
    setHidden(value: boolean) { hidden = value; document.dispatchEvent(new Event("visibilitychange")); },
    setVisible(value: boolean) {
      intersection!([{ isIntersecting: value, target: host }] as unknown as IntersectionObserverEntry[], {} as IntersectionObserver);
    },
    dispose,
    cleanup() {
      dispose(); host.remove(); canvas.mockRestore();
      window.Image = originals.image;
      window.ResizeObserver = originals.resize;
      window.IntersectionObserver = originals.intersection;
      window.requestAnimationFrame = originals.raf;
      window.cancelAnimationFrame = originals.cancel;
      if (originals.hidden) Object.defineProperty(document, "hidden", originals.hidden);
      else Reflect.deleteProperty(document, "hidden");
    },
  };
}

it("submits a scroll seek in the same callback with the requested card centered", async () => {
  const fixture = await createFixture();
  try {
    fixture.engine.seek(1);
    expect(fixture.renderer.render).toHaveBeenCalledTimes(1);
    const centered = fixture.scene.children[1] as Mesh;
    expect(centered.visible).toBe(true);
    expect(centered.position.x).toBe(0);
    expect(centered.position.z).toBeCloseTo(0);
    expect(fixture.frames.size).toBe(0);
  } finally { fixture.cleanup(); }
});

it("does not submit another frame when the scroll position is unchanged", async () => {
  const fixture = await createFixture();
  try {
    fixture.engine.seek(1);
    fixture.flushFrame();
    fixture.renderer.render.mockClear();
    fixture.engine.seek(1);
    fixture.flushFrame();
    expect(fixture.renderer.render.mock.calls.length).toBe(0);
    expect(fixture.frames.size).toBe(0);
  } finally { fixture.cleanup(); }
});

it("cancels a pending eased frame when an exact scroll seek takes over", async () => {
  const fixture = await createFixture();
  try {
    fixture.engine.show(2);
    expect(fixture.frames.size).toBe(1);
    const pending = [...fixture.frames.keys()][0];
    fixture.engine.seek(1);
    expect(fixture.cancel).toHaveBeenCalledWith(pending);
    expect(fixture.frames.size).toBe(0);
    expect(fixture.renderer.render).toHaveBeenCalledTimes(1);
    fixture.flushFrame();
    expect(fixture.renderer.render).toHaveBeenCalledTimes(1);
    expect(fixture.scene.children[1].position.x).toBe(0);
  } finally { fixture.cleanup(); }
});

it("skips a fully dissolved card surface while keeping its particle cloud visible", async () => {
  const fixture = await createFixture();
  try {
    fixture.engine.seek(0.5);
    fixture.flushFrame();
    const card = fixture.scene.children[2] as Mesh;
    expect(card.visible).toBe(true);
    expect((card.material as Material).visible).toBe(false);
    expect(card.children[0].visible).toBe(true);
    fixture.engine.seek(1);
    fixture.flushFrame();
    expect((card.material as Material).visible).toBe(true);
  } finally { fixture.cleanup(); }
});

it("submits only the currently visible particle interval and keeps the original particle data", async () => {
  jest.mocked(createCarouselParticleField).mockImplementationOnce((_renderer, uvs) => {
    const field = new Float32Array(uvs.count * 2);
    for (let i = 0; i < uvs.count; i++) {
      field[i * 2] = (i % 4) * 0.25 + 0.125;
      field[i * 2 + 1] = 1 - field[i * 2];
    }
    return field;
  });
  const fixture = await createFixture();
  try {
    fixture.engine.seek(1);
    for (const [index, card] of fixture.scene.children.entries()) {
      const dust = card.children[0] as import("three").Points;
      if (index === 1) { expect(dust.visible).toBe(false); continue; }
      expect(dust.visible).toBe(true);
      const geometry = dust.geometry;
      expect(geometry.getAttribute("position").count).toBe(32000);
      expect(geometry.getAttribute("aRnd").count).toBe(32000);
      expect(geometry.drawRange.count).toBe(16000);
      const order = geometry.getIndex()!;
      const fields = geometry.getAttribute("aField");
      const side = index < 1 ? 0 : 1;
      const active = Array.from(order.array.slice(geometry.drawRange.start, geometry.drawRange.start + geometry.drawRange.count));
      expect(active).toHaveLength(16000);
      expect(active.every(i => fields.array[i * 2 + side] === 0.375 || fields.array[i * 2 + side] === 0.625)).toBe(true);
      expect(active.every((value, i) => i === 0 || value > active[i - 1])).toBe(true);
    }
  } finally { fixture.cleanup(); }
});

it.each(["hidden", "offscreen"] as const)("defers %s scroll seeks and resumes once with the latest position", async mode => {
  const fixture = await createFixture();
  try {
    if (mode === "hidden") fixture.setHidden(true);
    else fixture.setVisible(false);
    fixture.engine.seek(1);
    fixture.engine.seek(2);
    fixture.flushFrame();
    expect(fixture.renderer.render.mock.calls.length).toBe(0);
    expect(fixture.frames.size).toBe(0);
    if (mode === "hidden") fixture.setHidden(false);
    else fixture.setVisible(true);
    fixture.flushFrame();
    expect(fixture.renderer.render).toHaveBeenCalledTimes(1);
    expect(fixture.scene.children[2].position.x).toBe(0);
    expect(fixture.scene.children[2].position.z).toBeCloseTo(0);
    expect(fixture.frames.size).toBe(0);
  } finally { fixture.cleanup(); }
});

it("cancels pending work and releases scene resources on disposal", async () => {
  const fixture = await createFixture();
  const geometry = jest.spyOn(BufferGeometry.prototype, "dispose");
  const material = jest.spyOn(Material.prototype, "dispose");
  const texture = jest.spyOn(Texture.prototype, "dispose");
  try {
    fixture.engine.show(1);
    expect(fixture.frames.size).toBe(1);
    fixture.dispose();
    expect(fixture.frames.size).toBe(0);
    expect(geometry).toHaveBeenCalledTimes(2);
    expect(material).toHaveBeenCalledTimes(6);
    expect(texture).toHaveBeenCalledTimes(3);
    expect(fixture.renderer.dispose).toHaveBeenCalledTimes(1);
    expect(fixture.renderer.forceContextLoss).toHaveBeenCalledTimes(1);
    expect(fixture.resizeDisconnect).toHaveBeenCalledTimes(1);
    expect(fixture.intersectionDisconnect).toHaveBeenCalledTimes(1);
    expect(fixture.host.querySelector("canvas")).toBeNull();
    fixture.engine.seek(2);
    fixture.engine.show(1);
    fixture.setHidden(true);
    fixture.setHidden(false);
    fixture.flushFrame();
    expect(fixture.renderer.render.mock.calls.length).toBe(0);
    expect(fixture.frames.size).toBe(0);
  } finally {
    geometry.mockRestore(); material.mockRestore(); texture.mockRestore(); fixture.cleanup();
  }
});
