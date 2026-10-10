import { portfolioCopy, portfolioData } from "@/data/portfolio";

export function Skills() {
  const copy = portfolioCopy.skills;
  return (
    <section id="skills" className="section-shell skills-section">
      <div className="subsection-heading">
        <h2><span className="desktop-copy">{copy.title}</span><span className="compact-copy">{portfolioCopy.mobile.skills}</span></h2>
        <p>{copy.intro}</p>
      </div>
      {portfolioData.skillGroups.map((group) => (
        <div key={group.title} className="skill-row">
          <h3>{group.title}</h3>
          <ul>
            {group.skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
