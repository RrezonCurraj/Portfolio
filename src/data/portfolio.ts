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
      caseStudy: {
        role: "Solo. I handled UI design, component architecture, frontend development, and deployment.",
        problem:
          "Premium streaming and subscription platforms often feel visually generic — the same card grid, the same layout, the same washed-out UI that could be any SaaS product. I wanted to build something that actually felt premium: confident, dark, opinionated, and conversion-focused.",
        approach:
          "I started from the marketing angle, not the tech stack. What does a streaming platform look like when it prioritizes perceived value and trust? I designed the layout in iterations, focusing on hierarchy and whitespace first, then layered in the component structure. Vite gave me a fast dev loop while I tuned the visual details. Resend handled the waitlist/contact email flow server-side so leads didn't disappear into a mailto void.",
        decisions: [
          {
            title: "Vite over Next.js",
            body: "HyperCast is a pure marketing frontend — no dynamic routes, no SSR data requirements, no API layer. Next.js would've added complexity with zero benefit. Vite gave instant HMR and a lean build, keeping the focus on the UI rather than framework plumbing.",
          },
          {
            title: "Resend for the contact / waitlist flow",
            body: "A subscription platform with a mailto: link kills the illusion of being a real product. Resend's API let me wire up a proper form-to-inbox flow in under an hour with good deliverability, without needing a backend server or managing SMTP credentials.",
          },
          {
            title: "Component-driven architecture from day one",
            body: "I split every repeated UI pattern — pricing tiers, feature rows, hero variants — into composable components early on. This made iterating on the marketing copy and layout fast, and would make A/B testing straightforward if the project scaled.",
          },
        ],
        stack:
          "React.js for the component layer, Tailwind CSS for styling, Vite as the build tool, Lucide React for icons, and Resend API for transactional email. Deployed on Vercel.",
        outcome:
          "A polished, fast-loading frontend that reads as a real product rather than a portfolio exercise. The Resend integration means any contact form submission actually arrives somewhere actionable.",
        learnings:
          "Marketing copy and UI hierarchy matter as much as the component code. I spent as much time on heading weight, contrast ratios, and CTA placement as I did on the components themselves — and the result looks more professional for it.",
      },
    },
    {
      slug: "fleurdeliza",
      title: "FleurDeLiza - Modern Flower Shop Website",
      description: "A high-performance, elegant website for a Swiss boutique flower shop. Features a mobile-first design, custom gallery, and smooth animations to showcase floral arrangements.",
      tech: ["Next.js 15", "Tailwind CSS", "TypeScript", "EmailJS", "PostCSS", 'CSS3 Keyframes'],
      link: "https://fleurdeliza.vercel.app/",
      github: "https://github.com/RrezonCurraj/FleurdeLiza-Flower-Store",
      image: "/projects/fleurdeliza.png",
      metrics: [
        "Live Swiss client site",
        "Mobile-first, EmailJS bookings",
      ],
      caseStudy: {
        role: "Solo freelance. I handled client consultation, design direction, frontend development, and Vercel deployment.",
        problem:
          "The client — a boutique flower shop in Switzerland — had no web presence at all. Their business ran entirely on word of mouth and Instagram. They needed a site that looked premium enough to attract Swiss clientele, was easy to update without technical knowledge, and let customers make booking inquiries without a phone call.",
        approach:
          "I designed around the product itself — flowers. Lots of whitespace, rich photography, and soft motion to give the site an editorial feel. Mobile-first was a hard constraint since the client's customers browse on phones. I used CSS3 keyframe animations instead of a heavy animation library to keep load times tight and avoid hydration issues with Next.js 15. EmailJS handled inquiry routing so the client receives booking requests directly in her inbox without any backend infrastructure.",
        decisions: [
          {
            title: "Next.js 15 + TypeScript for a client site",
            body: "A flower shop doesn't need a framework — but Next.js 15's App Router gave me image optimization out of the box (critical for a gallery-heavy site), great SEO defaults, and Vercel deployment in minutes. TypeScript caught several prop mismatches during development that would have been runtime bugs on mobile.",
          },
          {
            title: "EmailJS over a custom backend",
            body: "The client had no server budget and no technical maintenance capacity. EmailJS let me wire up a working contact/booking form that sends directly to her inbox, with zero server dependency. If EmailJS breaks, the form breaks — but for a small business site, that's a better tradeoff than maintaining a Node server.",
          },
          {
            title: "CSS3 keyframes over a motion library",
            body: "I reached for CSS animations rather than Framer Motion or GSAP for the hero and gallery transitions. The animations are simple enough that a library would be overhead, and CSS animations don't add to the JS bundle — important for First Contentful Paint on mobile connections.",
          },
        ],
        stack:
          "Next.js 15 with App Router, TypeScript, Tailwind CSS for layout and utility styles, PostCSS for custom transforms, CSS3 keyframe animations, and EmailJS for booking inquiries. Live and deployed on Vercel.",
        outcome:
          "A live production site for a paying Swiss client. The site is the primary booking channel for the shop — customers now inquire via the contact form instead of Instagram DMs, and the client reports that the visual quality matches the premium positioning of her arrangements.",
        learnings:
          "Real client work teaches you what portfolio projects don't — that 'done and working reliably' beats 'technically impressive.' I optimized for maintainability and uptime over showcasing every tool I know. The client doesn't know what Next.js is; she just knows her bookings come in.",
      },
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
      caseStudy: {
        role: "Solo freelance. I handled requirements gathering, design, full frontend development, and deployment. The client owns the live domain (maxi24gmbh.ch).",
        problem:
          "Maxi24 GmbH is a Swiss construction company that had no digital presence beyond a phone number. In the Swiss construction market, credibility is everything — potential clients want to see past work, understand the services offered, and feel confident they're hiring a professional company before they make contact. A missing or low-quality website actively costs them business.",
        approach:
          "The core goal was credibility at first glance. I structured the site around their strongest asset — the quality of their physical work — using a gallery-first layout. Framer Motion handled scroll-triggered reveals to give the site energy without distraction. React Router v7 made multi-page navigation fast and clean with no full-page reloads, which improves the perceived quality of the experience on slower Swiss mobile networks.",
        decisions: [
          {
            title: "React + Vite over Next.js for a corporate brochure site",
            body: "Maxi24 doesn't need SSR or SEO-critical server rendering — it's a corporate contact site, not a blog. Vite gave a fast build pipeline and zero Next.js configuration overhead. React Router v7 handled multi-page routing client-side, keeping the bundle small and load times tight.",
          },
          {
            title: "Framer Motion for scroll animations",
            body: "Construction is a physical, tactile business. Animations that reveal work as you scroll give the gallery a feeling of weight and quality — like leafing through a portfolio book. Framer Motion's spring physics matched this better than CSS transitions would have, without requiring me to hand-tune easing curves.",
          },
          {
            title: "Mobile-first layout with high image density",
            body: "Swiss tradespeople browse on phones. I designed mobile first and used Next.js image optimization patterns (via manual srcset in Vite) to serve appropriate resolution images per viewport. The gallery loads fast even on 4G, which matters when a contractor is checking the site between jobs.",
          },
        ],
        stack:
          "React 19, Tailwind CSS, Framer Motion for animations, Vite as the build tool, and React Router v7 for client-side routing. Live at maxi24gmbh.ch, deployed on Vercel with a custom domain.",
        outcome:
          "A live production site under a custom Swiss domain for a paying client. The company now has a professional digital presence that matches the quality of their construction work. The site is the primary channel through which new clients reach them.",
        learnings:
          "Client communication is as important as technical skill. I ran three rounds of design feedback before writing a line of code, which meant zero major structural revisions during development. The design phase felt slow; the build phase was fast because of it.",
      },
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
