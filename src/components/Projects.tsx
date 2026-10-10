import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { portfolioCopy, portfolioData } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

export function Projects() {
  const copy = portfolioCopy.projects;
  return (
    <section
      id="projects"
      className="section-shell content-section projects-section"
    >
      <SectionHeading
        number={copy.number}
        title={copy.title}
        description={copy.intro}
      />
      <div className="project-grid">
        {portfolioData.projects.map((project, index) => {
          const title = project.displayTitle ?? project.title;
          const destination = project.caseStudy
            ? `/projects/${project.slug}`
            : project.link;
          return (
            <article
              key={project.slug}
              className={cn("project-card", project.featured && "featured")}
              aria-labelledby={`project-${project.slug}`}
            >
              <Link
                href={destination}
                className={cn(
                  "project-visual",
                  project.imageStyle === "brand" && "brand-visual",
                )}
                aria-label={`${title} — ${project.caseStudy ? copy.caseStudy : copy.live}`}
                {...(!project.caseStudy
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {project.image && (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes={
                      project.featured
                        ? "(max-width: 767px) calc(100vw - 71px), (max-width: 1599px) 80vw, 1250px"
                        : "(max-width: 767px) calc(100vw - 71px), (max-width: 1599px) 38vw, 610px"
                    }
                  />
                )}
                <span className="project-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </Link>
              <div className="project-body">
                <div>
                  {project.category && (
                    <p className="project-category">{project.category}</p>
                  )}
                  <h3 id={`project-${project.slug}`} className="project-title">
                    {title}
                  </h3>
                  <div className="project-links">
                    {project.caseStudy && (
                      <Link
                        href={`/projects/${project.slug}`}
                        className="text-link"
                      >
                        {copy.caseStudy}
                        <ArrowUpRight size={14} aria-hidden="true" />
                      </Link>
                    )}
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-link muted-link"
                        aria-label={`${copy.live}: ${title}`}
                      >
                        {copy.live}
                        <ArrowUpRight size={14} aria-hidden="true" />
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-link muted-link"
                        aria-label={`${copy.source}: ${title}`}
                      >
                        {copy.source}
                        <ArrowUpRight size={14} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
                <div>
                  <p className="project-description">
                    {project.summary ?? project.description}
                  </p>
                  <ul className="project-stack" aria-label={project.title}>
                    {project.tech.map((technology) => (
                      <li key={technology}>{technology}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
