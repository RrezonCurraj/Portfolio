import {
  BufferAttribute, BufferGeometry, FloatType, Material, NearestFilter, NoColorSpace, Points,
  Scene, ShaderMaterial, WebGLRenderTarget, type WebGLRenderer,
} from "three";
import { createCarouselParticleField } from "./carousel-noise";

function setupRenderer({ supported = true, complete = true, failRender = false, failRead = false, emptyRead = false } = {}) {
  const originalTarget = new WebGLRenderTarget(16, 16);
  let target: WebGLRenderTarget | null = originalTarget;
  let face = 2;
  let mip = 1;
  const baked: { target: WebGLRenderTarget; scene: Scene; autoClear: boolean; xr: boolean }[] = [];
  const context = {
    FRAMEBUFFER: 0x8d40, FRAMEBUFFER_COMPLETE: 0x8cd5,
    checkFramebufferStatus: jest.fn(() => complete ? 0x8cd5 : 0x8cd6),
  };
  const renderer = {
    extensions: { has: jest.fn(() => supported) },
    autoClear: true,
    xr: { enabled: true },
    getContext: () => context,
    getRenderTarget: () => target,
    getActiveCubeFace: () => face,
    getActiveMipmapLevel: () => mip,
    setRenderTarget: jest.fn((next: WebGLRenderTarget | null, nextFace = 0, nextMip = 0) => {
      target = next; face = nextFace; mip = nextMip;
    }),
    render: jest.fn((scene: Scene) => {
      if (failRender) throw new Error("GPU unavailable");
      baked.push({ target: target!, scene, autoClear: renderer.autoClear, xr: renderer.xr.enabled });
    }),
    readRenderTargetPixels: jest.fn((_target: WebGLRenderTarget, _x: number, _y: number, width: number, height: number, pixels: Float32Array) => {
      if (failRead) throw new Error("Readback unavailable");
      if (emptyRead) return;
      for (let i = 0; i < width * height; i++) pixels.set([0.125, 0.875, 0, 1], i * 4);
      pixels.set([0.625, 0.375, 0, 1], (width * height - 1) * 4);
    }),
  };
  return { renderer, originalTarget, baked };
}

function particleUvs() {
  const uvs = new Float32Array(32000 * 2);
  uvs.set([0.003125, 0.0025]);
  uvs.set([0.996875, 0.9975], uvs.length - 2);
  return new BufferAttribute(uvs, 2);
}

it("bakes particle fields using the original float UVs and releases all GPU resources after readback", () => {
  const { renderer, originalTarget, baked } = setupRenderer();
  const targetDispose = jest.spyOn(WebGLRenderTarget.prototype, "dispose");
  const geometryDispose = jest.spyOn(BufferGeometry.prototype, "dispose");
  const materialDispose = jest.spyOn(Material.prototype, "dispose");
  const uv = particleUvs();
  try {
    const field = createCarouselParticleField(renderer as unknown as WebGLRenderer, uv, 0.45);
    expect(field).not.toBeNull();
    expect(field).toHaveLength(64000);
    expect(Array.from(field!.slice(0, 2))).toEqual([0.125, 0.875]);
    expect(Array.from(field!.slice(-2))).toEqual([0.625, 0.375]);
    expect(baked).toHaveLength(1);
    const { target, scene, autoClear, xr } = baked[0];
    expect(target.width).toBe(160);
    expect(target.height).toBe(200);
    expect(target.texture.type).toBe(FloatType);
    expect(target.texture.minFilter).toBe(NearestFilter);
    expect(target.texture.magFilter).toBe(NearestFilter);
    expect(target.texture.generateMipmaps).toBe(false);
    expect(target.texture.colorSpace).toBe(NoColorSpace);
    expect(target.depthBuffer).toBe(false);
    expect(autoClear).toBe(false);
    expect(xr).toBe(false);
    const particles = scene.children[0] as Points;
    expect(particles.isPoints).toBe(true);
    expect(particles.geometry.getAttribute("position").count).toBe(32000);
    const bakedUvs = particles.geometry.getAttribute("aUv");
    expect(bakedUvs).not.toBe(uv);
    expect(bakedUvs.array).toBe(uv.array);
    expect(Array.from(bakedUvs.array.slice(-2))).toEqual([Math.fround(0.996875), Math.fround(0.9975)]);
    expect((particles.material as ShaderMaterial).uniforms.uThMix.value).toBe(0.45);
    expect(renderer.getRenderTarget()).toBe(originalTarget);
    expect(renderer.getActiveCubeFace()).toBe(2);
    expect(renderer.getActiveMipmapLevel()).toBe(1);
    expect(renderer.autoClear).toBe(true);
    expect(renderer.xr.enabled).toBe(true);
    expect(geometryDispose).toHaveBeenCalledTimes(1);
    expect(materialDispose).toHaveBeenCalledTimes(1);
    expect(targetDispose).toHaveBeenCalledTimes(1);
  } finally {
    targetDispose.mockRestore(); geometryDispose.mockRestore(); materialDispose.mockRestore();
    originalTarget.dispose();
  }
});

it("uses the original particle shader when float color buffers are unsupported", () => {
  const { renderer, originalTarget } = setupRenderer({ supported: false });
  try {
    expect(createCarouselParticleField(renderer as unknown as WebGLRenderer, particleUvs(), 0.45)).toBeNull();
    expect(renderer.render).not.toHaveBeenCalled();
    expect(renderer.setRenderTarget).not.toHaveBeenCalled();
    expect(renderer.getRenderTarget()).toBe(originalTarget);
  } finally { originalTarget.dispose(); }
});

it.each([{ complete: false }, { failRender: true }, { failRead: true }, { emptyRead: true }])("cleans up and falls back when field baking fails (%j)", options => {
  const { renderer, originalTarget } = setupRenderer(options);
  const targetDispose = jest.spyOn(WebGLRenderTarget.prototype, "dispose");
  const geometryDispose = jest.spyOn(BufferGeometry.prototype, "dispose");
  const materialDispose = jest.spyOn(Material.prototype, "dispose");
  try {
    expect(createCarouselParticleField(renderer as unknown as WebGLRenderer, particleUvs(), 0.45)).toBeNull();
    expect(renderer.getRenderTarget()).toBe(originalTarget);
    expect(renderer.getActiveCubeFace()).toBe(2);
    expect(renderer.getActiveMipmapLevel()).toBe(1);
    expect(renderer.autoClear).toBe(true);
    expect(renderer.xr.enabled).toBe(true);
    expect(targetDispose).toHaveBeenCalledTimes(1);
    expect(geometryDispose).toHaveBeenCalledTimes(1);
    expect(materialDispose).toHaveBeenCalledTimes(1);
  } finally {
    targetDispose.mockRestore(); geometryDispose.mockRestore(); materialDispose.mockRestore();
    originalTarget.dispose();
  }
});
