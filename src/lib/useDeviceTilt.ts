"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

export type TiltStatus =
  | "idle"          // touch device, awaiting user gesture for permission (iOS)
  | "pending"       // permission prompt shown
  | "granted"       // listening to device orientation
  | "denied"        // user denied or API errored
  | "unavailable"   // desktop / no orientation support
  | "reduced";      // prefers-reduced-motion is on

/**
 * Drives --tilt-x and --tilt-y CSS vars on <html> in [-1, 1] from device
 * orientation. iOS 13+ requires a user-gesture permission call — exposed via
 * the returned enable() function. Android Chrome auto-attaches on mount.
 *
 * Layers consume the vars like:
 *   transform: translate3d(calc(var(--tilt-x, 0) * 40px), calc(var(--tilt-y, 0) * 30px), 0)
 */
export function useDeviceTilt() {
  const [status, setStatus] = useState<TiltStatus>("idle");
  const detachRef = useRef<(() => void) | null>(null);

  const attach = useCallback(() => {
    if (detachRef.current) return;

    const root = document.documentElement;
    const SMOOTHING = 0.1;
    const SENSITIVITY_DEG = 20;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = 0;

    const tick = () => {
      currentX += (targetX - currentX) * SMOOTHING;
      currentY += (targetY - currentY) * SMOOTHING;
      root.style.setProperty("--tilt-x", currentX.toFixed(4));
      root.style.setProperty("--tilt-y", currentY.toFixed(4));
      rafId = requestAnimationFrame(tick);
    };

    const handle = (e: DeviceOrientationEvent) => {
      const gamma = e.gamma ?? 0; // -90..90 left/right
      const beta = e.beta ?? 0;   // -180..180 front/back
      targetX = Math.max(-1, Math.min(1, gamma / SENSITIVITY_DEG));
      targetY = Math.max(-1, Math.min(1, (beta - 45) / SENSITIVITY_DEG));
    };

    window.addEventListener("deviceorientation", handle);
    rafId = requestAnimationFrame(tick);

    detachRef.current = () => {
      window.removeEventListener("deviceorientation", handle);
      if (rafId) cancelAnimationFrame(rafId);
      root.style.removeProperty("--tilt-x");
      root.style.removeProperty("--tilt-y");
      detachRef.current = null;
    };
  }, []);

  const enable = useCallback(async () => {
    const DOE = window.DeviceOrientationEvent as unknown as
      | { requestPermission?: () => Promise<"granted" | "denied"> }
      | undefined;

    if (DOE && typeof DOE.requestPermission === "function") {
      setStatus("pending");
      try {
        const result = await DOE.requestPermission();
        if (result === "granted") {
          setStatus("granted");
        } else {
          setStatus("denied");
        }
      } catch {
        setStatus("denied");
      }
    } else if (typeof window.DeviceOrientationEvent !== "undefined") {
      setStatus("granted");
    } else {
      setStatus("unavailable");
    }
  }, []);

  // Initial status detection on mount. Deferred via rAF to satisfy the
  // react-hooks/set-state-in-effect rule and avoid hydration mismatch.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const detect = (): TiltStatus => {
      if (prefersReducedMotion()) return "reduced";
      if (!window.matchMedia("(pointer: coarse)").matches) return "unavailable";

      const DOE = window.DeviceOrientationEvent as unknown as
        | { requestPermission?: () => Promise<"granted" | "denied"> }
        | undefined;

      if (!DOE) return "unavailable";
      // Android Chrome / Firefox — no permission API, attach right away.
      if (typeof DOE.requestPermission !== "function") return "granted";
      // iOS Safari — stays "idle" until enable() is called from a user gesture.
      return "idle";
    };

    const rafId = requestAnimationFrame(() => setStatus(detect()));
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Attach / detach the listener when status flips to granted.
  useEffect(() => {
    if (status !== "granted") return;
    attach();
    return () => {
      detachRef.current?.();
    };
  }, [status, attach]);

  return { status, enable };
}
