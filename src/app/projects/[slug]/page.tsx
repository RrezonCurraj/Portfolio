import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { portfolioCopy, portfolioData, type Project } from "@/data/portfolio";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

function getProject(slug: string): Project | undefined {
  return portfolioData.projects.find((project) => project.slug === slug);
}

export function generateStaticParams() {
  return portfolioData.projects
    .filter((project) => project.caseStudy)
    .map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project?.caseStudy) return { title: "Project not found" };
  return {
    title: `${project.title} | Case Study | ${portfolioData.personal.name}`,
    description: project.caseStudy.problem,
    openGraph: {
      title: `${project.title} | Case Study`,
      description: project.caseStudy.problem,
      images: [{ url: project.image }],
    },
  };
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project?.caseStudy) notFound();
  const study = project.caseStudy;
  const copy = portfolioCopy.caseStudy;
  return (
    <main className="case-study">
      <header className="case-header">
        <Link href="/#projects" className="text-link">
          <ArrowLeft size={16} aria-hidden="true" />
          {copy.back}
        </Link>
        <ThemeToggle />
      </header>
      <p className="eyebrow">
        {copy.label} /{" "}
        {project.category ?? project.displayTitle ?? project.title}
      </p>
      <h1 className="case-title">{project.title}</h1>
      <ul className="project-stack">
        {project.tech.map((technology) => (
          <li key={technology}>{technology}</li>
        ))}
      </ul>
      <div className="case-links">
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-link"
        >
          {copy.live}
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-link muted-link"
        >
          {copy.source}
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
      <div
        className={cn(
          "case-image",
          project.imageStyle === "brand" && "brand-visual",
        )}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 1050px) 90vw, 900px"
          priority
        />
      </div>
      <Section title={copy.sections[0]}>
        <p>{study.problem}</p>
      </Section>
      <Section title={copy.sections[1]}>
        <p>{study.role}</p>
      </Section>
      <Section title={copy.sections[2]}>
        <p>{study.approach}</p>
      </Section>
      <Section title={copy.sections[3]}>
        {study.decisions.map((decision) => (
          <div key={decision.title} className="case-decision">
            <h3>{decision.title}</h3>
            <p>{decision.body}</p>
          </div>
        ))}
      </Section>
      <Section title={copy.sections[4]}>
        <p>{study.stack}</p>
      </Section>
      <Section title={copy.sections[5]}>
        <p>{study.outcome}</p>
      </Section>
      <Section title={copy.sections[6]}>
        <p>{study.learnings}</p>
      </Section>
      <footer className="case-links border-t border-border pt-8 mt-8">
        <Link href="/#projects" className="text-link">
          <ArrowLeft size={15} aria-hidden="true" />
          {copy.back}
        </Link>
        <Link href="/#contact" className="text-link">
          {copy.contact}
          <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </footer>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="case-section">
      <h2>{title}</h2>
      <div className="case-section-content">{children}</div>
    </section>
  );
}
