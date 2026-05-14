"use client";

/**
 * Lime dot grid + slow diagonal scan lines, GPU-cheap, no JS render loop.
 * Mobile-only replacement for the Three.js particle sphere.
 */
export function MobileGridFX() {
  return (
    <div className="mobile-grid-fx absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="mobile-grid-dots absolute inset-0" />
      <div className="mobile-grid-scan absolute inset-0" />
      <div className="mobile-grid-glow absolute inset-0" />
    </div>
  );
}
