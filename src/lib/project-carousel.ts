import {
  BufferAttribute, BufferGeometry, CanvasTexture, Color, DoubleSide, LinearMipmapLinearFilter,
  Mesh, PerspectiveCamera, PlaneGeometry, Points, Scene, ShaderMaterial, Vector2, WebGLRenderer,
} from "three";
import type { Project } from "@/data/portfolio";
import { cardVertex, cardFragment, particleVertex, particleFragment } from "@/lib/carousel-shaders";

export interface ProjectCarouselEngine {
  seek: (position: number) => void;
  show: (index: number) => void;
  drag: (fraction: number) => void;
  snap: () => void;
  dispose: () => void;
}

const CARD_WIDTH = 0.8;
const CARD_HEIGHT = 1;
const wrap = (index: number, count: number) => ((index % count) + count) % count;

function particleColor(image: HTMLCanvasElement) {
  const sample = document.createElement("canvas");
  sample.width = sample.height = 32;
  const context = sample.getContext("2d");
  if (!context) return new Color(0x53682d);
  context.drawImage(image, 0, 0, 32, 32);
  const pixels = context.getImageData(0, 0, 32, 32).data;
  let red = 0, green = 0, blue = 0, total = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    const max = Math.max(pixels[i], pixels[i + 1], pixels[i + 2]);
    const min = Math.min(pixels[i], pixels[i + 1], pixels[i + 2]);
    const weight = (max - min) / 255;
    if (weight < 0.15) continue;
    red += pixels[i] * weight;
    green += pixels[i + 1] * weight;
    blue += pixels[i + 2] * weight;
    total += weight;
  }
  return total ? new Color().setRGB(red / total / 255, green / total / 255, blue / total / 255) : new Color(0x53682d);
}

function makeDust() {
  const columns = 160;
  const rows = 200;
  const positions = new Float32Array(columns * rows * 3);
  const uvs = new Float32Array(columns * rows * 2);
  const random = new Float32Array(columns * rows * 4);
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const i = row * columns + column;
      const u = (column + 0.5) / columns;
      const v = (row + 0.5) / rows;
      positions[i * 3] = (u - 0.5) * CARD_WIDTH;
      positions[i * 3 + 1] = (v - 0.5) * CARD_HEIGHT;
      positions[i * 3 + 2] = 0;
      uvs[i * 2] = u;
      uvs[i * 2 + 1] = v;
      for (let channel = 0; channel < 4; channel++) random[i * 4 + channel] = Math.random();
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("aUv", new BufferAttribute(uvs, 2));
  geometry.setAttribute("aRnd", new BufferAttribute(random, 4));
  return geometry;
}

function loadImage(project: Project): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 1280;
      const context = canvas.getContext("2d");
      if (!context) { reject(new Error("Canvas unavailable")); return; }
      const brand = project.imageStyle === "brand";
      context.fillStyle = brand ? "#e3eadd" : "#eeede5";
      context.fillRect(0, 0, canvas.width, canvas.height);
      const scale = brand
        ? Math.min(canvas.width * 0.7 / image.width, canvas.height * 0.7 / image.height)
        : Math.max(canvas.width / image.width, canvas.height / image.height);
      const width = image.width * scale;
      const height = image.height * scale;
      context.drawImage(image, (canvas.width - width) / 2, brand ? (canvas.height - height) / 2 : 0, width, height);
      resolve(canvas);
    };
    image.onerror = reject;
    image.src = project.image;
  });
}

