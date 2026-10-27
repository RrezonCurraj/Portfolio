import { act, render } from "@testing-library/react";
import { createRef, StrictMode } from "react";
import gsap from "gsap";
import { portfolioData } from "@/data/portfolio";
import { ProjectCarousel, type ProjectCarouselHandle } from "@/components/ui/ProjectCarousel";

it("reuses carousel rows and leaves unchanged offscreen styles alone while seeking", async () => {
  const ref = createRef<ProjectCarouselHandle>();
  const { container } = render(<ProjectCarousel ref={ref} projects={portfolioData.projects} index={0} onIndexChange={() => {}} />);
  const first = container.querySelector<HTMLElement>("[data-carousel-title]")!;
  const heading = first.parentElement!.parentElement!;
  const query = jest.spyOn(heading, "querySelectorAll");
  const offscreen = container.querySelectorAll<HTMLElement>("[data-carousel-title]")[4];
  let styleChanges = 0;
  const observer = new MutationObserver(records => { styleChanges += records.length; });
  observer.observe(offscreen, { attributes: true, attributeFilter: ["style"] });
  try {
    await act(async () => {
      ref.current!.seek(0.25);
      ref.current!.seek(0.5);
    });
    expect(gsap.getProperty(first, "yPercent")).toBe(-57.5);
    expect(Number(first.style.opacity)).toBe(0.5);
    expect(query).not.toHaveBeenCalled();
    expect(styleChanges).toBe(0);
  } finally {
    observer.disconnect();
    query.mockRestore();
  }
});

it("refreshes cached rows when the project order changes", () => {
  const ref = createRef<ProjectCarouselHandle>();
  const onIndexChange = () => {};
  const { container, rerender } = render(<ProjectCarousel ref={ref} projects={portfolioData.projects} index={0} onIndexChange={onIndexChange} />);
  const reversed = [...portfolioData.projects].reverse();
  rerender(<ProjectCarousel ref={ref} projects={reversed} index={0} onIndexChange={onIndexChange} />);
  act(() => { ref.current!.seek(1); });
  const rows = container.querySelectorAll<HTMLElement>("[data-carousel-title]");
  expect(rows[1]).toHaveTextContent(reversed[1].displayTitle ?? reversed[1].title);
  expect(gsap.getProperty(rows[1], "yPercent")).toBe(0);
  expect(Number(rows[1].style.opacity)).toBe(1);
  expect(Number(rows[0].style.opacity)).toBe(0);
});

it("restores carousel transforms after development effect cleanup", () => {
  const { container } = render(<StrictMode><ProjectCarousel projects={portfolioData.projects} index={0} onIndexChange={() => {}} /></StrictMode>);
  const rows = container.querySelectorAll<HTMLElement>("[data-carousel-title]");
  expect(gsap.getProperty(rows[1], "yPercent")).toBe(115);
  expect(gsap.getProperty(rows[4], "yPercent")).toBe(138);
});
