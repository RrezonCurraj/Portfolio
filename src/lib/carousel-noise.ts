import {
  BufferAttribute, BufferGeometry, Camera, FloatType, NearestFilter, NoBlending, NoColorSpace,
  Points, RGBAFormat, Scene, ShaderMaterial, Vector2, WebGLRenderTarget, type WebGLRenderer,
} from "three";
import { carouselFieldGLSL } from "@/lib/carousel-shaders";

const WIDTH = 160;

export function createCarouselParticleField(renderer: WebGLRenderer, uvAttribute: BufferAttribute, mix: number): Float32Array | null {
  const count = uvAttribute.count;
  if (!count || uvAttribute.itemSize !== 2 || !Number.isFinite(mix) || !renderer.extensions.has("EXT_color_buffer_float")) return null;
  const height = Math.ceil(count / WIDTH);
  const target = new WebGLRenderTarget(WIDTH, height, {
    type: FloatType, format: RGBAFormat, internalFormat: "RGBA32F",
    minFilter: NearestFilter, magFilter: NearestFilter, generateMipmaps: false, colorSpace: NoColorSpace,
    depthBuffer: false, stencilBuffer: false,
  });
  const geometry = new BufferGeometry();
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = i % WIDTH;
    positions[i * 3 + 1] = Math.floor(i / WIDTH);
  }
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  const uvs = new BufferAttribute(uvAttribute.array, uvAttribute.itemSize, uvAttribute.normalized);
  uvs.gpuType = uvAttribute.gpuType;
  geometry.setAttribute("aUv", uvs);
  const material = new ShaderMaterial({
    depthTest: false, depthWrite: false, blending: NoBlending, toneMapped: false, precision: "highp",
    uniforms: { uThMix: { value: mix }, uResolution: { value: new Vector2(WIDTH, height) } },
    vertexShader: carouselFieldGLSL + `
attribute vec2 aUv;
uniform float uThMix;
uniform vec2 uResolution;
varying highp vec4 vField;
void main() {
  vField = vec4(thField(aUv, -1.0, uThMix), thField(aUv, 1.0, uThMix), 0.0, 1.0);
  gl_Position = vec4((position.xy + 0.5) / uResolution * 2.0 - 1.0, 0.0, 1.0);
  gl_PointSize = 1.0;
}`,
    fragmentShader: "varying highp vec4 vField; void main() { gl_FragColor = vField; }",
  });
  const scene = new Scene();
  const particles = new Points(geometry, material);
  particles.frustumCulled = false;
  scene.add(particles);
  const camera = new Camera();
  const previousTarget = renderer.getRenderTarget();
  const previousFace = renderer.getActiveCubeFace();
  const previousMip = renderer.getActiveMipmapLevel();
  const previousAutoClear = renderer.autoClear;
  const previousXR = renderer.xr.enabled;
  try {
    renderer.autoClear = false;
    renderer.xr.enabled = false;
    renderer.setRenderTarget(target);
    const gl = renderer.getContext();
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) return null;
    renderer.render(scene, camera);
    const pixels = new Float32Array(WIDTH * height * 4).fill(NaN);
    renderer.readRenderTargetPixels(target, 0, 0, WIDTH, height, pixels);
    const field = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      const negative = pixels[i * 4];
      const positive = pixels[i * 4 + 1];
      if (!Number.isFinite(negative) || !Number.isFinite(positive) || pixels[i * 4 + 3] !== 1) return null;
      field[i * 2] = negative;
      field[i * 2 + 1] = positive;
    }
    return field;
  } catch {
    return null;
  } finally {
    renderer.autoClear = previousAutoClear;
    renderer.xr.enabled = previousXR;
    renderer.setRenderTarget(previousTarget, previousFace, previousMip);
    geometry.dispose();
    material.dispose();
    target.dispose();
  }
}
