# Mobile Portfolio Implementation Plan

> Execute this plan task by task. Use the checkboxes to track implementation and verification.

**Goal:** Give phone visitors a projects-first portfolio with persistent Work / About / Contact top navigation and a clear route through the background and contact content.

**Architecture:** Keep one scrolling document and the existing section IDs. Separate compact navigation from the desktop rail, share a compact-layout query across client behavior, and use accessible responsive disclosures for long background details. Reuse the existing content, contact flow, GSAP/Lenis setup, and case-study routes.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, GSAP/ScrollTrigger, Lenis, and the existing Jest/React Testing Library setup.

**Spec:** [Mobile portfolio structure](../specs/2026-10-10-mobile-portfolio-design.md)

## Global Constraints

- Use the compact layout below 768px. Also use it on touch landscape screens up to 1024px wide and 500px high, where the desktop rail would crowd the content. Keep CSS and motion breakpoint conditions consistent.
- Keep all five projects, current project order and images, case-study routes, personal information, background records, and contact functionality.
- Make changes in the existing components and data source without adding dependencies or maintaining a second copy of the portfolio.
- Keep the Paper visual style and the current desktop rail and scroll animation.
- Keep the existing desktop navigation data intact. Add separate mobile navigation/grouping data in `src/data/portfolio.ts` rather than reducing the desktop rail to three items.
- Navigation and primary actions have at least 44px touch targets. Editable fields retain 16px text. Put all new visitor-facing copy in `src/data/portfolio.ts`.
- Use named exports and `@/` imports. Client components must declare `"use client"`. Clean up listeners, observers, and animation contexts.
- Commit with the configured Git name and email. Use plain commit messages without extra attribution or trailers. Do not push as part of planning.

## Review Focus

1. A touch phone rotated into landscape must keep compact navigation and stop hidden rail animation; Task 1 tests and Task 4 browser checks own this boundary.
2. A visitor entering a background hash or returning through history must see the revealed destination below the sticky header; Task 3 owns revelation, scrolling, and focus checks.
3. Opening resume view must not leave section links pointing at the wrong content order; Task 1 owns mode-transition checks.
4. A future project without a case study must retain a working primary destination and its available details; Task 2 owns this fixture.
5. Rotation while a disclosure contains focus must preserve focus and the visitor's compact expansion choices; Task 3 owns disclosure lifecycle tests.

## File responsibilities

| File | Responsibility |
| --- | --- |
| `src/lib/useCompactLayout.ts` (new) | Shared compact media query and a subscribing layout hook. |
| `src/components/MobileNavigation.tsx` (new) | Presentational, three-link top navigation. |
| `src/components/Navbar.tsx` | Measured sticky header, secondary menu, section tracking, resume-mode handling, and rail visibility. |
| `src/components/RailNavigation.tsx` | Gate GSAP setup with the shared compact condition while retaining the desktop timeline. |
| `src/data/portfolio.ts` | Mobile navigation groups, labels, heading names, and Work contact prompt. |
| `src/components/Hero.tsx`, `Projects.tsx`, `ui/SectionHeading.tsx` | Compact intro and clear project/section hierarchy. |
| `src/components/ui/ResponsiveDisclosure.tsx` (new) | One native disclosure tree with compact state, desktop expansion, and focus-safe resizing. |
| `src/components/About.tsx`, `Skills.tsx`, `Experience.tsx`, `Contributions.tsx` | Background hierarchy, portrait placement, and disclosure integration. |
| `src/lib/scroll.ts`, `SmoothScroll.tsx`, `CommandPalette.tsx` | Shared destination revelation, hash/history coordination, scrolling, and deliberate focus. |
| `src/app/globals.css` | Scoped compact layout, navigation geometry, responsive content order, and disclosure presentation. |
| Existing and new component tests | Regression checks for navigation, link destinations, and disclosure behavior. |

---

### Task 1: Persistent compact top navigation

**Files:** Create `src/lib/useCompactLayout.ts`, `src/lib/useCompactLayout.test.tsx`, `src/components/MobileNavigation.tsx`. Modify `src/data/portfolio.ts`, `src/components/Navbar.tsx`, `src/components/Navbar.test.tsx`, `src/components/RailNavigation.tsx`, `src/components/Experience.tsx`, and `src/app/globals.css`.

**Interfaces:**

