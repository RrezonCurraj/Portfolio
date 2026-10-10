"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { scrollImmediately } from "@/lib/scroll";
import { cn } from "@/lib/utils";

const ticks = Array.from({ length: 21 }, (_, index) => index * 5);
const clamp = (value: number, maximum: number) => Math.min(maximum, Math.max(0, value));

function scrollDistance() {
  return Math.max(
    0,
    Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) - window.innerHeight,
  );
}

export function ScrollRuler({ progress, label }: { progress: number; label: string }) {
  const track = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLDivElement>(null);
  const pointer = useRef<number | null>(null);
  const handleDrag = useRef<{ startY: number; startScroll: number; travel: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [pointerFocus, setPointerFocus] = useState(false);
  const value = clamp(progress, 100);
  const lensStart = clamp(Math.round(value) - 2, 96);
  const lensTicks = Array.from({ length: 5 }, (_, index) => lensStart + index);

  useEffect(() => {
    const element = track.current;
    return () => {
      const captured = pointer.current;
      pointer.current = null;
      handleDrag.current = null;
      if (captured !== null && element?.hasPointerCapture(captured)) {
        element.releasePointerCapture(captured);
      }
    };
  }, []);

  const moveToPointer = (event: PointerEvent<HTMLDivElement>) => {
    if (handleDrag.current) {
      const { startY, startScroll, travel } = handleDrag.current;
      const distance = scrollDistance();
      scrollImmediately(clamp(startScroll + ((event.clientY - startY) / travel) * distance, distance));
      return;
    }
    const { top, height } = event.currentTarget.getBoundingClientRect();
    const fraction = height > 0 ? clamp((event.clientY - top) / height, 1) : 0;
    scrollImmediately(fraction * scrollDistance());
  };

  const finishDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (pointer.current !== event.pointerId) return;
    pointer.current = null;
    handleDrag.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    setPointerFocus(false);
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const distance = scrollDistance();
    let target: number;
    switch (event.key) {
      case "ArrowUp": target = window.scrollY - 40; break;
      case "ArrowDown": target = window.scrollY + 40; break;
      case "PageUp": target = window.scrollY - window.innerHeight * 0.9; break;
      case "PageDown": target = window.scrollY + window.innerHeight * 0.9; break;
      case "Home": target = 0; break;
      case "End": target = distance; break;
      default: return;
    }
    event.preventDefault();
    scrollImmediately(clamp(target, distance));
  };

  return (
    <div
      ref={track}
      className="scroll-ruler"
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-orientation="vertical"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
      data-dragging={dragging ? "true" : undefined}
      data-pointer-focus={pointerFocus ? "true" : undefined}
      onKeyDown={handleKeyDown}
      onBlur={() => setPointerFocus(false)}
      onPointerDown={(event) => {
        if (event.button !== 0 || event.isPrimary === false || pointer.current !== null) return;
        event.preventDefault();
        setPointerFocus(true);
        event.currentTarget.focus({ preventScroll: true });
        pointer.current = event.pointerId;
        event.currentTarget.setPointerCapture(event.pointerId);
        setDragging(true);
        if (event.target instanceof Node && handle.current?.contains(event.target)) {
          handleDrag.current = {
            startY: event.clientY,
            startScroll: clamp(window.scrollY, scrollDistance()),
            travel: Math.max(1, event.currentTarget.getBoundingClientRect().height - handle.current.getBoundingClientRect().height),
          };
        } else {
          handleDrag.current = null;
        }
        moveToPointer(event);
      }}
      onPointerMove={(event) => {
        if (pointer.current !== event.pointerId) return;
        event.preventDefault();
        moveToPointer(event);
      }}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onLostPointerCapture={finishDrag}
    >
      <div className="ruler-ticks" aria-hidden="true">
        {ticks.map((tick) => (
          <span key={tick} className={cn("ruler-tick", tick % 10 === 0 && "major")}>
            <span>{tick % 10 === 0 ? tick : ""}</span>
          </span>
        ))}
      </div>
      <span className="ruler-marker" style={{ top: `${value}%` }} aria-hidden="true">
        <span>{String(Math.round(value)).padStart(2, "0")}</span>
      </span>
      <div
        ref={handle}
        className="ruler-handle"
        style={{ top: `${value}%`, transform: `translateY(-${value}%)` }}
        aria-hidden="true"
      >
        <div className="ruler-lens">
          {lensTicks.map((tick) => (
            <span
              key={tick}
              className="ruler-lens-tick"
              data-current={tick === Math.round(value) ? "true" : undefined}
            >
              <span>{String(tick).padStart(2, "0")}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
