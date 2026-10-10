# Mobile portfolio structure

Date: 2026-10-10
Status: Approved

## Purpose and selected direction

Phone visitors should find the projects first, understand where they are in the page, and reach contact without hunting through a menu. The selected direction is persistent top navigation with Work, About, and Contact. Keep the Paper visual style and the current desktop rail and scroll animation.

The home page remains one scrolling document. Navigation jumps to sections; it does not switch between separate pages or hide the other sections. The planning preview shows representative section views rather than the complete scrolling page.

## Scope

Use the compact layout below 768px. Also use it on touch landscape screens up to 1024px wide and 500px high, where the desktop rail would crowd the content. Keep CSS and motion breakpoint conditions consistent. Wider or taller desktop/tablet layouts retain their current navigation and content presentation.

Keep all five projects, current project order and images, case-study routes, personal information, background records, and contact functionality. Make changes in the existing components and data source without adding dependencies or maintaining a second copy of the portfolio.

## Navigation and orientation

- A compact sticky header has the wordmark and a visibly labeled Menu control.
- A second row has three equally sized, always-visible section links: Work, About, Contact. Use a clear active indicator and `aria-current="location"`.
- Work links to `#projects` and is active through the intro and projects.
- About links to `#about` and remains active through `#about`, `#skills`, `#experience`, and `#contributions`.
- Contact links to `#contact` and becomes active when its section reaches the reading position, including at the page bottom.
- Remove the compact layout's right rail and reserved margin so the page can use its full width. Its scroll progress ruler is replaced by meaningful section navigation.
- Put secondary destinations and actions in Menu: background subsections, Download CV, theme switching, and the existing resume view. Reuse existing actions and data.
- Menu expands below the navigation, retains the active section context, closes after a destination is selected, and supports Escape with focus returning to its trigger.
- Measure the sticky header height and use it for anchor offsets and section tracking. Account for wrapping, text zoom, and safe-area insets. A heading reached through a link must remain visible below the header.

Keep the existing desktop navigation data intact. Add separate mobile navigation/grouping data in `src/data/portfolio.ts` rather than reducing the desktop rail to three items.

The three-link grouping applies to portfolio mode. Resume view has a different content order, so do not show misleading Work/About/Contact active states there. Keep a clear Back to portfolio control and its existing Download CV action.

## Page flow

### Intro

Keep the existing name, availability, role, and complete bio. Tighten mobile spacing and the role's layout so Work appears sooner. Make View work the primary action; Download CV belongs in Menu. Remove the redundant mobile scroll footnote.

At standard text size on 390px and 430px portrait phones, the opening screen should include Selected work and the first project preview. Short screens and enlarged text may require scrolling; preserve readability rather than clipping content to force this target.

### Work

Keep the five projects in a normal vertical list with no horizontal carousel, pagination, or reveal gate. Give every card the same clear reading order:

1. Project preview.
2. Title and category.
3. Existing short summary explaining the project.
4. One prominent View project action.

For projects with a case study, both preview and primary action lead to the same case-study route. On compact screens, place Live site, Source, and the complete technology list in the existing case-study page; desktop cards retain those secondary items. For a project without a case study, keep its live site as the primary destination and retain any details that would otherwise become inaccessible.

After the last project, add a small contact link to give visitors a clear next action before continuing into background. This is a line within Work, not a new page section.

### About and background

Treat the existing bio, toolkit, experience, education, and open-source work as one navigation group. Use explicit visible headings: About, Toolkit, Experience, Education & training, Open source. Keep the existing section IDs and semantic hierarchy.

Keep the bio and toolkit readable by default, with a smaller portrait near the bio. Retain the existing job accordions. Present lengthy education and open-source details as expandable mobile disclosures so visitors can skim without losing access to any record or contribution.

Desktop content and its existing disclosure behavior remain as they are. Responsive disclosures must update when the layout changes and retain truthful accessible expanded/collapsed states. Following a direct subsection or contribution hash must open the needed disclosure before scrolling and focusing the destination. Avoid duplicating the same text in separate mobile and desktop trees.

### Contact and case studies

Keep the existing email-first contact presentation, then social links and a form. Stack Name, Email, and Message on compact screens. Preserve validation, loading, success, and failure states and retain typed values on failure.

Keep case-study Back to work links targeting `/#projects` and Work with me targeting `/#contact`. Returning from a case study must land at Work with a correct active state and visible heading. Live/source links remain available in case studies. Do not add the home section navigation to a case-study route with missing local targets.

## Component and behavior boundaries

- `Navbar.tsx`: compact header, secondary menu, grouped active section tracking, and responsive rail visibility. Extract a focused mobile navigation component if this keeps the header readable.
- `portfolio.ts`: mobile labels, grouped navigation, and the Work contact prompt alongside the current content.
- `Hero.tsx` and `globals.css`: compact intro, spacing, full-width content, sticky geometry, and scoped responsive styling.
- `Projects.tsx`: project reading order, a primary action, compact secondary-detail visibility, and the after-work contact link.
- `About.tsx`, `Skills.tsx`, `Experience.tsx`, and `Contributions.tsx`: clear group hierarchy, compact spacing, and accessible responsive disclosures.
- `Contact.tsx` and case-study styling: stacked fields and a reliable return path.
- `RailNavigation.tsx`: keep its current behavior outside the compact layout; use the same compact-layout condition as the header and CSS so touch landscape does not create hidden animated glyph work.

Reuse current scrolling and reduced-motion behavior. Active section tracking should respond to scrolling, resizing, and disclosure height changes. Clean up listeners, observers, and any animation context. Keep server-rendered headings and content available before hydration.

## Acceptance and verification

- Work, About, and Contact are visible and usable throughout the compact home page. Manual scrolling and anchor navigation update the same active state.
- The page has no reserved right-side rail space, clipped text, horizontal overflow, or overlapping touch targets on 320, 375, 390, and 430px widths.
- Navigation and primary actions have at least 44px touch targets. Normal text remains readable, and editable fields retain 16px text to avoid mobile input zoom.
- Test touch landscape at 844 x 390, 932 x 430, and 1024 x 500, plus the breakpoint boundaries at 767/768px and 1024/1025px. Check corresponding fine-pointer layouts, a taller 1024px tablet, and 1440px desktop.
- Verify the first-screen Work target at 390 x 844 and 430 x 932. Test short screens and 200% text zoom for reflow and access to all content.
- Verify Menu with touch and keyboard, Escape/focus return, direct background hashes, browser back/forward, disclosure expansion and resizing, project-to-case-study navigation, Back to work, and entering/leaving resume view.
- Keep IDs unique and stable, prevent focus on hidden menu links, and retain focus on disclosure summaries when toggling details. Rotation must not unexpectedly reset user-opened details.
- Verify reduced motion, form focus with the keyboard open, error/success rendering, and no browser runtime errors. Do not send a real contact message during layout checks.
- Add focused regression coverage for navigation grouping, menu behavior, and disclosure/hash behavior using the existing test setup. Run `npm run build`, `npm run lint`, and `npm test -- --runInBand` before completion.

The next implementation plan should follow these boundaries and acceptance checks. Production changes begin after this design is reviewed.
