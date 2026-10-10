import { ArrowUpRight, ChevronDown } from "lucide-react";
import { portfolioCopy, portfolioData } from "@/data/portfolio";
import { ResponsiveDisclosure } from "@/components/ui/ResponsiveDisclosure";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Contributions() {
  const copy = portfolioCopy.contributions;
  return (
    <section
      id="contributions"
      className="section-shell content-section divided-section"
    >
      <ResponsiveDisclosure anchorId="contributions" title={portfolioCopy.mobile.contributions} desktopHeading={
        <SectionHeading
        number={copy.number}
        title={copy.title} compactTitle={portfolioCopy.mobile.contributions}
        description={copy.intro}
      />
      }>
      {portfolioData.contributions.map((contribution) => (
        <article key={contribution.project} className="contribution">
          <div>
            <h3>{contribution.project}</h3>
            <a
              href={contribution.repository}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link muted-link"
            >
              {copy.repository}
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
            <ul className="project-stack">
              {contribution.tech.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="contribution-description">
              {contribution.description}
            </p>
            <ul className="contribution-summary">
              {contribution.summary.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <details className="contribution-details">
              <summary>
                {copy.details}
                <ChevronDown
                  size={16}
                  className="details-chevron"
                  aria-hidden="true"
                />
              </summary>
              {contribution.items.map((item) => (
                <div key={item.number} className="contribution-item">
                  <span className="eyebrow">
                    #{item.number} · {item.status}
                  </span>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                  <p>{item.proof}</p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link"
                  >
                    {copy.pullRequest}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                </div>
              ))}
            </details>
          </div>
        </article>
      ))}
      </ResponsiveDisclosure>
    </section>
  );
}
