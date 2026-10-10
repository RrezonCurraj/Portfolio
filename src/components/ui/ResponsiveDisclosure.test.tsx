import { act, fireEvent, render, screen } from "@testing-library/react";
import { ResponsiveDisclosure } from "@/components/ui/ResponsiveDisclosure";

const original = window.matchMedia;
let compact = true;
const listeners = new Set<() => void>();
beforeEach(() => {
  compact = true;
  history.replaceState(null, "", "/");
  window.matchMedia = jest.fn().mockImplementation(query => ({
    get matches() { return compact; }, media: query,
    addEventListener: (_: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
  }));
});
afterEach(() => { window.matchMedia = original; listeners.clear(); history.replaceState(null, "", "/"); });
function fixture() {
  return render(<section id="education"><ResponsiveDisclosure anchorId="education" title="Education & training" headingLevel={3} desktopHeading={<h3>Education & training</h3>}><button>Course</button></ResponsiveDisclosure></section>);
}
function rotate(value: boolean) { act(() => { compact = value; listeners.forEach(listener => listener()); }); }
it("starts folded on phones but retains expanded content on desktop", () => {
  const { container } = fixture();
  const details = container.querySelector("details")!;
  expect(details.open).toBe(false);
  rotate(false);
  expect(details.open).toBe(true);
  rotate(true);
  expect(details.open).toBe(false);
});
it("remembers a visitor's expansion across desktop and keeps summary focus", () => {
  const { container } = fixture();
  const details = container.querySelector("details")!;
  const summary = details.querySelector("summary")!;
  summary.focus();
  act(() => { details.open = true; fireEvent(details, new Event("toggle")); });
  expect(summary).toHaveFocus();
  rotate(false); rotate(true);
  expect(details.open).toBe(true);
});
it("does not collapse a focused desktop descendant after rotation", () => {
  compact = false;
  const { container } = fixture();
  screen.getByRole("button", { name: "Course" }).focus();
  rotate(true);
  expect(container.querySelector("details")!.open).toBe(true);
  expect(screen.getByRole("button", { name: "Course" })).toHaveFocus();
});
it("reveals the current hash's disclosure on first mount", () => {
  history.replaceState(null, "", "/#education");
  const { container } = fixture();
  expect(container.querySelector("details")!.open).toBe(true);
});

it("returns heading focus to the visible compact summary without changing its expansion choice", () => {
  const { container } = fixture();
  const details = container.querySelector("details")!;
  const summary = details.querySelector("summary")!;
  summary.focus();
  rotate(false);
  expect(container.querySelector(".disclosure-desktop-heading h3")).toHaveFocus();
  rotate(true);
  expect(summary).toHaveFocus();
  expect(details.open).toBe(false);
});
