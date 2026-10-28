export function writeActiveParticleIndices(fields: Float32Array, side: 0 | 1, amount: number, span: number, indices: Uint16Array): number {
  const lower = amount - span;
  let count = 0;
  for (let offset = side; offset < fields.length; offset += 2) {
    const value = fields[offset];
    if (value > lower && value < amount) indices[count++] = offset >>> 1;
  }
  return count;
}
