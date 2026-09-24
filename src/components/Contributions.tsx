import { portfolioData } from "@/data/portfolio";
import { ArrowUpRight, GitFork, GitPullRequest, ShieldCheck } from "lucide-react";
import { TextReveal } from "@/components/ui/TextReveal";

export function Contributions() {
  return (
    <section
      id="contributions"
      aria-labelledby="contributions-heading"
      className="relative z-10 border-t-4 border-border bg-background px-4 py-24 text-foreground md:px-12 md:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-16 flex flex-col items-start justify-between gap-8 border-b-4 border-border-strong pb-8 md:flex-row md:items-end">
          <div>
            <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.28em] text-primary">
              Public code. Maintainer reviewed. Shipped upstream.
            </p>
            <TextReveal
              as="h2"
              id="contributions-heading"
              activeColor="var(--color-primary)"
              className="text-4xl font-black uppercase tracking-tighter sm:text-6xl lg:text-8xl"
            >
              CONTRIBUTIONS
            </TextReveal>
          </div>
          <div className="border-2 border-primary bg-surface px-4 py-2 font-mono text-lg text-primary md:text-xl">
            [ OPEN SOURCE ]
          </div>
        </div>

        {portfolioData.contributions.map((contribution) => (
          <article key={contribution.project} className="editorial-card border-2 border-border bg-surface">
            <header className="grid gap-8 border-b-2 border-border p-6 md:p-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <div className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
                  <GitFork className="h-4 w-4 text-primary" aria-hidden="true" />
                  Open-source contributor
                </div>
                <h3
                  className="mb-5 text-4xl font-black uppercase tracking-tighter sm:text-5xl md:text-6xl"
                >
                  {contribution.project}
                </h3>
                <p className="max-w-3xl border-l-4 border-primary pl-5 font-mono text-base leading-relaxed text-muted-strong md:text-lg">
                  {contribution.description}
                </p>
              </div>
              <a
                href={contribution.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border-2 border-control bg-accent px-5 py-3 font-mono text-xs font-black uppercase tracking-widest text-accent-foreground transition-transform hover:-translate-y-1 hover:translate-x-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary"
              >
                View repository <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </header>

            <div className="grid border-b-2 border-border sm:grid-cols-3">
              {contribution.summary.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 border-b-2 border-border p-5 last:border-b-0 sm:border-r-2 sm:border-b-0 sm:last:border-r-0"
                >
                  <ShieldCheck className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted-strong">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 font-mono text-xs font-black uppercase tracking-widest text-foreground transition-colors hover:bg-background/45 hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-primary md:px-10 [&::-webkit-details-marker]:hidden">
                <span>
                  <span className="group-open:hidden">Show contribution details</span>
                  <span className="hidden group-open:inline">Hide contribution details</span>
                </span>
                <span className="flex items-center gap-3">
                  {contribution.items.length} contributions
                  <span className="text-xl leading-none group-open:hidden" aria-hidden="true">+</span>
                  <span className="hidden text-xl leading-none group-open:inline" aria-hidden="true">−</span>
                </span>
              </summary>

              <div className="divide-y-2 divide-border border-t-2 border-border">
                {contribution.items.map((item) => (
                  <div
                    key={item.number}
                    className="group grid gap-6 p-6 transition-colors hover:bg-background/45 md:p-10 lg:grid-cols-[7rem_1fr_auto] lg:items-start"
                  >
                    <div className="flex items-center gap-3 lg:block">
                      <span className="block font-mono text-3xl font-black text-foreground/25 lg:mb-3">
                        #{item.number}
                      </span>
                      <span className="inline-flex border border-primary px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                        {item.status}
                      </span>
                    </div>
                    <div>
                      <h4 className="mb-3 text-2xl font-black uppercase tracking-tight transition-colors group-hover:text-primary md:text-3xl">
                        {item.title}
                      </h4>
                      <p className="mb-4 max-w-3xl font-mono text-sm leading-relaxed text-muted md:text-base">
                        {item.description}
                      </p>
                      <p className="font-mono text-xs font-bold uppercase tracking-wider text-muted-strong">
                        {item.proof}
                      </p>
                    </div>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View Codenotch pull request ${item.number} (opens in new tab)`}
                      className="inline-flex items-center gap-2 justify-self-start border-2 border-border-strong px-4 py-3 font-mono text-xs font-bold uppercase tracking-widest text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary"
                    >
                      <GitPullRequest className="h-4 w-4" aria-hidden="true" />
                      View PR
                    </a>
                  </div>
                ))}
              </div>
            </details>

            <footer className="flex flex-wrap gap-2 border-t-2 border-border bg-background/40 p-6 md:px-10">
              {contribution.tech.map((technology) => (
                <span
                  key={technology}
                  className="border border-border-strong bg-surface px-3 py-1 font-mono text-xs uppercase tracking-wider text-muted-strong"
                >
                  {technology}
                </span>
              ))}
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
