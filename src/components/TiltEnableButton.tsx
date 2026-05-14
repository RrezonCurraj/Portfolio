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
      className="md:hidden fixed bottom-4 right-4 z-30 font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-2 bg-[var(--color-primary)] text-[#0f172a] border-2 border-[var(--color-primary)] shadow-[3px_3px_0_0_rgba(15,23,42,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-transform"
    >
      {label}
    </button>
  );
}
