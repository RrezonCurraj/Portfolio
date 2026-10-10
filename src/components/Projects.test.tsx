import { render, screen, within } from "@testing-library/react";
import { Projects } from "@/components/Projects";
import { portfolioData } from "@/data/portfolio";

it("keeps every project preview and primary action on the same case study", () => {
  render(<Projects />);
  const articles = screen.getAllByRole("article");
  expect(articles).toHaveLength(5);
  ["fibo", "hireon", "ntsh-beli", "hypercast", "maxi24"].forEach((slug, index) => {
    const action = within(articles[index]).getByRole("link", { name: "View project" });
    const preview = articles[index].querySelector(".project-visual");
    expect(action).toHaveAttribute("href", `/projects/${slug}`);
    expect(preview).toHaveAttribute("href", `/projects/${slug}`);
    const summary = articles[index].querySelector(".project-description")!;
    expect(summary.compareDocumentPosition(action) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
  expect(screen.getByRole("link", { name: "Have a project? Let’s talk" })).toHaveAttribute("href", "#contact");
});

it("keeps live-only project details accessible without a case study", () => {
  const original = portfolioData.projects;
  portfolioData.projects = [{ ...original[0], caseStudy: undefined }];
  try {
    render(<Projects />);
    const action = screen.getByRole("link", { name: "View project" });
    expect(action).toHaveAttribute("href", "https://somosfibo.com/es");
    expect(action).toHaveAttribute("target", "_blank");
    expect(action).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByRole("link", { name: "Source: Fibo" })).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByRole("article")).not.toHaveClass("has-case-study");
  } finally { portfolioData.projects = original; }
});