- Export `COMPACT_LAYOUT_QUERY = "(max-width: 767px), (max-width: 1024px) and (max-height: 500px) and (pointer: coarse)"` and `useCompactLayout(): boolean` from `src/lib/useCompactLayout.ts`.
- Add `portfolioCopy.mobile.navigation`: Work has `id: "projects"`, members `home/projects`; About has `id: "about"`, members `about/skills/experience/education/contributions`; Contact has `id: "contact"`, member `contact`. Preserve `portfolioCopy.navigation`.
- Give the persistent row the data label `Mobile sections` and the secondary menu the distinct data label `Additional navigation`, so the two navigation landmarks can be identified independently.
- Export `MobileNavigation({ items, activeId }: { items: readonly { id: string; label: string }[]; activeId: string }): React.JSX.Element`. Render native anchors and mark only the matching link with `aria-current="location"`.
- Navbar sets `--sticky-header-height` on the home shell using a header `ResizeObserver`; compact section offsets use `calc(var(--sticky-header-height) + 12px)`.
- Add stable `id="education"` to a container around the existing education heading/grid for its menu destination. Task 3 will attach disclosure ownership without moving that ID inside hidden content.

- [x] **Step 1: Add behavioral regression cases.** In Navbar tests, mock the compact query and section positions. Scroll through home, projects, skills, experience, contributions, and contact; assert active Work/About/Contact grouping. Assert menu selection closes it, Escape returns focus, secondary actions remain available, and resume mode removes grouped links while exposing Back to portfolio. Assert the desktop rail trigger is absent for a compact touch landscape and present again outside compact mode. In hook tests, emit a media change and assert updates/unsubscription on unmount.
- [x] **Step 2: Run the focused tests and confirm new behavior fails.** Run `npm test -- --runInBand src/components/Navbar.test.tsx src/lib/useCompactLayout.test.tsx`. Expected initially: missing compact hook/navigation or incorrect grouped active states; existing desktop tests must remain recognizable.
- [x] **Step 3: Implement the compact hook and navigation.** Keep the hook's server snapshot safe; subscribe to media changes and clean up. Navbar selects tracking candidates from mobile member IDs in compact portfolio mode and from the unchanged desktop navigation otherwise, so nested education cannot become a desktop active ID. Map only compact portfolio navigation into the three groups. Use the actual header reading offset in compact mode, the current desktop threshold otherwise, and Contact at document bottom.
- [x] **Step 4: Integrate header, menu, and animation gating.** Show wordmark/Menu plus the three-link row in compact portfolio mode. Move CV, theme, resume, and background subsection actions into Menu. Hide compact rail DOM from layout and focus; gate GSAP with `COMPACT_LAYOUT_QUERY`, including touch landscape. Use the identical CSS media condition, remove compact right margin, and retain desktop styles. Disconnect header observation and remove its CSS variable on unmount. Close Menu on mode changes and destination selection; preserve the existing PageContent focus reset when changing modes.
- [x] **Step 5: Run focused tests and a responsive smoke check.** Repeat Step 2, then inspect 390 x 844, touch 932 x 430, and fine-pointer 1440 x 1000. Expected: one visible three-link compact navigation, matching active states, no hidden rail trigger on the touch phone, and the original rail on desktop.
- [x] **Step 6: Commit this deliverable.** Stage only Task 1 files; commit `Add persistent mobile section navigation` with the configured identity.

### Task 2: Projects-first mobile content

**Files:** Modify `src/components/Hero.tsx`, `src/components/Hero.test.tsx`, `src/components/Projects.tsx`, `src/components/ui/SectionHeading.tsx`, `src/components/About.tsx`, `src/components/Skills.tsx`, `src/components/Experience.tsx`, `src/components/Contributions.tsx`, `src/data/portfolio.ts`, and `src/app/globals.css`. Create `src/components/Projects.test.tsx`.

**Interfaces:**

- Extend `SectionHeading` with `compactTitle?: string`; its existing `number`, `title`, and `description` props remain compatible. Responsive label spans must expose only the visible heading to assistive technology.
- Add compact copy: `View work`, `View project`, `About`, `Toolkit`, `Experience`, `Open source`, and `Have a project? Let’s talk`. Keep existing desktop labels.
- Project markup has identity, summary, actions, and stack regions. CSS preserves the existing desktop visual arrangement while compact order is title/category, summary, primary action. Preview and primary action share the same destination.

