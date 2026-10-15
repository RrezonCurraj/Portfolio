import { portfolioCopy, portfolioData } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Timeline } from "@/components/ui/Timeline";
import profileImage from "@/images/profile.png";

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
      <Timeline
        title={portfolioData.personal.role}
        periodLabel={copy.timelinePeriod}
        label={copy.timelineLabel}
        hint={copy.timelineHint}
        image={profileImage}
        imageAlt={portfolioCopy.about.photoAlt}
        items={[...portfolioData.experience].sort((a, b) => a.startDate.localeCompare(b.startDate)).map(job => ({
          id: `${job.company}-${job.startDate}`, title: job.company, role: job.role,
          period: job.period, description: job.description,
        }))}
      />
      {portfolioData.education.length > 0 && (
        <section id="education" aria-labelledby="education-heading">
          <h3 id="education-heading" className="education-heading">{copy.education}</h3>
          <Timeline
            title={copy.educationTimelineTitle}
            periodLabel={copy.educationTimelinePeriod}
            label={copy.educationTimelineLabel}
            hint={copy.educationTimelineHint}
            headingLevel={4}
            items={[...portfolioData.education].sort((a, b) => a.startDate.localeCompare(b.startDate)).map(entry => ({
              id: `${entry.institution}-${entry.startDate}`, title: entry.degree,
              role: `${entry.institution} · ${entry.location}`,
              period: entry.period, description: entry.description,
            }))}
          />
        </section>
      )}
    </section>
  );
}
