import { ChevronDown } from "lucide-react";
import { portfolioCopy, portfolioData } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Experience() {
  const copy = portfolioCopy.experience;
  return (
    <section
      id="experience"
      className="section-shell content-section divided-section"
    >
      <SectionHeading
        number={copy.number}
        title={copy.title} compactTitle={portfolioCopy.mobile.experience}
        description={copy.intro}
      />
      {portfolioData.experience.map((job, index) => (
        <details
          key={`${job.company}-${job.period}`}
          className="experience-row"
          open={index === 0}
        >
          <summary>
            <span className="experience-date">{job.period}</span>
            <div>
              <h3>{job.company}</h3>
              <span className="experience-role">{job.role}</span>
            </div>
            <ChevronDown
              size={18}
              className="details-chevron"
              aria-hidden="true"
            />
          </summary>
          <ul className="experience-description">
            {job.description
              .split("\n")
              .filter(Boolean)
              .map((line) => (
                <li key={line}>{line.replace(/^[•-]\s*/, "")}</li>
              ))}
          </ul>
        </details>
      ))}
      {portfolioData.education.length > 0 && (
        <div id="education">
          <h3 className="education-heading">{copy.education}</h3>
          <div className="education-grid">
            {portfolioData.education.map((education) => (
              <div
                key={`${education.institution}-${education.degree}`}
                className="education-item"
              >
                <span className="experience-date">{education.period}</span>
                <h4>{education.degree}</h4>
                <p>
                  {education.institution} · {education.location}
                </p>
                {education.description && (
                  <p>
                    {education.description
                      .replace(/^[•-]\s*/gm, "")
                      .split("\n")
                      .join(" · ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
