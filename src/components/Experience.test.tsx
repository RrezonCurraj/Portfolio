import { render, screen, within } from "@testing-library/react";
import { Experience } from "@/components/Experience";
import { portfolioData } from "@/data/portfolio";

it("shows the experience timeline in chronological order with complete role descriptions", () => {
  render(<Experience />);
  const timeline = screen.getByRole("list", { name: "Career timeline" });
  const items = within(timeline).getAllByRole("listitem").filter(item => item.parentElement === timeline);
  expect(items).toHaveLength(3);
  expect(items.map(item => within(item).getByRole("heading", { level: 3 }).textContent)).toEqual([
    "Demiraj Concepts", "StarLabs", "Freelance",
  ]);
  for (const job of portfolioData.experience) {
    expect(within(timeline).getByText(job.period)).toBeInTheDocument();
    for (const line of job.description.split("\n").filter(Boolean)) {
      expect(within(timeline).getByText(line.replace(/^[•-]\s*/, ""))).toBeInTheDocument();
    }
  }
  for (const education of portfolioData.education) expect(screen.getByText(education.degree)).toBeInTheDocument();
});

it("shows education chronologically in its own timeline with unique instructions", () => {
  const { container } = render(<Experience />);
  const education = screen.getByRole("list", { name: "Education timeline" });
  const items = within(education).getAllByRole("listitem").filter(item => item.parentElement === education);
  expect(items.map(item => within(item).getByRole("heading", { level: 4 }).textContent)).toEqual([
    portfolioData.education[0].degree, "Graphic Designer", "iOS Developer", "Microsoft Azure Cloud",
  ]);
  for (const entry of portfolioData.education) {
    expect(within(education).getByText(`${entry.institution} · ${entry.location}`)).toBeInTheDocument();
    expect(within(education).getByText(entry.period)).toBeInTheDocument();
  }
  const instructions = ["Career timeline", "Education timeline"].map(name => screen.getByRole("group", { name }).getAttribute("aria-describedby"));
  expect(new Set(instructions).size).toBe(2);
  instructions.forEach(id => expect(container.querySelector(`[id="${id}"]`)).toBeInTheDocument());
  expect(document.getElementById("education")).toContainElement(education);
});
