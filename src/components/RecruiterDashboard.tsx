"use client";

import { portfolioData } from "@/data/portfolio";
import { Download, Mail, ExternalLink, Github, Briefcase, Code, User, GraduationCap, Layers } from "lucide-react";

export function RecruiterDashboard() {
  return (
    <div className="min-h-screen bg-background px-4 pt-24 pb-20 font-sans text-foreground selection:bg-primary/30 md:px-12 md:pt-32">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Actions */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="mb-2 text-4xl font-black text-foreground">{portfolioData.personal.name}</h1>
            <p className="text-xl font-semibold text-primary">{portfolioData.personal.role}</p>
          </div>
          <div className="flex gap-3">
            <a 
              href={`mailto:${portfolioData.personal.email}`}
              className="flex items-center gap-2 rounded-md bg-surface px-4 py-2 text-sm font-medium text-muted-strong transition-colors hover:bg-surface-muted"
            >
              <Mail className="w-4 h-4" /> Email
            </a>
            <a 
              href="/Rrezon_Curraj_CV.pdf"
              download="Rrezon_Curraj_CV.pdf"
              className="flex items-center gap-2 rounded-md border border-control bg-accent px-4 py-2 text-sm font-medium text-accent-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              <Download className="w-4 h-4" /> Download CV
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Summary & Skills */}
          <div className="lg:col-span-1 space-y-10">
            {/* Contact Details */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-muted uppercase tracking-wider">
                <User className="w-4 h-4" /> Contact
              </h2>
              <div className="space-y-3 text-sm">
                <a href={`mailto:${portfolioData.personal.email}`} className="block hover:text-primary">{portfolioData.personal.email}</a>
                <a href={portfolioData.personal.linkedin} target="_blank" rel="noreferrer" className="group flex items-center justify-between hover:text-primary">
                  LinkedIn Profile <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <a href={portfolioData.personal.github} target="_blank" rel="noreferrer" className="group flex items-center justify-between hover:text-primary">
                  GitHub Profile <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </section>

            {/* Executive Summary */}
            <section>
              <h2 className="mb-4 text-sm font-bold text-muted uppercase tracking-wider">Executive Summary</h2>
              <p className="text-sm leading-relaxed text-muted">
                {portfolioData.personal.bio}
              </p>
            </section>

            {/* Core Competencies */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-muted uppercase tracking-wider">
                <Code className="w-4 h-4" /> Core Competencies
              </h2>
              <div className="flex flex-wrap gap-2">
                {portfolioData.skills.map((skill) => (
                  <span 
                    key={skill.name} 
                    className="rounded border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted-strong"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Experience & Projects */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Experience */}
            <section>
              <h2 className="mb-6 flex items-center gap-2 border-b border-border pb-2 text-xl font-bold text-foreground">
                <Briefcase className="w-5 h-5 text-primary" /> Professional Experience
              </h2>
              <div className="space-y-8">
                {portfolioData.experience.map((job, idx) => (
                  <div key={idx} className="relative border-l-2 border-border pl-4">
                    <div className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background" />
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                      <h3 className="text-lg font-bold text-foreground">{job.role}</h3>
                      <span className="text-sm font-semibold text-primary">{job.period}</span>
                    </div>
                    <div className="text-md mb-3 font-medium text-muted-strong">{job.company}</div>
                    <ul className="list-none space-y-2 text-sm text-muted">
                      {job.description.split('\n').filter(Boolean).map((line, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-muted">•</span>
                          <span>{line.replace(/^[•-]\s*/, '')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section>
              <h2 className="mb-6 flex items-center gap-2 border-b border-border pb-2 text-xl font-bold text-foreground">
                <GraduationCap className="w-5 h-5 text-primary" /> Education & Training
              </h2>
              <div className="space-y-8">
                {portfolioData.education?.map((edu, idx) => (
                  <div key={idx} className="relative border-l-2 border-border pl-4">
                    <div className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background" />
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                      <h3 className="text-lg font-bold text-foreground">{edu.degree}</h3>
                      <span className="text-sm font-semibold text-primary">{edu.period}</span>
                    </div>
                    <div className="text-md mb-3 font-medium text-muted-strong">{edu.institution} <span className="text-sm font-normal text-muted">| {edu.location}</span></div>
                    {edu.description && (
                      <ul className="list-none space-y-2 text-sm text-muted">
                        {edu.description.split('\n').filter(Boolean).map((line, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-muted">•</span>
                            <span>{line.replace(/^[•-]\s*/, '')}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Projects */}
            <section>
              <h2 className="mb-6 flex items-center gap-2 border-b border-border pb-2 text-xl font-bold text-foreground">
                <Layers className="w-5 h-5 text-primary" /> Technical Projects
              </h2>
              <div className="space-y-6">
                {portfolioData.projects.map((project, idx) => (
                  <div key={idx} className="rounded-lg border border-border bg-surface/40 p-5 transition-colors hover:border-border-strong">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
                      <h3 className="text-lg font-bold text-foreground">{project.title}</h3>
                      <div className="flex gap-3 text-sm">
                        <a href={project.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                          Live <ExternalLink className="w-3 h-3" />
                        </a>
                        <a href={project.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                          Source <Github className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                    <p className="mb-4 text-sm text-muted">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span key={tech} className="rounded border border-border-strong bg-surface px-2 py-0.5 text-xs font-medium text-muted-strong">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>
        
      </div>
      
      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          .max-w-5xl, .max-w-5xl * { visibility: visible; }
          .max-w-5xl { position: absolute; left: 0; top: 0; width: 100%; }
          nav, button { display: none !important; }
        }
      `}} />
    </div>
  );
}
