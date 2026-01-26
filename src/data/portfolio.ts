export const portfolioData = {
  personal: {
    name: "Rrezon",
    role: "Frontend Developer",
    tagline: "I Build Digital Experiences.",
    bio: "I am a passionate developer who specializes in building modern, responsive, and performant websites. I turn complex problems into simple, beautiful, and intuitive designs.",
    email: "rrezoncurraj10@gmail.com",
    github: "https://github.com/RrezonCurraj",
    linkedin: "https://www.linkedin.com/in/rrezon/",
  },
  skills: [
    { name: "Next.js", level: 50 },
    { name: "React", level: 70 },
    { name: "TypeScript", level: 40 },
    { name: "Tailwind CSS", level: 80 },
    { name: "Node.js", level: 50 },
    { name: "Express.js", level: 70 },
    { name: "PostgreSQL", level: 30 },
    { name: "Framer Motion", level: 50 },
    { name: "Swift", level: 30 },
    { name: "REST API", level: 50 },
    { name: "Adobe Photoshop", level: 90 },
    { name: "Adobe Illustrator", level: 90 },

  ],
  projects: [
    {
      title: "Hireon - AI Resume Analyzer",
      description: "Hireon is a modern web application that democratizes access to professional resume feedback using cutting-edge AI technology. Job seekers can upload their PDF resumes and receive instant, comprehensive analysis powered by Claude 3.7 Sonnet.",
      tech: ["React", "TypeScript", "Tailwind CSS", "Claude 3.7", "Zustand"],
      link: "https://ai-resumerr.vercel.app",
      github: "https://github.com/RrezonCurraj/ai-resume",
      image: "/projects/hireon.png",
    },
    {
      title: "HyperCast - Digital Subscription Platform",
      description: " Designed and developed a responsive frontend for a premium streaming service using a modern component-based architecture.",
      tech: ["React.js", "Tailwind CSS", "Vite", "Lucide React","Resend API",],
      link: "https://hypercastt.vercel.app/",
      github: "https://github.com/RrezonCurraj/HyperCast-Digital-Subscription-Platform/tree/portfolio",
      image: "/projects/hypercast.png",
    },
    {
      title: "FleurDeLiza - Modern Flower Shop Website",
      description: "A high-performance, elegant website for a Swiss boutique flower shop. Features a mobile-first design, custom gallery, and smooth animations to showcase floral arrangements.",
      tech: ["Next.js 15", "Tailwind CSS", "TypeScript", "EmailJS", "PostCSS", 'CSS3 Keyframes'],
      link: "https://fleurdeliza.vercel.app/",
      github: "https://github.com/RrezonCurraj/FleurdeLiza-Flower-Store",
      image: "/projects/fleurdeliza.png",
    },
    {
      title: "Maxi24 Corporate Website",
      description: "A responsive corporate portfolio for a Swiss construction company. Showcases craftsmanship through an interactive gallery and service overviews with a polished, mobile-first design.",
      tech: ["React 19", "Tailwind CSS", "Framer Motion", 'Vite', 'React Router v7'],
      link: "https://www.maxi24gmbh.ch/",
      github: "https://github.com/RrezonCurraj/Maxi24-GmbH",
      image: "/projects/maxi.png",
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
};
