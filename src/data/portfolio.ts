export const portfolioData = {
  personal: {
    name: "Rrezon Curraj",
    role: "Frontend Developer",
    tagline: "I Build Digital Experiences.",
    bio: "I am a passionate developer who specializes in building modern, responsive, and performant websites. I turn complex problems into simple, beautiful, and intuitive designs.",
    email: "rrezoncurraj10@gmail.com",
    github: "https://github.com/RrezonCurraj",
    linkedin: "https://www.linkedin.com/in/rrezon/",
  },
  skills: [
    { name: "Next.js", level: 78 },
    { name: "React", level: 85 },
    { name: "TypeScript", level: 65 },
    { name: "Tailwind CSS", level: 92 },
    { name: "Node.js", level: 60 },
    { name: "Express.js", level: 68 },
    { name: "PostgreSQL", level: 38 },
    { name: "Framer Motion", level: 60 },
    { name: "Swift", level: 32 },
    { name: "REST API", level: 72 },
    { name: "Adobe Photoshop", level: 90 },
    { name: "Adobe Illustrator", level: 90 },
  ],
  projects: [
    {
      slug: "fibo",
      title: "Fibo - Strategic Brand Studio",
      description: "A bilingual, motion-led website for a strategic brand studio in Mexico. The experience combines editorial typography, interactive storytelling, and a spatial 3D portfolio while staying responsive and accessible.",
      tech: ["Next.js 15", "TypeScript", "Tailwind CSS", "next-intl", "GSAP", "Three.js"],
      link: "https://somosfibo.com/es",
      github: "https://github.com/RrezonCurraj/-fibo-website",
      image: "/projects/fibo.webp",
      metrics: [
        "Live bilingual client site",
        "3D WebGL gallery + motion system",
      ],
    },
    {
      slug: "hireon",
      title: "Hireon - AI Resume Analyzer",
      description: "Hireon is a modern web application that democratizes access to professional resume feedback using cutting-edge AI technology. Job seekers can upload their PDF resumes and receive instant, comprehensive analysis powered by Claude 3.7 Sonnet.",
      tech: ["React", "TypeScript", "Tailwind CSS", "Claude 3.7", "Zustand"],
      link: "https://ai-resumerr.vercel.app",
      github: "https://github.com/RrezonCurraj/ai-resume",
      image: "/projects/hireon.png",
      metrics: [
        "Solo build, end-to-end",
        "Claude 3.7 Sonnet integration",
        "Client-side PDF parsing",
      ],
      caseStudy: {
        role: "Solo. I handled design, frontend, AI integration, and deployment.",
        problem:
          "Most job seekers have no idea whether their CV will survive an ATS (Applicant Tracking System) filter. Professional review services cost between $50 and $200 per resume, so a lot of qualified candidates get silently rejected before a human ever sees their file.",
        approach:
          "I built a browser-based tool that parses the candidate's PDF on the client, extracts its text, and sends structured prompts to Claude 3.7 Sonnet for an ATS-aware review. Feedback comes back in categorized sections (formatting, keyword coverage, clarity, impact) so the user gets actionable edits instead of a generic score.",
        decisions: [
          {
            title: "Zustand over Redux / Context",
            body: "The app has a handful of cross-cutting pieces of state (uploaded file, parse result, analysis response, loading flags) and no server. Redux would be ceremony; prop-drilling through Context would re-render half the tree on every analysis update. Zustand gave me selector-based subscriptions in ~50 lines of boilerplate.",
          },
          {
            title: "Claude 3.7 Sonnet instead of a cheaper model",
            body: "Earlier Claude and GPT-3.5 class models produced generic 'make your resume stronger' feedback that felt worse than a Google search. Sonnet 3.7 was the first model I tested that consistently caught ATS-specific issues like missing keywords for the target role, odd column layouts, and inconsistent verb tenses.",
          },
          {
            title: "Parse the PDF in the browser",
            body: "Uploading the raw PDF to a server means handling storage, deletion, and privacy disclosures for a file that often contains a home address and phone number. Parsing client-side keeps the file on the user's machine. Only the extracted text goes to the model.",
          },
        ],
        stack:
          "React + TypeScript for the UI, Tailwind for styling, Zustand for state, pdf.js for in-browser PDF text extraction, Claude 3.7 Sonnet via the Anthropic API for the analysis step. Deployed on Vercel.",
        outcome:
          "I shipped it as a free tool. I used it on my own CV, and iterated on the prompts after watching where it gave weak feedback on real resumes from friends who tested it.",
        learnings:
          "Prompt design is the product. The difference between a 'meh' analyzer and a useful one was almost entirely in how I structured the system prompt and forced the model to return categorized, specific, rewrite-style suggestions instead of vague advice.",
      },
    },
    {
      slug: "hypercast",
      title: "HyperCast - Digital Subscription Platform",
      description: " Designed and developed a responsive frontend for a premium streaming service using a modern component-based architecture.",
      tech: ["React.js", "Tailwind CSS", "Vite", "Lucide React","Resend API",],
      link: "https://hypercastt.vercel.app/",
      github: "https://github.com/RrezonCurraj/HyperCast-Digital-Subscription-Platform/tree/portfolio",
      image: "/projects/hypercast.png",
      metrics: [
        "Component-driven architecture",
        "Resend-powered contact flow",
      ],
    },
    {
      slug: "maxi24",
      title: "Maxi24 Corporate Website",
      description: "A responsive corporate portfolio for a Swiss construction company. Showcases craftsmanship through an interactive gallery and service overviews with a polished, mobile-first design.",
      tech: ["React 19", "Tailwind CSS", "Framer Motion", 'Vite', 'React Router v7'],
      link: "https://www.maxi24gmbh.ch/",
      github: "https://github.com/RrezonCurraj/Maxi24-GmbH",
      image: "/projects/maxi.png",
      metrics: [
        "Live production client site",
        "React 19 + Framer Motion",
      ],
    },
  ],
  experience: [
    {
      company: "Freelance",
      role: "Frontend Developer",
      period: "06.2024 - Present",
      description: `• Delivering pixel-perfect, responsive websites for small businesses, ensuring high conversion rates and optimal user experience.
• Translating Figma designs into clean, semantic code using React, Next.js, and Tailwind CSS.
• Managing the full client lifecycle from initial consultation and requirements gathering to deployment and maintenance.
• Optimizing site performance and accessibility to meet modern web standards.`,
    },
    {
      company: "Demiraj Concepts",
      role: "Web Developer and Graphic Designer",
      period: "2022 - 2026",
      description: `• Engineered custom web solutions using React and WordPress, delivering high-performance and SEO-optimized sites.
• Spearheaded end-to-end branding initiatives, creating cohesive visual identities and marketing assets.
• Translated complex client requirements into polished, functional digital products.`,
    },
    {
      company: "StarLabs",
      role: "Web Developer (Internship)",
      period: "02.2024 - 04.2024",
      description: `• Built and optimized full-stack web applications using the MERN stack (MongoDB, Express, React, Node.js).
• Partnered with UI/UX teams to implement responsive, pixel-perfect interfaces.
• Diagnosed and resolved critical production bugs to improve application stability.
• Implemented RESTful APIs to support scalable data handling.`,
    },
  ],
  education: [
    {
      degree: 'Bachelor of Science (BSc) in Computer Science with Specialization in Software Design',
      institution: 'University of Prizren "Ukshin Hoti"',
      location: 'Prizren, Kosovo',
      period: '2019 - 2025',
      description: '• Bachelor Thesis: "Cloud Computing Usage Costs and Optimization"\n• Officially recognized by the ZAB as equivalent to a German Bachelor’s degree.',
    },
    {
      degree: 'Microsoft Azure Cloud',
      institution: 'Cacttus Education',
      location: 'Prizren, Kosovo',
      period: '11.2023 - 04.2024',
      description: '',
    },
    {
      degree: 'iOS Developer',
      institution: 'Rit Kosovo / Cactus Education',
      location: 'Prishtina, Kosovo',
      period: '05.2022 - 11.2022',
      description: '',
    },
    {
      degree: 'Graphic Designer',
      institution: 'UnitedPixels',
      location: 'Prishtina, Kosovo',
      period: '11.2020 - 02.2021',
      description: '',
    }
  ],
};
