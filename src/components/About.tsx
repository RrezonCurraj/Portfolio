import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { portfolioCopy, portfolioData } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import profileImage from "@/images/profile.png";

export function About() {
  const copy = portfolioCopy.about;
  return (
    <section
      id="about"
      className="section-shell content-section divided-section"
    >
      <SectionHeading number={copy.number} title={copy.title} />
      <div className="about-grid">
        <div className="about-copy">
          <h3 className="about-title">{copy.heading}</h3>
          {portfolioData.about.map((item) => (
            <p key={item.label}>{item.text}</p>
          ))}
          <a href="/Rrezon_Curraj_CV.pdf" download className="text-link">
            {copy.cv}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
        <figure className="profile-photo">
          <div className="profile-image">
            <Image
              src={profileImage}
              alt={copy.photoAlt}
              fill
              sizes="(max-width: 767px) 280px, (max-width: 1050px) 220px, 300px"
            />
          </div>
          <figcaption>{copy.caption}</figcaption>
        </figure>
      </div>
    </section>
  );
}
