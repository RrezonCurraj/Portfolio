import { writeActiveParticleIndices } from "@/lib/carousel-particles";

it.each([
  { side: 0 as const, expected: [0, 2, 3] },
  { side: 1 as const, expected: [0, 2, 3] },
])("keeps original particle order for interleaved side $side", ({ side, expected }) => {
  const fields = new Float32Array([0.5, 0.625, 0.25, 0.25, 0.625, 0.5, 0.5, 0.625]);
  const original = fields.slice();
  const indices = new Uint16Array(4);
  const count = writeActiveParticleIndices(fields, side, 0.75, 0.5, indices);
  expect(count).toBe(3);
  expect(Array.from(indices.subarray(0, count))).toEqual(expected);
  expect(fields).toEqual(original);
});

it.each([
  { amount: 0.75, span: 0.5, expected: [1, 2] },
  { amount: 0.5, span: 0.5, expected: [0] },
  { amount: 1, span: 0.25, expected: [] },
  { amount: 1.25, span: 0.5, expected: [4] },
  { amount: 2, span: 3, expected: [0, 1, 2, 3, 4] },
  { amount: -0.25, span: 0.5, expected: [] },
])("excludes duplicate boundary fields for amount $amount and span $span", ({ amount, span, expected }) => {
  const fields = new Float32Array([0.25, 0.25, 0.5, 0.5, 0.5, 0.5, 0.75, 0.75, 1, 1]);
  const indices = new Uint16Array(5).fill(65535);
  const count = writeActiveParticleIndices(fields, 0, amount, span, indices);
  expect(count).toBe(expected.length);
  expect(Array.from(indices.subarray(0, count))).toEqual(expected);
  expect(Array.from(indices.subarray(count))).toEqual(Array(5 - count).fill(65535));
});

it("handles negative fields with the same strict boundaries", () => {
  const fields = new Float32Array([-0.75, 0, -0.5, 0, -0.5, 0, -0.25, 0]);
  const indices = new Uint16Array(4);
  const count = writeActiveParticleIndices(fields, 0, -0.25, 0.5, indices);
  expect(count).toBe(2);
  expect(Array.from(indices.subarray(0, count))).toEqual([1, 2]);
});

it("reuses the caller buffer and leaves its unused tail untouched", () => {
  const fields = new Float32Array([0.25, 0.75, 0.5, 0.5, 0.75, 0.25]);
  const indices = new Uint16Array(4).fill(65535);
  const buffer = indices.buffer;
  expect(writeActiveParticleIndices(fields, 0, 1, 1, indices)).toBe(3);
  expect(Array.from(indices)).toEqual([0, 1, 2, 65535]);
  expect(writeActiveParticleIndices(fields, 0, 0.75, 0.5, indices)).toBe(1);
  expect(Array.from(indices)).toEqual([1, 1, 2, 65535]);
  expect(writeActiveParticleIndices(fields, 0, 0, 0.5, indices)).toBe(0);
  expect(Array.from(indices)).toEqual([1, 1, 2, 65535]);
  expect(indices.buffer).toBe(buffer);
});

it("preserves all 32,000 source indices exactly once without sorting", () => {
  const count = 32000;
  const fields = new Float32Array(count * 2);
  const indices = new Uint16Array(count);
  for (let index = 0; index < count; index++) {
    fields[index * 2] = ((index * 17) % 127) / 128;
    fields[index * 2 + 1] = ((index * 23) % 113) / 128;
  }
  const expected = Uint16Array.from({ length: count }, (_, index) => index);
  for (const side of [0, 1] as const) {
    expect(writeActiveParticleIndices(fields, side, 2, 3, indices)).toBe(count);
    expect(indices).toEqual(expected);
  }
});

it("leaves the output untouched for an empty particle grid", () => {
  const indices = new Uint16Array([7, 8, 9]);
  expect(writeActiveParticleIndices(new Float32Array(), 0, 0.5, 0.25, indices)).toBe(0);
  expect(Array.from(indices)).toEqual([7, 8, 9]);
});
