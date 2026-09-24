# Rrezon Curraj | Frontend portfolio

[Live site](https://www.rrezon.dev)

A Next.js portfolio with an interactive presentation, a compact recruiter view, and a project case study. Project and profile content lives in [`src/data/portfolio.ts`](src/data/portfolio.ts).

## Engineering decisions

| Decision | Reason and implementation |
| --- | --- |
| Delay the 3D hero background | The hero renders text and links first. On desktop, [`Hero.tsx`](src/components/Hero.tsx) loads the React Three Fiber background after pointer or scroll activity, or after 2.5 seconds. It uses a CSS grid effect on coarse pointers and narrow screens. |
| Pause work outside the viewport | An `IntersectionObserver` in `Hero.tsx` changes the canvas frame loop to `never` when the hero leaves view. [`ThreeBackground.tsx`](src/components/ThreeBackground.tsx) also caps device pixel ratio at 1.5 and uses 1,000 particles. |
| Respect reduced motion | [`prefersReducedMotion`](src/lib/motion.ts) prevents the hero background and several GSAP effects from starting. [`SmoothScroll.tsx`](src/components/SmoothScroll.tsx) skips Lenis, leaving native scrolling in place. CSS also contains a reduced-motion media query. |
| Keep project content separate from rendering | The homepage sections and case-study route read from `src/data/portfolio.ts`. The route generates pages only for projects with case-study data. |
| Provide two reading modes | [`PageContent.tsx`](src/components/PageContent.tsx) switches between the animated portfolio and [`RecruiterDashboard.tsx`](src/components/RecruiterDashboard.tsx), which presents the same portfolio data in a compact format. |

These are implementation choices, not measured performance or accessibility scores. The app includes Vercel Analytics and Speed Insights in the root layout; use those and a fresh browser audit to evaluate the deployed site.

## Stack

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, GSAP, React Three Fiber, and Lenis. The contact route uses Resend when `RESEND_API_KEY` is configured.

## Run locally

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>. To exercise the contact form, set `RESEND_API_KEY` in `.env.local`; without it, the API returns HTTP 503.

## Verification

```bash
npm test -- --runInBand
npm run lint
npm run build
```

Jest and React Testing Library cover selected component behavior and utilities. A passing test suite does not establish browser performance or accessibility compliance.

The [verification workflow](.github/workflows/verify.yml) runs these commands on pushes and pull requests. The component tests cover hero canvas pausing, reduced-motion scrolling, skills content, and utility behavior; they do not replace a browser audit.

## Case studies

The [Hireon case study](https://www.rrezon.dev/projects/hireon) describes its problem, trade-offs, implementation, and outcome. Case-study content is maintained alongside project data in `src/data/portfolio.ts`.

## Performance and accessibility evidence

The 3D background is delayed, capped at 1.5 device pixel ratio, and paused outside the hero viewport. Reduced-motion handling is covered by the scrolling test and implemented for the hero and CSS ticker. These checks verify specific behavior; no Lighthouse score, Core Web Vitals result, or full accessibility audit is published in this repository.