export async function createProjectCarousel(
  host: HTMLDivElement, projects: Project[], initialIndex: number,
  onIndex: (index: number) => void, onFailure: () => void, signal: AbortSignal,
): Promise<ProjectCarouselEngine | null> {
  // Finish asynchronous asset loading before allocating GPU resources.
  const images = await Promise.all(projects.map(loadImage));
  if (signal.aborted) return null;
  const renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);
  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, 0.05, 100);
  const geometry = new PlaneGeometry(CARD_WIDTH, CARD_HEIGHT);
  const dustGeometry = makeDust();
  const viewHeight = { value: 1 };
  const size = { value: new Vector2(CARD_WIDTH, CARD_HEIGHT) };
  const cards = images.map(image => {
    const texture = new CanvasTexture(image);
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    texture.minFilter = LinearMipmapLinearFilter;
    const shared = {
      map: { value: texture }, uSize: size, uRadius: { value: 0.0272 },
      uThanos: { value: 0 }, uThMix: { value: 0.45 }, uFade: { value: 1 },
    };
    const material = new ShaderMaterial({
      uniforms: { ...shared, uThEdge: { value: 0.05 }, uThAsh: { value: 0 }, uSheen: { value: 0 }, uAngle: { value: 0 } },
      vertexShader: cardVertex, fragmentShader: cardFragment, transparent: true, depthWrite: false, side: DoubleSide,
    });
    const dustMaterial = new ShaderMaterial({
      uniforms: { ...shared, uSpan: { value: 0.4 }, uDist: { value: 1.05 }, uSwirl: { value: 0.08 },
        uTint: { value: particleColor(image) },
        uAsh: { value: 0 }, uPt: { value: 1.5 }, uCell: { value: CARD_WIDTH / 160 }, uViewH: viewHeight },
      vertexShader: particleVertex, fragmentShader: particleFragment, transparent: true, depthWrite: false,
    });
    const mesh = new Mesh(geometry, material);
    const dust = new Points(dustGeometry, dustMaterial);
    dust.frustumCulled = false;
    dust.renderOrder = 1;
    mesh.add(dust);
    scene.add(mesh);
    return { mesh, material, dust, dustMaterial, texture };
  });
  let current = initialIndex;
  let target = initialIndex;
  let frame = 0;
  let last = 0;
  let disposed = false;
  let visible = true;
  let depth = 1;
  let spacing = 1;
  let renderWidth = 0;
  let renderHeight = 0;

  function draw() {
    for (let index = 0; index < cards.length; index++) {
      const card = cards[index];
      let offset = wrap(index - current, cards.length);
      if (offset >= cards.length / 2) offset -= cards.length;
      const distance = Math.abs(offset);
      card.mesh.visible = distance < 1.75;
      if (!card.mesh.visible) continue;
      card.mesh.position.set(Math.sign(offset) * spacing * (distance <= 1 ? distance : 1 + (distance - 1) * 1.6),
        0, -depth * (distance <= 1 ? distance * distance : 1 + 2 * (distance - 1)));
      const fade = 1 - Math.min(1, Math.max(0, (distance - 1.15) / 0.6));
      const amount = Math.sign(offset) * 0.72 * Math.pow(distance, 1.3);
      card.material.uniforms.uThanos.value = amount;
      card.material.uniforms.uFade.value = fade;
      card.dust.visible = distance > 0.001;
    }
    renderer.render(scene, camera);
  }
  function tick(now: number) {
    frame = 0;
    if (disposed || !visible || document.hidden) return;
    const delta = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
    last = now;
    current += (target - current) * (1 - Math.exp(-delta * 9));
    if (Math.abs(target - current) < 0.0001) current = target;
    draw();
    if (current !== target) frame = requestAnimationFrame(tick);
  }
  function kick() {
    if (frame || disposed || !visible || document.hidden) return;
    last = performance.now();
    frame = requestAnimationFrame(tick);
  }
  function resize() {
    const width = Math.max(1, host.clientWidth);
    const height = Math.max(1, host.clientHeight);
    if (width === renderWidth && height === renderHeight) return;
    renderWidth = width;
    renderHeight = height;
    const aspect = width / height;
    const tangent = Math.tan(32 * Math.PI / 360);
    const widthFraction = width < 520 ? 0.58 : 0.56;
    const distance = Math.max(CARD_HEIGHT / (2 * tangent * 0.82), CARD_WIDTH / (2 * tangent * aspect * widthFraction));
    depth = distance * 0.515;
    const gap = width < 520 ? 0.08 : 0.17;
    const centerHalf = CARD_WIDTH / (2 * distance * tangent * aspect);
    const sideHalf = CARD_WIDTH / (2 * (distance + depth) * tangent * aspect);
    spacing = (centerHalf + gap + sideHalf) * (distance + depth) * tangent * aspect;
    camera.aspect = aspect;
    camera.position.z = distance;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    viewHeight.value = height * renderer.getPixelRatio();
    // Keep the DOM preview and its link aligned with the projected card.
    host.style.setProperty("--carousel-card-width", `${2 * centerHalf * 100}%`);
    host.style.setProperty("--carousel-card-height", `${CARD_HEIGHT / (2 * distance * tangent) * 100}%`);
    draw();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  const intersection = new IntersectionObserver(entries => {
    visible = entries[entries.length - 1].isIntersecting;
    if (visible) kick();
    else { cancelAnimationFrame(frame); frame = 0; }
  });
  intersection.observe(host);
  const onVisibility = () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
    else kick();
  };
  const onContextLost = (event: Event) => { event.preventDefault(); onFailure(); };
  document.addEventListener("visibilitychange", onVisibility);
  renderer.domElement.addEventListener("webglcontextlost", onContextLost);
  resize();
  return {
    seek(position) {
      current = target = Math.max(0, Math.min(cards.length - 1, position));
      kick();
    },
    show(index) {
      let offset = wrap(index - Math.round(target), cards.length);
      if (offset > cards.length / 2) offset -= cards.length;
      target = Math.round(target) + offset;
      kick();
    },
    drag(fraction) { target -= fraction; kick(); },
    snap() {
      target = Math.round(target);
      onIndex(wrap(target, cards.length));
      kick();
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      for (const card of cards) { card.texture.dispose(); card.material.dispose(); card.dustMaterial.dispose(); }
      geometry.dispose();
      dustGeometry.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
