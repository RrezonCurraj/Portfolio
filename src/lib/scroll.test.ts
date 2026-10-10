import { navigateToSection, cancelSectionNavigation, SECTION_SCROLL_EVENT, type SectionScrollRequest } from "@/lib/scroll";

beforeEach(() => { jest.useFakeTimers(); history.replaceState(null, "", "/"); jest.mocked(window.scrollTo).mockClear(); });
afterEach(() => { cancelSectionNavigation(); document.body.innerHTML = ""; jest.useRealTimers(); history.replaceState(null, "", "/"); });
async function finish(result: Promise<boolean>) { await jest.runAllTimersAsync(); return result; }
it("reveals owned and ancestor disclosures before measuring a nested destination", async () => {
  document.body.innerHTML = '<section id="contributions"><details data-mobile-anchor="contributions"><summary>Open source</summary><details><summary>Inner</summary><h3 id="change:one">Change</h3></details></details></section><details id="unrelated"><summary>Other</summary></details>';
  const target = document.getElementById("change:one")!;
  target.getBoundingClientRect = () => {
    expect(target.closest("details")!.open).toBe(true);
    expect(document.querySelector<HTMLDetailsElement>("[data-mobile-anchor]")!.open).toBe(true);
    return { top: 600 } as DOMRect;
  };
  target.style.scrollMarginTop = "113px";
  expect(await finish(navigateToSection("change%3Aone", { behavior: "instant" }))).toBe(true);
  expect(window.scrollTo).toHaveBeenCalledWith({ top: 487, behavior: "instant" });
  expect(target).toHaveFocus();
  expect(target).not.toHaveAttribute("tabindex");
  expect(window.location.hash).toBe("#change%3Aone");
  expect(document.querySelector<HTMLDetailsElement>("#unrelated")!.open).toBe(false);
});
it("opens an owned outer destination without expanding unrelated inner records", async () => {
  document.body.innerHTML = '<section id="contributions"><details data-mobile-anchor="contributions"><summary>Open source</summary><details><summary>More</summary>Records</details></details></section>';
  await finish(navigateToSection("contributions", { focus: false, history: "none", behavior: "instant" }));
  const details = document.querySelectorAll("details");
  expect(details[0].open).toBe(true); expect(details[1].open).toBe(false);
  expect(document.activeElement).toBe(document.body);
  expect(window.location.hash).toBe("");
});
it.each(["missing", "%ZZ", "#", ""])('ignores missing or malformed destinations: %s', async id => {
  expect(await navigateToSection(id)).toBe(false);
  expect(window.scrollTo).not.toHaveBeenCalled();
});
it("uses the engine completion to focus deliberate navigation and preserves tabindex", async () => {
  document.body.innerHTML = '<section id="work" tabindex="0">Work</section>';
  let request!: SectionScrollRequest;
  const listener = (event: Event) => { event.preventDefault(); request = (event as CustomEvent<SectionScrollRequest>).detail; };
  window.addEventListener(SECTION_SCROLL_EVENT, listener);
  try {
    await navigateToSection("work");
    expect(document.activeElement).toBe(document.body);
    request.onComplete();
    expect(document.getElementById("work")).toHaveFocus();
    expect(document.getElementById("work")).toHaveAttribute("tabindex", "0");
  } finally { window.removeEventListener(SECTION_SCROLL_EVENT, listener); }
});
it("cancels a pending reveal before dispatch when its owner unmounts", async () => {
  document.body.innerHTML = '<details><summary>More</summary><section id="work">Work</section></details>';
  const result = navigateToSection("work");
  cancelSectionNavigation();
  expect(await finish(result)).toBe(false);
  expect(window.scrollTo).not.toHaveBeenCalled();
});
