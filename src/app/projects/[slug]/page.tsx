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
    <main className="min-h-screen bg-[#0f172a] text-[#f8fafc] py-24">
      <div className="container mx-auto px-4 md:px-12 max-w-4xl">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 mb-12 font-mono text-xs uppercase tracking-widest text-zinc-400 hover:text-[var(--color-primary)] transition-colors"
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
              className="px-3 py-1 bg-[#1e293b] text-xs font-mono uppercase tracking-wider border border-white/10 text-zinc-300"
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
            className="px-5 py-3 bg-[var(--color-primary)] text-[#0f172a] font-bold uppercase tracking-widest text-sm border-2 border-[var(--color-primary)] inline-flex items-center gap-2"
          >
            Launch <ExternalLink size={16} />
          </a>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 bg-[#1e293b] border-2 border-white/20 text-white font-bold uppercase tracking-widest text-sm inline-flex items-center gap-2"
          >
            Source <GithubIcon size={16} />
          </a>
        </div>

        <div className="relative aspect-[16/10] mb-16 border-2 border-white/10 overflow-hidden bg-[#1e293b]">
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
                <p className="text-zinc-400 leading-relaxed">{d.body}</p>
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

        <div className="mt-16 pt-10 border-t-2 border-white/10 flex flex-wrap gap-4">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 px-5 py-3 border-2 border-white/20 text-white font-mono text-xs uppercase tracking-widest hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
          >
            <ArrowLeft size={14} /> Other Projects
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[var(--color-primary)] text-[#0f172a] font-mono text-xs uppercase tracking-widest font-bold"
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
      <div className="text-zinc-300 leading-relaxed text-base md:text-lg font-mono">
        {children}
      </div>
    </section>
  );
}
