import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 | Rrezon Curraj",
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0f172a] text-[#f8fafc] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-10"
        style={{ background: "radial-gradient(circle, var(--color-primary) 0%, transparent 60%)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 text-center max-w-xl">
        <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-primary)] mb-6">
          // error
        </div>

        <h1 className="text-[clamp(6rem,25vw,16rem)] font-black leading-none tracking-tighter text-[var(--color-primary)] text-glow mb-0">
          404
        </h1>

        <p className="font-mono text-lg md:text-2xl uppercase tracking-widest text-white/60 mb-4 -mt-2">
          Page not found
        </p>

        <p className="font-mono text-sm text-zinc-400 mb-12">
          The route you requested does not exist.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--color-primary)] text-[#0f172a] font-black uppercase tracking-widest border-2 border-[var(--color-primary)] hover:-translate-y-1 hover:translate-x-1 hover:shadow-[-4px_4px_0_0_rgba(248,250,252,1)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a]"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
