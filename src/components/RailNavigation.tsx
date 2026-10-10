"use client";

import { useMemo, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { COMPACT_LAYOUT_QUERY } from "@/lib/useCompactLayout";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type NavigationItem = { id: string; label: string };
type Letter = { text: string; offset: number };

const clamp = gsap.utils.clamp(0, 1);
const smooth = (value: number) => value ** 3 * (value * (value * 6 - 15) + 10);
const assemblyShare = 0.72;
const mix = (from: number, to: number, progress: number) =>
  from + (to - from) * progress;
const curve = (a: number, b: number, c: number, d: number, t: number) =>
  (1 - t) ** 3 * a +
  3 * (1 - t) ** 2 * t * b +
  3 * (1 - t) * t ** 2 * c +
  t ** 3 * d;

function splitLetters(text: string): Letter[] {
  return [
    ...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text),
  ]
    .filter(({ segment }) => !/^\s+$/.test(segment))
    .map(({ segment, index }) => ({ text: segment, offset: index }));
}

export function RailNavigation({
  items,
  activeId,
  enabled,
  theme,
  label,
}: {
  items: readonly NavigationItem[];
  activeId: string;
  enabled: boolean;
  theme: string;
  label: string;
}) {
  const root = useRef<HTMLElement>(null);
  const words = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        text: item.label.toUpperCase(),
        letters: splitLetters(item.label.toUpperCase()),
      })),
    [items],
  );

  useGSAP(
    () => {
      const navigation = root.current;
      if (!navigation || !enabled) return;

      const context = gsap.context(() => {
        const media = gsap.matchMedia();
        media.add(
          {
            desktop: "(min-width: 768px)",
            compact: COMPACT_LAYOUT_QUERY,
            space: "(min-height: 400px)",
            reduced: "(prefers-reduced-motion: reduce)",
          },
          (match) => {
            if (
              !match.conditions?.desktop ||
              !match.conditions.space ||
              match.conditions.compact ||
              match.conditions.reduced
            )
              return;

            const entries = words.flatMap((word) => {
              const link = navigation.querySelector<HTMLAnchorElement>(
                `[data-rail-section="${word.id}"]`,
              );
              const section = document.getElementById(word.id);
              const measure =
                link?.querySelector<HTMLElement>(".rail-word-measure");
              if (!link || !section || !measure) return [];
              const glyphs = [
                ...link.querySelectorAll<HTMLElement>(".rail-glyph"),
              ];
              gsap.set(glyphs, {
                x: 0,
                y: 0,
                rotation: 0,
                scale: 1,
                filter: "blur(0px)",
                transformOrigin: "50% 50%",
                color: "var(--foreground)",
              });
              return [
                {
                  word,
                  link,
                  section,
                  measure,
                  top: 0,
                  width: 0,
                  font: 64,
                  glyphs: glyphs.map((element) => ({
                    element,
                    left: 0,
                    width: 0,
                    x: gsap.quickSetter(element, "x", "px"),
                    y: gsap.quickSetter(element, "y", "px"),
                    rotation: gsap.quickSetter(element, "rotation", "deg"),
                    scaleX: gsap.quickSetter(element, "scaleX"),
                    scaleY: gsap.quickSetter(element, "scaleY"),
                    hitScale: gsap.quickSetter(element, "--glyph-scale"),
                    color: gsap.quickSetter(element, "color"),
                    blur: gsap.quickSetter(element, "filter"),
                  })),
                },
              ];
            });
            if (!entries.length) return;

            let width = 0;
            let height = 0;
            let stackLine = 0;
            let incomingFont = 0;
            let parkedFont = 0;
            let maxScroll = 1;
            let color = gsap.utils.interpolate("#999999", "#24261f");
            const driver = { position: 0 };

            const measure = () => {
              width =
                navigation.getBoundingClientRect().width ||
                window.innerWidth * 0.23;
              height = window.innerHeight;
              stackLine = window.matchMedia("(pointer: coarse)").matches
                ? 44
                : Math.min(30, Math.max(24, height * 0.026));
              incomingFont = Math.min(
                26,
                Math.max(
                  14,
                  Math.min(window.innerWidth * 0.0155, height * 0.033),
                ),
              );
              parkedFont = Math.min(
                18,
                Math.max(
                  12,
                  Math.min(window.innerWidth * 0.012, height * 0.029),
                ),
              );
              maxScroll = Math.max(1, ScrollTrigger.maxScroll(window));
              const foreground =
                getComputedStyle(entries[0].measure).color || "#24261f";
              const background =
                getComputedStyle(document.body).backgroundColor || "#f3f1e9";
              color = gsap.utils.interpolate(
                gsap.utils.interpolate(foreground, background)(0.6),
                foreground,
              );
              for (const entry of entries) {
                entry.top =
                  entry.section.getBoundingClientRect().top + window.scrollY;
                entry.font =
                  parseFloat(getComputedStyle(entry.measure).fontSize) || 64;
                const bounds = entry.measure.getBoundingClientRect();
                entry.width =
                  bounds.width || entry.word.text.length * entry.font * 0.6;
                // Measure the whole word to preserve spaces and the font's kerning.
                const text = entry.measure.firstChild;
                entry.glyphs.forEach((glyph, index) => {
                  const letter = entry.word.letters[index];
                  const range = document.createRange();
                  if (text) {
                    range.setStart(text, letter.offset);
                    range.setEnd(text, letter.offset + letter.text.length);
                  }
                  const rect =
                    typeof range.getBoundingClientRect === "function"
                      ? range.getBoundingClientRect()
                      : null;
                  glyph.left = rect?.width
                    ? rect.left - bounds.left
                    : letter.offset * entry.font * 0.6;
                  glyph.width =
                    rect?.width || letter.text.length * entry.font * 0.6;
                  glyph.element.style.width = `${glyph.width}px`;
                  glyph.element.style.height = `${entry.font}px`;
                });
              }
            };

            const assemblyStartTop = (index: number) =>
              Math.max(
                92 + index * stackLine + entries[index].font * 4,
                height * 0.52,
              );

            const progress = (index: number) => {
              if (index === 0) return 1;
              const entry = entries[index];
              const restingTop = 92 + index * stackLine;
              const start = entry.top - assemblyStartTop(index);
              const end = Math.min(entry.top - restingTop, maxScroll);
              return clamp(
                (driver.position - start) / Math.max(1, end - start),
              );
            };

            const draw = () => {
              const phases = entries.map((_, index) => progress(index));
              const handoffs = phases.map((phase) =>
                smooth(clamp((phase - assemblyShare) / (1 - assemblyShare))),
              );
              const right = width - 58;
              const futureLine = Math.max(stackLine, incomingFont * 1.55);
              const placements = entries.map((entry, index) => {
                const dock = handoffs[index + 1] ?? 0;
                const parkedScale = parkedFont / entry.font;
                const targetScale = mix(1, parkedScale, dock);
                const approachOffset = index
                  ? Math.max(0, entries[index - 1].font + 12 - stackLine)
                  : 0;
                // Assemble beside the current title before their shared upward handoff.
                const activeTop =
                  92 +
                  index * stackLine +
                  approachOffset * (1 - handoffs[index]);
                const targetY = mix(
                  activeTop + entry.font / 2,
                  28 + index * stackLine + parkedFont / 2,
                  dock,
                );
                return { dock, parkedScale, targetScale, targetY };
              });
              entries.forEach((entry, index) => {
                const { dock, parkedScale, targetScale, targetY } =
                  placements[index];
                // Bottom-aligned rows stay fixed as the earlier labels leave the stack.
                const futureY =
                  height -
                  64 -
                  incomingFont / 2 -
                  (entries.length - 1 - index) * futureLine;
                const lowerEnd = entry.top - assemblyStartTop(index);
                const lowerStart =
                  entry.top -
                  Math.max(
                    futureY - incomingFont / 2,
                    assemblyStartTop(index) + 120,
                  );
                const lowerPhase =
                  index === 0
                    ? 1
                    : clamp(
                        (driver.position - lowerStart) /
                          Math.max(1, lowerEnd - lowerStart),
                      );
                entry.glyphs.forEach((glyph, letterIndex) => {
                  // The trailing letter leaves the vertical word first.
                  const rank = entry.glyphs.length - 1 - letterIndex;
                  const delay =
                    (rank / Math.max(1, entry.glyphs.length - 1)) * 0.58;
                  const assembly = clamp(phases[index] / assemblyShare);
                  const t = smooth(clamp((assembly - delay) / 0.42));
                  const lowerT = smooth(clamp((lowerPhase - delay) / 0.42));
                  const advance = glyph.left + glyph.width / 2;
                  const verticalScale = incomingFont / entry.font;
                  const fromX = width - 43;
                  const boundary = entry.top - driver.position;
                  const ceiling =
                    futureY - entry.width * verticalScale - incomingFont * 1.5;
                  // A smooth bound keeps the entire vertical word above its future row.
                  const verticalTop =
                    Math.min(boundary, ceiling) -
                    24 *
                      Math.log1p(Math.exp(-Math.abs(boundary - ceiling) / 24));
                  const fromY =
                    verticalTop + (entry.width - advance) * verticalScale;
                  const futureX =
                    right -
                    entry.width * verticalScale +
                    advance * verticalScale;
                  const lowerX = curve(
                    futureX,
                    mix(futureX, fromX, 0.55),
                    fromX,
                    fromX,
                    lowerT,
                  );
                  const lowerY = curve(
                    futureY,
                    futureY - entry.font * 1.25,
                    fromY + incomingFont * 1.4,
                    fromY,
                    lowerT,
                  );
                  const toX = mix(
                    right - entry.width + advance,
                    right - entry.width * parkedScale + advance * parkedScale,
                    dock,
                  );
                  const y = curve(
                    lowerY,
                    mix(lowerY, targetY, 0.55),
                    targetY + entry.font * 0.4,
                    targetY,
                    t,
                  );
                  const previous = placements[index - 1];
                  const previousBottom = previous
                    ? previous.targetY +
                      (entries[index - 1].font * previous.targetScale) / 2
                    : 0;
                  // Clear the current title vertically before turning into its horizontal lane.
                  const turn =
                    previous && phases[index] < assemblyShare
                      ? t *
                        smooth(
                          clamp((y - previousBottom - entry.font / 2 - 4) / 8),
                        )
                      : t;
                  const x = curve(
                    lowerX,
                    lowerX - entry.font * 1.2,
                    toX - entry.font * 0.2,
                    toX,
                    turn,
                  );
                  glyph.x(x - glyph.width / 2);
                  glyph.y(y - entry.font / 2);
                  glyph.rotation(
                    turn === 1 || lowerT === 0
                      ? 0
                      : -90 * lowerT * (1 - turn) + Math.sin(Math.PI * turn) * 18,
                  );
                  const scale = mix(verticalScale, targetScale, turn);
                  glyph.scaleX(scale);
                  glyph.scaleY(scale);
                  glyph.hitScale(scale);
                  glyph.color(color(turn * (1 - dock)));
                  glyph.blur(
                    `blur(${(dock * 0.65 + Math.sin(Math.PI * dock) * 1.6).toFixed(3)}px)`,
                  );
                });
              });
            };

            navigation.dataset.animated = "true";
            measure();
            draw();
            ScrollTrigger.addEventListener("refreshInit", measure);
            gsap.to(driver, {
              position: () => maxScroll,
              duration: 1,
              ease: "none",
              onUpdate: draw,
              scrollTrigger: {
                id: "rail-typography",
                start: 0,
                end: () => maxScroll,
                scrub: true,
                invalidateOnRefresh: true,
                onRefresh: draw,
              },
            });
            return () => {
              ScrollTrigger.removeEventListener("refreshInit", measure);
              delete navigation.dataset.animated;
            };
          },
        );
        return () => media.revert();
      }, navigation);
      return () => context.revert();
    },
    {
      scope: root,
      dependencies: [words, enabled, theme],
      revertOnUpdate: true,
    },
  );

  return (
    <nav ref={root} className="rail-navigation" aria-label={label}>
      {words.map((word, index) => (
        <a
          key={word.id}
          href={`#${word.id}`}
          data-rail-section={word.id}
          className={cn("rail-word", activeId === word.id && "is-active")}
          aria-current={activeId === word.id ? "location" : undefined}
          style={{ "--focus-y": `${28 + index * 40}px` } as CSSProperties}
        >
          <span className="rail-word-source">{word.label}</span>
          <span className="rail-word-visual" aria-hidden="true">
            <span className="rail-word-measure">{word.text}</span>
            {word.letters.map((letter) => (
              <span key={letter.offset} className="rail-glyph">
                {letter.text}
              </span>
            ))}
          </span>
        </a>
      ))}
    </nav>
  );
}
