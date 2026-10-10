import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { portfolioCopy, portfolioData } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

export function Projects() {
  const copy = portfolioCopy.projects;
  return (
    <section id="projects" className="section-shell content-section projects-section">
      <SectionHeading number={copy.number} title={copy.title} description={copy.intro} />
      <div className="project-grid">
        {portfolioData.projects.map((project, index) => {
          const title = project.displayTitle ?? project.title;
          const destination = project.caseStudy ? `/projects/${project.slug}` : project.link;
          const external = !project.caseStudy ? { target: "_blank", rel: "noopener noreferrer" } : {};
          return (
            <article key={project.slug} className={cn("project-card", project.featured && "featured", project.caseStudy && "has-case-study")} aria-labelledby={`project-${project.slug}`}>
              <Link href={destination} className={cn("project-visual", project.imageStyle === "brand" && "brand-visual")} aria-label={`${title} — ${project.caseStudy ? copy.caseStudy : copy.live}`} {...external}>
                {project.image && <Image src={project.image} alt={project.title} fill sizes={project.featured ? "(max-width: 767px) calc(100vw - 44px), (max-width: 1599px) 80vw, 1250px" : "(max-width: 767px) calc(100vw - 44px), (max-width: 1599px) 38vw, 610px"} />}
                <span className="project-index">{String(index + 1).padStart(2, "0")}</span>
              </Link>
              <div className="project-body">
                <div className="project-identity">
                  {project.category && <p className="project-category">{project.category}</p>}
                  <h3 id={`project-${project.slug}`} className="project-title">{title}</h3>
                </div>
                <p className="project-description">{project.summary ?? project.description}</p>
                <div className="project-links">
                  <Link href={destination} className="text-link project-primary" {...external}>{portfolioCopy.mobile.project}<ArrowUpRight size={16} aria-hidden="true" /></Link>
                  {project.caseStudy && <Link href={destination} className="text-link project-case-link">{copy.caseStudy}<ArrowUpRight size={14} aria-hidden="true" /></Link>}
                  {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-link muted-link project-live-link" aria-label={`${copy.live}: ${title}`}>{copy.live}<ArrowUpRight size={14} aria-hidden="true" /></a>}
                  {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-link muted-link project-source-link" aria-label={`${copy.source}: ${title}`}>{copy.source}<ArrowUpRight size={14} aria-hidden="true" /></a>}
                </div>
                <ul className="project-stack" aria-label={project.title}>{project.tech.map(technology => <li key={technology}>{technology}</li>)}</ul>
              </div>
            </article>
          );
        })}
      </div>
      <a href="#contact" className="text-link work-contact-prompt">{portfolioCopy.mobile.contactPrompt}<ArrowUpRight size={18} aria-hidden="true" /></a>
    </section>
  );
}
