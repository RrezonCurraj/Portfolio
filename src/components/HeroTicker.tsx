"use client";

const TICKER_ITEMS = [
  "Available for work",
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Framer Motion",
  "Node.js",
  "Based in GMT+1",
  "Open to remote",
];

export function HeroTicker() {
  // Duplicate the list so translate -50% loops seamlessly.
  const loop = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div
      className="relative w-full overflow-hidden border-y-2 border-border bg-background py-3 md:py-4"
      aria-hidden="true"
    >
      <div className="ticker-track flex w-max">
        {loop.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-8 pr-8 font-mono text-xs md:text-sm uppercase tracking-[0.25em] text-[var(--color-primary)] shrink-0"
          >
            <span>{item}</span>
            <span className="text-foreground/30">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