- [x] **Step 1: Add project destination regression cases.** Render the real projects and assert five previews/actions lead to their corresponding case studies. Add a fixture without `caseStudy`; assert its primary destination is the live site, with external-link protection, and its source/technology information remains available. Retain Hero's existing accessible role heading, complete bio, and desktop CV assertions.
- [x] **Step 2: Run the focused tests and confirm the new project action/fallback assertions fail.** Run `npm test -- --runInBand src/components/Projects.test.tsx src/components/Hero.test.tsx`. Expected initially: missing View project action or its compact fallback contract.
- [x] **Step 3: Restructure the intro and project card regions.** Preserve all content values and desktop actions. Use CSS to tighten the compact role, spacing, and bio block, expose View work, and move compact CV access into the existing Menu. Hide the redundant compact hero footnote. Present one compact project action after its summary; show card live/source/stack details on desktop and also on compact cards without a case-study destination. Existing case studies already carry those details.
- [x] **Step 4: Apply compact hierarchy and contact access.** Use clear compact heading names; place the smaller portrait near the About bio without changing its image/alt text. Keep toolkit content expanded. Add the contact prompt inside the end of Work. Stack compact contact inputs through CSS; leave the Contact submit/validation logic unchanged.
- [x] **Step 5: Verify tests and actual geometry.** Repeat Step 2 and run existing Skills/Contact tests. In the browser, verify the first Fibo preview appears on the opening 390 x 844 and 430 x 932 screens at standard text size. Check 320px/short-screen readability, full bio and project access, compact action order, and unchanged 1440px featured/grid layout. Adjust spacing rather than clipping content or enforcing viewport heights.
- [x] **Step 6: Commit this deliverable.** Stage only Task 2 files; commit `Simplify mobile project browsing`.

### Task 3: Background disclosures and reliable destinations

**Files:** Create `src/components/ui/ResponsiveDisclosure.tsx`, `src/components/ui/ResponsiveDisclosure.test.tsx`, and `src/lib/scroll.test.ts`. Modify `src/components/Experience.tsx`, `src/components/Contributions.tsx`, `src/components/SmoothScroll.tsx`, `src/components/SmoothScroll.test.tsx`, `src/components/CommandPalette.tsx`, `src/components/CommandPalette.test.tsx`, `src/lib/scroll.ts`, and `src/app/globals.css`.

**Interfaces:**

- Export `ResponsiveDisclosure({ anchorId, title, desktopHeading, headingLevel = 2, children, className }: { anchorId: string; title: string; desktopHeading: React.ReactNode; headingLevel?: 2 | 3; children: React.ReactNode; className?: string }): React.JSX.Element`.
- The native `<details>` root carries `data-mobile-anchor={anchorId}`. This associates it with a stable outer destination without creating duplicate IDs. Its compact summary renders the requested heading level; its desktop heading appears inside the expanded content. Children render once.
- Export `navigateToSection(id: string, options?: { history?: "push" | "none"; focus?: boolean; behavior?: "smooth" | "instant" }): Promise<boolean>` from `src/lib/scroll.ts`. Defaults are push history, deliberate focus, and smooth movement unless reduced motion applies. Return false for missing targets, true when navigation is dispatched.
- Retain `scrollImmediately(top: number)` and `IMMEDIATE_SCROLL_EVENT` unchanged for the ruler. Add `SECTION_SCROLL_EVENT = "portfolio:section-scroll"` and `SectionScrollRequest = { target: HTMLElement; offset: number; immediate: boolean; onComplete: () => void }` for SmoothScroll's engine adapter.

