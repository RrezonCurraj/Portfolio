"use client";

import { portfolioData } from "@/data/portfolio";
import { Download, Mail, ExternalLink, Github, Linkedin, Briefcase, Code, User, GraduationCap } from "lucide-react";

export function RecruiterDashboard() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 pt-24 md:pt-32 pb-20 px-4 md:px-12 font-sans selection:bg-blue-200">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 pb-6 border-b border-zinc-200 gap-4">
          <div>
            <h1 className="text-4xl font-black text-zinc-900 mb-2">{portfolioData.personal.name}</h1>
            <p className="text-xl text-blue-600 font-semibold">{portfolioData.personal.role}</p>
          </div>
          <div className="flex gap-3">
            <a 
              href={`mailto:${portfolioData.personal.email}`}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-md font-medium text-sm transition-colors"
            >
              <Mail className="w-4 h-4" /> Email
            </a>
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-sm transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" /> Print / Save PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Summary & Skills */}
          <div className="lg:col-span-1 space-y-10">
            {/* Contact Details */}
            <section>
              <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <User className="w-4 h-4" /> Contact
              </h2>
              <div className="space-y-3 text-sm">
                <a href={`mailto:${portfolioData.personal.email}`} className="block hover:text-blue-600">{portfolioData.personal.email}</a>
                <a href={portfolioData.personal.linkedin} target="_blank" rel="noreferrer" className="flex items-center justify-between group hover:text-blue-600">
                  LinkedIn Profile <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <a href={portfolioData.personal.github} target="_blank" rel="noreferrer" className="flex items-center justify-between group hover:text-blue-600">
                  GitHub Profile <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </section>

            {/* Executive Summary */}
            <section>
              <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">Executive Summary</h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {portfolioData.personal.bio}
              </p>
            </section>

            {/* Core Competencies */}
            <section>
              <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Code className="w-4 h-4" /> Core Competencies
              </h2>
              <div className="flex flex-wrap gap-2">
                {portfolioData.skills.map((skill) => (
                  <span 
                    key={skill.name} 
                    className="px-2.5 py-1 bg-zinc-100 text-zinc-700 border border-zinc-200 rounded text-xs font-medium"
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
              <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2 border-b border-zinc-200 pb-2">
                <Briefcase className="w-5 h-5 text-blue-600" /> Professional Experience
              </h2>
              <div className="space-y-8">
                {portfolioData.experience.map((job, idx) => (
                  <div key={idx} className="relative pl-4 border-l-2 border-zinc-200">
                    <div className="absolute w-3 h-3 bg-white border-2 border-blue-600 rounded-full -left-[7px] top-1.5" />
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                      <h3 className="text-lg font-bold text-zinc-900">{job.role}</h3>
                      <span className="text-sm font-semibold text-blue-600">{job.period}</span>
                    </div>
                    <div className="text-md font-medium text-zinc-700 mb-3">{job.company}</div>
                    <ul className="space-y-2 text-sm text-zinc-600 list-none">
                      {job.description.split('\n').filter(Boolean).map((line, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-zinc-400">•</span>
                          <span>{line.replace(/^[•-]\s*/, '')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects */}
            <section>
              <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2 border-b border-zinc-200 pb-2">
                <GraduationCap className="w-5 h-5 text-blue-600" /> Technical Projects
              </h2>
              <div className="space-y-6">
                {portfolioData.projects.map((project, idx) => (
                  <div key={idx} className="bg-zinc-50 border border-zinc-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
                      <h3 className="text-lg font-bold text-zinc-900">{project.title}</h3>
                      <div className="flex gap-3 text-sm">
                        <a href={project.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                          Live <ExternalLink className="w-3 h-3" />
                        </a>
                        <a href={project.github} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                          Source <Github className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-600 mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span key={tech} className="px-2 py-0.5 bg-white border border-zinc-200 text-zinc-500 rounded text-xs font-medium">
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
