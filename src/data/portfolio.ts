export interface CaseStudy {
  role: string;
  problem: string;
  approach: string;
  decisions: { title: string; body: string }[];
  stack: string;
  outcome: string;
  learnings: string;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  tech: string[];
  link: string;
  github: string;
  image: string;
  featured?: boolean;
  metrics?: string[];
  caseStudy?: CaseStudy;
}

interface PortfolioData {
  personal: {
    name: string;
    role: string;
    tagline: string;
    bio: string;
    email: string;
    github: string;
    linkedin: string;
  };
  about: { label: string; text: string }[];
  ticker: string[];
  skillGroups: { title: string; description: string; skills: string[] }[];
  projects: Project[];
  contributions: {
    project: string;
    repository: string;
    description: string;
    tech: string[];
    summary: string[];
    items: { number: number; title: string; description: string; status: string; link: string; proof: string }[];
  }[];
  experience: { company: string; role: string; period: string; description: string }[];
  education: { degree: string; institution: string; location: string; period: string; description: string }[];
}

export const portfolioData: PortfolioData = {
  personal: {
    name: "Rrezon Curraj",
    role: "Creative Frontend Developer",
    tagline: "I Build Digital Experiences.",
    bio: "I build motion-rich, accessible web experiences with React and Next.js, combining strong visual design with production-ready frontend engineering.",
    email: "rrezoncurraj10@gmail.com",
    github: "https://github.com/RrezonCurraj",
    linkedin: "https://www.linkedin.com/in/rrezon/",
  },
  about: [
    { label: "Analyzing core directives...", text: "With a passion for design and code, I bridge the gap between aesthetics and functionality." },
    { label: "Loading secondary protocols...", text: "I start every project with a clear goal: to create something that not only looks good but works perfectly." },
    { label: "Executing idle routines...", text: "When I'm not coding, you can find me exploring new technologies, contributing to open source, or designing user interfaces that delight users." },
  ],
  ticker: ["Available for work", "React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Node.js", "Based in GMT+1", "Open to remote"],
  skillGroups: [
    {
      title: "Core Expertise",
      description: "The tools I use to build responsive, production-ready interfaces.",
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    },
    {
      title: "Creative & Interaction",
      description: "Motion and visual craft that make digital products feel distinctive.",
      skills: ["GSAP", "Framer Motion", "Three.js", "Adobe Photoshop", "Adobe Illustrator"],
    },
    {
      title: "Supporting Technologies",
      description: "Backend and delivery tools I use when a product needs more than the interface.",
      skills: ["Node.js", "Express.js", "REST APIs", "PostgreSQL", "Drizzle ORM"],
    },
  ],
  projects: [
    {
      slug: "fibo",
      featured: true,
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
      caseStudy: {
        role: "Web design, frontend development, motion design, responsive implementation, and Spanish/English localization.",
        problem:
          "Fibo needed a website that expressed its brand identity and strategic process in both Spanish and English while making its publication work easy to explore.",
        approach:
          "The site uses Spanish-first localized routes, editorial sections, scroll-led storytelling, and a spatial portfolio gallery. The gallery has a static image-grid path for visitors who prefer reduced motion.",
        decisions: [
          {
            title: "Spanish-first routing",
            body: "next-intl keeps Spanish and English content in parallel message files. The default route leads to Spanish, while a locale control lets visitors switch to English.",
          },
          {
            title: "Load the 3D gallery when needed",
            body: "The WebGL gallery is a client-only dynamic import. A static grid preserves access to the publication links when reduced motion is preferred, avoiding a dependency on the 3D interaction for the content itself.",
          },
        ],
        stack:
          "Next.js App Router, TypeScript, Tailwind CSS, next-intl, GSAP, Framer Motion, and React Three Fiber.",
        outcome:
          "The bilingual website is live with localized content, responsive sections, a portfolio gallery, and contact and legal pages. No traffic or conversion figures are included here.",
        learnings:
          "The publication content remains available through a simpler presentation when the motion-heavy gallery is unsuitable.",
      },
    },
    {
      slug: "hireon",
      title: "Hireon - AI Resume Analyzer",
      description: "Hireon is a modern web application that democratizes access to professional resume feedback using cutting-edge AI technology. Job seekers can upload their PDF resumes and receive instant, comprehensive analysis powered by Claude 3.7 Sonnet.",
      tech: ["React", "TypeScript", "Tailwind CSS", "Claude 3.7", "Zustand"],
      link: "https://ai-resumerr.vercel.app",
      github: "https://github.com/RrezonCurraj/ai-resume",
      image: "/projects/hireon.webp",
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
      slug: "ntsh-beli",
      title: "Ntsh Beli - Electrical Distributor Platform",
      description: "A production marketing and product-catalog platform for an authorized electrical distributor in Kosovo. The Albanian-localized experience combines product discovery, installation projects, and quote and WhatsApp contact flows.",
      tech: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "Drizzle ORM", "PostgreSQL"],
      link: "https://ntshbeli.com/",
      github: "https://github.com/RrezonCurraj/Beli",
      image: "/projects/ntshbeli.webp",
      metrics: [
        "Searchable product catalog",
        "Quote + WhatsApp lead flows",
        "Admin + Drizzle/Postgres data layer",
      ],
      caseStudy: {
        role: "Website and catalog engineering, including product discovery, project galleries, and quote-request flows.",
        problem:
          "Ntsh Beli needed to show its electrical-product range and completed installations while giving professional buyers a direct way to request a quote for a specific item.",
        approach:
          "The Albanian site connects category, series, search, and product-detail pages to a quote dialog that carries product context. Visitors can also contact the team through WhatsApp, and project pages show installation photography.",
        decisions: [
          {
            title: "Separate product records from taxonomy",
            body: "Product records are read from Neon Postgres through Drizzle, while the category and series taxonomy remains in typed site data. React cache deduplicates product loading within a render.",
          },
          {
            title: "Keep quote failures visible",
            body: "The API validates quote submissions with Zod and reports email-delivery failures as errors, so the form does not claim a successful request when sending fails.",
          },
          {
            title: "Use project image folders",
            body: "Project galleries discover images from their server-side folders, so adding installation photos does not require editing the gallery component.",
          },
        ],
        stack:
          "Next.js 16, React 19, TypeScript, Tailwind CSS 4, Drizzle ORM, Neon Postgres, Zod, and Resend.",
        outcome:
          "The live site exposes product search, project pages, and product-aware quote and WhatsApp paths. The 70k+ figure on the business site describes the supplier range; it is not a count of searchable listings on this site.",
        learnings:
          "A product-aware contact path can connect catalog browsing to a practical sales inquiry without presenting the supplier's full range as indexed inventory.",
      },
    },
    {
      slug: "hypercast",
      title: "HyperCast - Digital Subscription Platform",
      description: "A responsive digital-subscription storefront with pricing, a PayPal checkout interface, and serverless contact and email endpoints.",
      tech: ["React 18", "Tailwind CSS 4", "Vite", "PayPal", "Resend"],
      link: "https://hypercastt.vercel.app/",
      github: "https://github.com/RrezonCurraj/HyperCast-Digital-Subscription-Platform/tree/portfolio",
      image: "/projects/hypercast.webp",
      metrics: [
        "Component-driven architecture",
        "Resend-powered contact flow",
      ],
      caseStudy: {
        role: "Storefront frontend and serverless email/contact endpoint implementation.",
        problem:
          "The storefront needed to explain subscription plans, collect a customer email, present checkout, and route support messages through a single responsive interface.",
        approach:
          "A React storefront presents plans and an order modal. The modal renders PayPal buttons, while Vercel functions handle order emails and support submissions. The support form uses reCAPTCHA before sending.",
        decisions: [
          {
            title: "Keep checkout steps in one modal",
            body: "The order interface moves from email entry to payment and a completion view, keeping plan context visible through the flow.",
          },
          {
            title: "Use serverless email routes",
            body: "Resend calls run in API functions rather than the browser. The support route verifies a reCAPTCHA token before sending its message.",
          },
        ],
        stack:
          "React 18, Vite, Tailwind CSS 4, React Router, PayPal Buttons, reCAPTCHA, and Vercel functions using Resend.",
        outcome:
          "The source includes pricing, checkout UI, and contact and email flows. A successful live payment or automatic fulfillment was not independently verified for this case study.",
        learnings:
          "Payment capture shown in the client is separate from server-side transaction verification; the case study does not present email delivery as proof of a verified purchase.",
      },
    },
    {
      slug: "maxi24",
      title: "Maxi24 Corporate Website",
      description: "A responsive corporate portfolio for a Swiss construction company. Showcases craftsmanship through an interactive gallery and service overviews with a polished, mobile-first design.",
      tech: ["React 19", "Tailwind CSS", "Framer Motion", 'Vite', 'React Router v7'],
      link: "https://www.maxi24gmbh.ch/",
      github: "https://github.com/RrezonCurraj/Maxi24-GmbH",
      image: "/projects/maxi.webp",
      metrics: [
        "Live production client site",
        "React 19 + Framer Motion",
      ],
      caseStudy: {
        role: "Corporate website design and frontend development for Maxi24 GmbH.",
        problem:
          "The construction company needed a site that presents its services and lets prospective customers inspect completed work beyond a single homepage image.",
        approach:
          "The site combines service sections with project cards and dedicated project-detail routes. Each detail page pairs a description with a photo gallery and lightbox.",
        decisions: [
          {
            title: "Keep project details in one data source",
            body: "Titles, locations, descriptions, and gallery images are defined in a project data file and rendered by the same detail-page component.",
          },
          {
            title: "Support lightbox navigation",
            body: "The open gallery supports Escape and arrow-key navigation as well as visible previous, next, and close controls. The image thumbnails themselves still need keyboard-trigger review.",
          },
        ],
        stack:
          "React 19, Vite, Tailwind CSS, React Router 7, and Framer Motion.",
        outcome:
          "The corporate site is live with service information and project-detail galleries. No lead or performance figures are included here.",
        learnings:
          "A shared project-detail component makes it practical to expand the portfolio through structured content and image sets.",
      },
    },
  ],
  contributions: [
    {
      project: "Codenotch",
      repository: "https://github.com/vinzdg/codenotch",
      description:
        "An open-source macOS utility that keeps usage limits for AI coding tools visible at the edge of the screen. I contributed fixes across window geometry, local code signing, display selection, and regression coverage.",
      tech: ["Swift", "AppKit", "SwiftUI", "XCTest", "Shell", "GitHub Actions"],
      summary: [
        "2 pull requests merged upstream",
        "2 fixes shipped in v1.7.0",
        "1 feature shipped in v1.6.0",
      ],
      items: [
        {
          number: 59,
          title: "Keep the Settings control onscreen while dragging",
          description:
            "Fixed edge-clamping geometry so the only visible Settings handle cannot be dragged beyond the display bezel. Added regression coverage for every screen edge and secondary displays with non-zero origins.",
          status: "Shipped in v1.7.0",
          link: "https://github.com/vinzdg/codenotch/pull/59",
          proof: "43 additions · 4 files · 754 tests passed",
        },
        {
          number: 58,
          title: "Make local signing fall back safely",
          description:
            "Traced contributor build failures to orphaned Apple Development certificates and changed signing detection to require a valid identity. Added a shell regression suite and wired it into CI.",
          status: "Shipped in v1.7.0",
          link: "https://github.com/vinzdg/codenotch/pull/58",
          proof: "63 additions · 3 files · 753 tests passed",
        },
        {
          number: 28,
          title: "Allow the notch to stay on a chosen display",
          description:
            "Designed display pinning around persistent macOS display UUIDs, including active-display fallback and automatic return after reconnection. The maintainer reworked the patch to project conventions and shipped the behavior in Codenotch 1.6.0 with contributor credit.",
          status: "Shipped in v1.6.0",
          link: "https://github.com/vinzdg/codenotch/pull/28",
          proof: "178 additions · 8 files · 557 tests passed",
        },
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
