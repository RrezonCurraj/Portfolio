"use client";

import type { TiltStatus } from "@/lib/useDeviceTilt";

interface Props {
  status: TiltStatus;
  onEnable: () => void;
}

export function TiltEnableButton({ status, onEnable }: Props) {
  // Only show on touch devices that need a user gesture (iOS) or that just denied.
  if (status !== "idle" && status !== "pending" && status !== "denied") return null;

  const label =
    status === "pending" ? "Requesting…" :
    status === "denied"  ? "Motion blocked — tap to retry" :
                           "Click to tilt";

  return (
    <button
      type="button"
      onClick={onEnable}
      disabled={status === "pending"}
      className="fixed right-4 bottom-4 z-30 border-2 border-control bg-accent px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent-foreground shadow-[3px_3px_0_0_var(--color-foreground)] transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none md:hidden"
    >
      {label}
    </button>
  );
}
