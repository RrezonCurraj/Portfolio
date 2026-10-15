import { act, fireEvent, render, screen } from "@testing-library/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Projects } from "@/components/Projects";
import { portfolioData } from "@/data/portfolio";


it("keeps the active preview and project actions on the same case study", () => {
  render(<Projects />);
  for (const project of portfolioData.projects) {
    fireEvent.keyDown(screen.getByRole("group", { name: "Project previews" }), { key: "Home" });
    for (let i = 0; i < portfolioData.projects.indexOf(project); i++) fireEvent.keyDown(screen.getByRole("group", { name: "Project previews" }), { key: "ArrowRight" });
    const heading = screen.getByRole("heading", { name: project.displayTitle ?? project.title });
    const preview = screen.getByRole("link", { name: `${project.displayTitle ?? project.title} — Case study` });
    expect(heading.compareDocumentPosition(preview) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByRole("link", { name: "View Project" })).toHaveAttribute("href", `/projects/${project.slug}`);
    expect(screen.getByRole("link", { name: `${project.displayTitle ?? project.title} — Case study` })).toHaveAttribute("href", `/projects/${project.slug}`);
    expect(screen.getByRole("link", { name: "View Source Code" })).toHaveAttribute("href", project.github);
    expect(screen.getByText(project.summary ?? project.description)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next project" })).not.toBeInTheDocument();
    expect(document.querySelector(".carousel-details")).not.toBeInTheDocument();
  }
});

it("loops through projects with keyboard controls", () => {
  render(<Projects />);
  fireEvent.keyDown(screen.getByRole("group", { name: "Project previews" }), { key: "ArrowLeft" });
  expect(screen.getByRole("heading", { name: "Maxi24" })).toBeInTheDocument();
  fireEvent.keyDown(screen.getByRole("group", { name: "Project previews" }), { key: "ArrowRight" });
  expect(screen.getByRole("heading", { name: "Fibo" })).toBeInTheDocument();
  const stage = screen.getByRole("group", { name: "Project previews" });
  fireEvent.keyDown(stage, { key: "ArrowRight" });
  expect(screen.getByRole("heading", { name: "Hireon" })).toBeInTheDocument();
  fireEvent.keyDown(stage, { key: "End" });
  expect(screen.getByRole("heading", { name: "Maxi24" })).toBeInTheDocument();
  fireEvent.keyDown(stage, { key: "Home" });
  expect(screen.getByRole("heading", { name: "Fibo" })).toBeInTheDocument();
});

it("keeps live-only projects accessible when there is a single slide", () => {
  const original = portfolioData.projects;
  portfolioData.projects = [{ ...original[0], caseStudy: undefined }];
  try {
    render(<Projects />);
    const action = screen.getByRole("link", { name: "View Project" });
    expect(action).toHaveAttribute("href", "https://somosfibo.com/es");
    expect(action).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: "View Source Code" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next project" })).not.toBeInTheDocument();
  } finally { portfolioData.projects = original; }
});

it("handles an empty project list", () => {
  const original = portfolioData.projects;
  portfolioData.projects = [];
  try {
    render(<Projects />);
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next project" })).not.toBeInTheDocument();
  } finally { portfolioData.projects = original; }
});

it("advances projects with scroll progress and removes the pinned track for reduced motion", () => {
  const original = window.matchMedia;
  const listeners = new Set<() => void>();
  let reduced = false;
  window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: query === "all" || (query === "(prefers-reduced-motion: reduce)" && reduced),
    media: query,
    addListener: (listener: () => void) => listeners.add(listener),
    removeListener: (listener: () => void) => listeners.delete(listener),
    addEventListener: (_: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
  }));
  const now = jest.spyOn(Date, "now").mockReturnValue(10000);
  const height = jest.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(function (this: HTMLElement) {
    return this.classList.contains("project-scroll-track") ? 3000 : 600;
  });
  try {
    const { container, unmount } = render(<Projects />);
    const track = container.querySelector(".project-scroll-track");
    const trigger = ScrollTrigger.getAll().find(item => item.trigger === track);
    expect(trigger?.animation).toBeDefined();
    const firstTitle = container.querySelector<HTMLElement>("[data-carousel-title]")!;
    const firstActions = container.querySelector<HTMLElement>("[data-carousel-actions]")!;
    const firstDescription = container.querySelector<HTMLElement>("[data-carousel-description]")!;
    act(() => { trigger!.animation!.progress(0.0625); });
    expect(firstTitle.style.transform).toMatch(/-/);
    expect(Number(firstTitle.style.opacity)).toBeLessThan(1);
    expect(Number(firstActions.style.opacity)).toBeLessThan(1);
    expect(firstActions.style.transform).toMatch(/-/);
    expect(Number(firstDescription.style.opacity)).toBeLessThan(1);
    act(() => { trigger!.animation!.progress(0.5); });
    expect(screen.getByRole("heading", { name: "Ntsh Beli" })).toBeInTheDocument();
    act(() => { trigger!.animation!.progress(1); });
    expect(screen.getByRole("heading", { name: "Maxi24" })).toBeInTheDocument();
    act(() => {
      reduced = true;
      now.mockReturnValue(10100);
      listeners.forEach(listener => listener());
    });
    expect(container.querySelector("[data-scroll-driven]")).not.toBeInTheDocument();
    expect(ScrollTrigger.getAll()).not.toContain(trigger);
    unmount();
  } finally { window.matchMedia = original; now.mockRestore(); height.mockRestore(); }
});
