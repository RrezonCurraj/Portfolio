export const carouselHashGLSL = `
float thHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
`;

export const carouselFieldGLSL = carouselHashGLSL + `
float thNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(thHash(i), thHash(i + vec2(1.0, 0.0)), u.x), mix(thHash(i + vec2(0.0, 1.0)), thHash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float thField(vec2 uv, float side, float mixN) {
  float g = side > 0.0 ? 1.0 - uv.x : uv.x;
  float n = 0.5 * thNoise(uv * vec2(6.0, 7.5)) + 0.3 * thNoise(uv * vec2(13.0, 15.0) + 3.1) + 0.2 * thNoise(uv * vec2(29.0, 33.0) + 7.7);
  return mix(g, n, mixN) * 0.96 + 0.02;
}
const vec3 TH_ASH = vec3(0.22, 0.19, 0.17);
`;

export const cardVertex = `
uniform vec2 uSize;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 p = position;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
}`;

export const cardFragment = carouselFieldGLSL + `
uniform sampler2D map;
uniform float uThanos;
uniform float uThMix;
uniform float uThEdge;
uniform float uThAsh;
uniform vec2 uSize;
uniform vec3 uBg;
uniform float uRadius;
uniform float uSheen;
uniform float uAngle;
uniform float uFade;
varying vec2 vUv;
void main() {
  vec2 p = (vUv - 0.5) * uSize;
  vec2 q = abs(p) - (0.5 * uSize - uRadius);
  float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uRadius;
  float aa = max(fwidth(d), 1e-5);
  float a = 1.0 - smoothstep(-aa, aa, d);
  vec3 c = texture2D(map, vUv).rgb;
  c += (1.0 - smoothstep(0.0, 0.005, -d)) * 0.07;
  float s = sin(uAngle);
  float band = exp(-pow((vUv.x - 0.5 + (vUv.y - 0.5) * 0.4 + s * 0.8) * 2.6, 2.0));
  c += uSheen * abs(s) * band;
  if (abs(uThanos) > 1e-4) {
    float tp = abs(uThanos);
    float tn = thField(vUv, sign(uThanos), uThMix);
    if (tn < tp) a = 0.0;
    float burn = 1.0 - smoothstep(tp, tp + uThEdge, tn);
    c = mix(c, TH_ASH, burn * 0.9 * uThAsh);
  }
  float alpha = a * uFade;
  gl_FragColor = vec4(c, alpha);
}`;

export const particleVertex = carouselFieldGLSL + `
attribute vec2 aUv;
attribute vec4 aRnd;
#ifdef CAROUSEL_PARTICLE_FIELD
attribute vec2 aField;
#endif
uniform sampler2D map;
uniform vec2 uSize;
uniform float uRadius;
uniform float uThanos;
uniform float uThMix;
uniform float uSpan;
uniform float uDist;
uniform float uSwirl;
uniform float uAsh;
uniform float uPt;
uniform float uCell;
uniform vec3 uTint;
uniform float uViewH;
uniform float uFade;
varying vec4 vCol;
void main() {
  float p = abs(uThanos);
  float side = sign(uThanos);
#ifdef CAROUSEL_PARTICLE_FIELD
  float n = side > 0.0 ? aField.y : aField.x;
#else
  float n = thField(aUv, side, uThMix);
#endif
  float e = (p - n) / uSpan;
  vec2 q = (aUv - 0.5) * uSize;
  vec2 qq = abs(q) - (0.5 * uSize - uRadius);
  float d = length(max(qq, 0.0)) + min(max(qq.x, qq.y), 0.0) - uRadius;
  if (p < 1e-4 || e <= 0.0 || e >= 1.0 || d > 0.0) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    gl_PointSize = 0.0;
    vCol = vec4(0.0);
    return;
  }
  vec3 dir = vec3(side * (0.5 + aRnd.x), 0.25 + 0.6 * aRnd.y, (aRnd.z - 0.5) * 0.8);
  vec3 sw = vec3(sin(e * 7.0 + aRnd.w * 6.2832), cos(e * 6.0 + aRnd.x * 6.2832), 0.0) * uSwirl;
  vec3 pos = vec3(q, 0.0) + dir * (e * e) * uDist + sw * e;
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = max(1.0, uCell * uPt * projectionMatrix[1][1] * 0.5 * uViewH / -mv.z * (1.0 - 0.55 * e) * (0.6 + 0.8 * aRnd.w));
  vec3 c = texture2D(map, aUv).rgb;
  float saturation = max(c.r, max(c.g, c.b)) - min(c.r, min(c.g, c.b));
  c = mix(uTint, c, clamp(saturation * 2.0, 0.15, 0.85));
  c = mix(c, TH_ASH, clamp(uAsh * (0.35 + e), 0.0, 1.0));
  vCol = vec4(c, (1.0 - smoothstep(0.4, 1.0, e)) * uFade);
}`;

export const particleFragment = `
varying vec4 vCol;
void main() {
  float r = length(gl_PointCoord - 0.5);
  gl_FragColor = vec4(vCol.rgb, vCol.a * (1.0 - smoothstep(0.3, 0.5, r)));
}`;

