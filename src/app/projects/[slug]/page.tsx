import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Github as GithubIcon } from "lucide-react";
import { portfolioData } from "@/data/portfolio";

type Project = (typeof portfolioData.projects)[number];

function getProject(slug: string): Project | undefined {
  return portfolioData.projects.find((p) => "slug" in p && p.slug === slug);
}

export function generateStaticParams() {
  return portfolioData.projects
    .filter((p): p is Project & { slug: string; caseStudy: NonNullable<Project["caseStudy" & keyof Project]> } =>
      "caseStudy" in p && Boolean(p.caseStudy) && "slug" in p && Boolean(p.slug),
    )
    .map((p) => ({ slug: p.slug as string }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project || !("caseStudy" in project) || !project.caseStudy) {
    return { title: "Project not found" };
  }
  return {
    title: `${project.title} | Case Study | Rrezon Curraj`,
    description: project.caseStudy.problem,
    openGraph: {
      title: `${project.title} | Case Study`,
      description: project.caseStudy.problem,
      images: [{ url: project.image }],
    },
  };
}

export default async function ProjectCaseStudyPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project || !("caseStudy" in project) || !project.caseStudy) {
    notFound();
  }
  const cs = project.caseStudy;

  return (
    <main className="min-h-screen bg-background py-24 text-foreground">
      <div className="container mx-auto px-4 md:px-12 max-w-4xl">
        <Link
          href="/#projects"
          className="mb-12 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-primary"
        >
          <ArrowLeft size={14} /> Back to Projects
        </Link>

        <div className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--color-primary)]">
          Case Study
        </div>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">
          {project.title}
        </h1>

        <div className="flex flex-wrap gap-2 mb-10">
          {project.tech.map((t) => (
            <span
              key={t}
              className="border border-border bg-surface px-3 py-1 font-mono text-xs uppercase tracking-wider text-muted-strong"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 mb-16">
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-2 border-control bg-accent px-5 py-3 text-sm font-bold uppercase tracking-widest text-accent-foreground"
          >
            Launch <ExternalLink size={16} />
          </a>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-2 border-border-strong bg-surface px-5 py-3 text-sm font-bold uppercase tracking-widest text-foreground"
          >
            Source <GithubIcon size={16} />
          </a>
        </div>

        <div className="relative mb-16 aspect-[16/10] overflow-hidden border-2 border-border bg-surface">
          <Image
            src={project.image}
            alt={`${project.title} preview`}
            fill
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover"
            priority
          />
        </div>

        <Section label="01" title="The Problem">
          <p>{cs.problem}</p>
        </Section>

        <Section label="02" title="My Role">
          <p>{cs.role}</p>
        </Section>

        <Section label="03" title="Approach">
          <p>{cs.approach}</p>
        </Section>

        <Section label="04" title="Technical Decisions">
          <div className="space-y-8">
            {cs.decisions.map((d) => (
              <div
                key={d.title}
                className="border-l-4 border-[var(--color-primary)] pl-5"
              >
                <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight mb-2">
                  {d.title}
                </h3>
                <p className="leading-relaxed text-muted">{d.body}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section label="05" title="Stack">
          <p>{cs.stack}</p>
        </Section>

        <Section label="06" title="Outcome">
          <p>{cs.outcome}</p>
        </Section>

        <Section label="07" title="What I'd Take Into the Next Project">
          <p>{cs.learnings}</p>
        </Section>

        <div className="mt-16 flex flex-wrap gap-4 border-t-2 border-border pt-10">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 border-2 border-border-strong px-5 py-3 font-mono text-xs uppercase tracking-widest text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <ArrowLeft size={14} /> Other Projects
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 border-2 border-control bg-accent px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest text-accent-foreground"
          >
            Work With Me
          </Link>
        </div>
      </div>
    </main>
  );
}

function Section({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-14">
      <div className="flex items-baseline gap-4 mb-5">
        <span className="font-mono text-sm text-[var(--color-primary)]">
          {label}
        </span>
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
          {title}
        </h2>
      </div>
      <div className="font-mono text-base leading-relaxed text-muted-strong md:text-lg">
        {children}
      </div>
    </section>
  );
}
