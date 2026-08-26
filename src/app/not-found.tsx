import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 | Rrezon Curraj",
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 text-foreground">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-10"
        style={{ background: "radial-gradient(circle, var(--color-accent) 0%, transparent 60%)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 text-center max-w-xl">
        <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-primary)] mb-6">
          {"// error"}
        </div>

        <h1 className="text-[clamp(6rem,25vw,16rem)] font-black leading-none tracking-tighter text-[var(--color-primary)] text-glow mb-0">
          404
        </h1>

        <p className="-mt-2 mb-4 font-mono text-lg uppercase tracking-widest text-foreground/60 md:text-2xl">
          Page not found
        </p>

        <p className="mb-12 font-mono text-sm text-muted">
          The route you requested does not exist.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-3 border-2 border-control bg-accent px-8 py-4 font-black uppercase tracking-widest text-accent-foreground transition-all duration-200 hover:-translate-y-1 hover:translate-x-1 hover:shadow-[-4px_4px_0_0_var(--color-foreground)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