- [x] **Step 1: Add disclosure lifecycle tests.** Assert education/open-source compact disclosures start collapsed unless the current hash requires them, desktop expands them, compact choices survive compact→desktop→compact, native toggles retain summary focus, and a panel containing focus does not collapse on layout changes. Assert owned destination revelation opens the outer disclosure while leaving unrelated job/contribution details closed. Restore media mocks and remove listeners after each test.
- [x] **Step 2: Add destination and integration regression cases.** Assert a target inside nested details opens all required ancestors before scroll geometry is measured. Cover an outer `#contributions` target, encoded IDs, malformed hashes, missing IDs, initial hashes, browser history restoration, reduced motion, and focus only for deliberate navigation. Existing modified/download/external anchor clicks must still bypass interception. CommandPalette must use the same destination helper for background targets.
- [x] **Step 3: Run the new focused tests and confirm failure on missing disclosure/revelation behavior.** Run `npm test -- --runInBand src/components/ui/ResponsiveDisclosure.test.tsx src/lib/scroll.test.ts src/components/SmoothScroll.test.tsx src/components/CommandPalette.test.tsx`.
- [x] **Step 4: Implement responsive native disclosure ownership.** Consume Task 1's compact hook. Keep independent compact expansion state, synchronize with native toggle events, and preserve open panels that contain keyboard focus or the current hash destination. Expand outside compact mode without overwriting compact choices. Wrap the education grid and the open-source article content; retain all records and existing inner contribution/job accordions. Make desktop summaries disappear only while their content is expanded and their original headings are visible.
- [x] **Step 5: Implement shared reveal/scroll/focus coordination.** Resolve decoded IDs with `getElementById`, never a fragment-derived CSS selector. Reveal owned wrappers and enclosing native details, synchronize their toggle state, then await committed layout before reading geometry. Push an encoded fragment only for deliberate navigation. Dispatch the cancelable section-scroll request with computed `scrollMarginTop`; if no engine handles it, use native scrolling. Focus a deliberate destination with a temporary `tabindex="-1"` and preventScroll, restoring the previous attribute afterward.
- [x] **Step 6: Integrate engines, hashes, and command navigation.** SmoothScroll's Lenis listener handles the section-scroll request and calls its completion callback; reduced motion keeps destination coordination active with native immediate scrolling. Coordinate initial hash, hashchange, and popstate without adding history entries or stealing focus. Coalesce overlapping history notifications and cancel pending work/listeners on unmount. Bare fragment clicks use the same helper after the current click exclusions; cross-route `/#projects` remains a Next link with initial destination correction after mount. Replace CommandPalette's direct `scrollIntoView` path with the helper. Reuse the existing body ResizeObserver to refresh ScrollTrigger after expansion.
- [x] **Step 7: Verify focused tests and deep-link behavior.** Repeat Step 3. Browser-check `/#education`, `/#contributions`, Back/Forward after menu jumps, case-study Back to work, command-palette navigation, and all paths with reduced motion. Rotate with a focused disclosure descendant; expect no focus loss or unexpected state reset. Check that opening a background panel keeps About active and refreshes the desktop rail geometry.
- [x] **Step 8: Commit this deliverable.** Stage only Task 3 files; commit `Keep mobile background details and anchors accessible`.

### Task 4: Final layout verification and review

**Files:** All changed source/test files above; this plan's checkboxes. Save screenshots and any temporary browser scripts outside the repository.

**Interfaces:** Consume the shipped compact navigation, project action, disclosure, and destination contracts. Produce a verified feature branch and a concise summary of evidence and any limitations.

- [x] **Step 1: Run the repository checks.** Run `npm run build`, `npm run lint`, and `npm test -- --runInBand`. Expected: successful production build, zero lint errors, all tests passing. Repair failures before browser sign-off; do not install a second test framework.
- [x] **Step 2: Verify portrait and content scaling.** Inspect 320/375/390/430px widths, including 390 x 844 and 430 x 932. Check opening Work preview, all five cards, navigation active states, contact prompt, background details, and stacked contact fields. At 200% text zoom and short heights, check readable reflow and access to every action with no horizontal overflow, duplicate IDs, hidden focus targets, or clipped labels.
- [x] **Step 3: Verify device and breakpoint transitions.** Check touch 844 x 390, 932 x 430, and 1024 x 500; 767/768px and 1024/1025px boundaries; corresponding fine-pointer layouts; a taller 1024px tablet; and 1440px desktop. Verify compact rail triggers are absent and desktop assembly, reversal, ruler dragging, and cleanup still work. Repeat representative views in both themes and with reduced motion.
- [x] **Step 4: Verify complete visitor journeys.** Work→case study→Back to work; Work→contact prompt; Menu→education/open source; history Back/Forward; CommandPalette→background; portfolio→resume→portfolio; keyboard-only Menu/Escape and form navigation. Check mobile form visibility with the keyboard open. Use existing mocked tests for delivery/error/success states; do not send a real message. Inspect browser runtime errors.
- [x] **Step 5: Obtain an independent review and address concrete findings.** Review the complete diff against the spec, emphasizing the five Review Focus conditions. Rerun only affected checks after fixes, followed by the full repository checks if source changes affect shared navigation/scroll behavior.
- [x] **Step 6: Finish the selected integration path.** Inspect `git diff --check`, staged files, and commit identity. Summarize mobile screenshots and verification. Integration and pushing follow the user's instruction at execution time; do not infer a new push request from the earlier Fibo image task.

## Verification notes

Production build, lint, and all 86 tests passed. Browser checks covered phone widths, fine-pointer breakpoint/landscape layouts, a taller tablet, desktop rail dragging, both themes, case-study Work/Contact returns, deep links, browser history, keyboard Menu and command navigation, resume transitions, and stacked form focus at a short viewport height. The current browser cannot emulate coarse-pointer hardware, an on-screen phone keyboard, OS reduced motion, or native 200% text zoom. Media and reduced-motion behavior have regression coverage; narrow reflow was additionally inspected at 195px. Those hardware/browser-specific checks remain for a physical phone.
