import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { Navbar } from "@/components/Navbar";
import { ModeProvider } from "@/components/Providers";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "@/components/ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

beforeEach(() => {
  jest.useFakeTimers();
  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    value: 1000,
  });
  Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
  Object.defineProperty(document.documentElement, "scrollHeight", {
    configurable: true,
    value: 3000,
  });
  Object.defineProperty(document.documentElement, "clientHeight", {
    configurable: true,
    value: 1000,
  });
});

afterEach(() => {
  jest.useRealTimers();
});

function renderNavigation() {
  const result = render(
    <ModeProvider>
      <Navbar />
      <section id="home" />
      <section id="projects" />
      <section id="about" />
      <section id="contact" />
    </ModeProvider>,
  );
  for (const [id, top] of [
    ["home", 0],
    ["projects", 900],
    ["about", 1800],
    ["contact", 2600],
  ] as const) {
    const section = result.container.querySelector(`#${id}`)!;
    section.getBoundingClientRect = () =>
      ({ top: top - window.scrollY }) as DOMRect;
  }
  act(() => {
    jest.runOnlyPendingTimers();
  });
  return result;
}

it("updates the ruler and current section when the document scrolls", () => {
  renderNavigation();
  expect(
    screen.getByRole("slider", { name: "Page scroll progress" }),
  ).toHaveAttribute("aria-valuenow", "0");
  Object.defineProperty(window, "scrollY", { configurable: true, value: 1000 });
  fireEvent.scroll(window);
  act(() => {
    jest.runOnlyPendingTimers();
  });
  expect(screen.getByRole("slider")).toHaveAttribute(
    "aria-valuenow",
    "50",
  );
  expect(
    within(screen.getByRole("navigation", { name: "Sections" })).getByRole(
      "link",
      { name: "Work" },
    ),
  ).toHaveAttribute("aria-current", "location");
});

it("clamps scroll progress and selects the last section at the bottom", () => {
  renderNavigation();
  Object.defineProperty(window, "scrollY", { configurable: true, value: 2100 });
  fireEvent.scroll(window);
  act(() => {
    jest.runOnlyPendingTimers();
  });
  expect(screen.getByRole("slider")).toHaveAttribute(
    "aria-valuenow",
    "100",
  );
  expect(
    within(screen.getByRole("navigation", { name: "Sections" })).getByRole(
      "link",
      { name: "Contact" },
    ),
  ).toHaveAttribute("aria-current", "location");
});

it("handles a document that fits within the viewport", () => {
  Object.defineProperty(document.documentElement, "scrollHeight", {
    configurable: true,
    value: 700,
  });
  renderNavigation();
  expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "0");
});

it("closes the secondary menu after selecting a section", () => {
  renderNavigation();
  fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
  const menu = screen.getByRole("navigation", { name: "Additional navigation" });
  const work = within(menu).getByRole("link", { name: "Work" });
  expect(work).toHaveAttribute("href", "#projects");
  fireEvent.click(work);
  expect(
    screen.queryByRole("navigation", { name: "Additional navigation" }),
  ).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
});

it("peels the trailing rail letters first and retraces their path in reverse", () => {
  const original = window.matchMedia;
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches:
      query === "all" ||
      query === "(min-width: 768px)" ||
      query === "(min-height: 400px)",
    media: query,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }));
  try {
    const { container, unmount } = renderNavigation();
    ScrollTrigger.refresh();
    const work = within(
      screen.getByRole("navigation", { name: "Sections" }),
    ).getByRole("link", { name: "Work" });
    const letters = [...work.querySelectorAll(".rail-glyph")];
    expect(letters).toHaveLength(4);
    expect(work.querySelector(".rail-word-visual")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    const trigger = ScrollTrigger.getById("rail-typography");
    expect(trigger).toBeDefined();
    expect(trigger!.vars.scrub).toBe(true);
    const animation = trigger!.animation!;
    animation.progress(0);
    const initial = letters.map((letter) =>
      Number(gsap.getProperty(letter, "y")),
    );
    expect(initial[0]).toBe(initial[3]);
    expect(Number(gsap.getProperty(letters[0], "rotation"))).toBe(0);
    const futureLinks = ["Work", "About", "Contact"].map((name) =>
      within(screen.getByRole("navigation", { name: "Sections" })).getByRole(
        "link",
        { name },
      ),
    );
    const futureRows = futureLinks.map((link) =>
      Number(gsap.getProperty(link.querySelector(".rail-glyph")!, "y")),
    );
    expect(futureRows[0]).toBeLessThan(futureRows[1]);
    expect(futureRows[1]).toBeLessThan(futureRows[2]);
    expect(futureRows[2]).toBeLessThan(window.innerHeight);
    animation.progress(0.1);
    expect(Number(gsap.getProperty(letters[0], "rotation"))).toBe(0);
    expect(Number(gsap.getProperty(letters[3], "rotation"))).toBe(-90);
    animation.progress(0.27);
    expect(Number(gsap.getProperty(letters[0], "rotation"))).toBe(-90);
    expect(Number(gsap.getProperty(letters[3], "rotation"))).toBe(0);
    animation.progress(0.5);
    for (const letter of letters) {
      expect(Number(gsap.getProperty(letter, "rotation"))).toBe(0);
      expect(Number(gsap.getProperty(letter, "scaleX"))).toBe(1);
    }
    expect(Number(gsap.getProperty(letters[0], "y"))).toBe(
      Number(gsap.getProperty(letters[3], "y")),
    );
    animation.progress(0.83);
    expect(Number(gsap.getProperty(letters[3], "scaleX"))).toBeLessThan(0.5);
    expect(
      parseFloat((letters[3] as HTMLElement).style.filter.replace("blur(", "")),
    ).toBeGreaterThan(0);
    const about = within(
      screen.getByRole("navigation", { name: "Sections" }),
    ).getByRole("link", { name: "About" });
    const incoming = about.querySelectorAll(".rail-glyph");
    expect(
      Number(gsap.getProperty(incoming[incoming.length - 1], "rotation")),
    ).toBe(0);
    expect(Number(gsap.getProperty(letters[3], "y"))).toBeLessThan(
      Number(gsap.getProperty(incoming[incoming.length - 1], "y")) - 40,
    );
    expect(container.querySelector(".scatter-flight")).not.toBeInTheDocument();
    animation.progress(0);
    letters.forEach((letter, index) =>
      expect(Number(gsap.getProperty(letter, "y"))).toBeCloseTo(
        initial[index],
        3,
      ),
    );
    unmount();
    expect(ScrollTrigger.getById("rail-typography")).toBeUndefined();
  } finally {
    window.matchMedia = original;
  }
});

it("keeps the content heading static while navigation owns the typography animation", () => {
  render(<SectionHeading number="01" title="Selected work" />);
  const heading = screen.getByRole("heading", { name: "Selected work" });
  expect(heading.querySelector(".scatter-visual")).not.toBeInTheDocument();
  expect(
    ScrollTrigger.getAll().some((trigger) => trigger.trigger === heading),
  ).toBe(false);
});

it("holds the current title until the next word arrives, then lifts both without overlap", () => {
  const original = window.matchMedia;
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches:
      query === "all" ||
      query === "(min-width: 768px)" ||
      query === "(min-height: 400px)",
    media: query,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }));
  try {
    const { container, unmount } = renderNavigation();
    ScrollTrigger.refresh();
    const intro = container.querySelector('[data-rail-section="home"] .rail-glyph')!;
    const work = [...container.querySelectorAll('[data-rail-section="projects"] .rail-glyph')];
    const animation = ScrollTrigger.getById("rail-typography")!.animation!;
    animation.progress(0);
    const introY = Number(gsap.getProperty(intro, "y"));
    // Work's approach spans scroll positions 380–782 in this 1000px viewport.
    animation.progress(641.3 / 2000);
    expect(Number(gsap.getProperty(intro, "y"))).toBeCloseTo(introY, 3);
    expect(Number(gsap.getProperty(intro, "scaleX"))).toBe(1);
    expect((intro as HTMLElement).style.filter).toBe("blur(0.000px)");
    animation.progress(669.44 / 2000);
    const arrivalY = Number(gsap.getProperty(work[0], "y"));
    work.forEach((letter) => {
      expect(Number(gsap.getProperty(letter, "rotation"))).toBe(0);
      expect(Number(gsap.getProperty(letter, "y"))).toBeCloseTo(arrivalY, 3);
    });
    let previousIntroY = introY;
    let previousWorkY = arrivalY;
    for (const position of [680, 710, 740, 770, 782]) {
      animation.progress(position / 2000);
      const outgoingY = Number(gsap.getProperty(intro, "y"));
      const incomingY = Number(gsap.getProperty(work[0], "y"));
      const scale = Number(gsap.getProperty(intro, "scaleY"));
      expect(outgoingY).toBeLessThanOrEqual(previousIntroY);
      expect(incomingY).toBeLessThanOrEqual(previousWorkY);
      // Glyph boxes are 64px high and transform around their centers.
      expect(incomingY).toBeGreaterThan(outgoingY + 32 + scale * 32 + 8);
      previousIntroY = outgoingY;
      previousWorkY = incomingY;
    }
    animation.progress(641.3 / 2000);
    expect(Number(gsap.getProperty(intro, "y"))).toBeCloseTo(introY, 3);
    expect(Number(gsap.getProperty(intro, "scaleX"))).toBe(1);
    unmount();
  } finally {
    window.matchMedia = original;
  }
});

it("keeps incoming letters outside the current word until they clear it in a short touch viewport", () => {
  const original = window.matchMedia;
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches: ["all", "(min-width: 768px)", "(min-height: 400px)", "(pointer: coarse)"].includes(query),
    media: query,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }));
  Object.defineProperty(window, "innerHeight", { configurable: true, value: 450 });
  Object.defineProperty(document.documentElement, "clientHeight", { configurable: true, value: 450 });
  Object.defineProperty(document.documentElement, "scrollHeight", { configurable: true, value: 6000 });
  try {
    const ids = ["home", "projects", "about", "experience", "contributions", "contact"];
    const { container, unmount } = render(
      <ModeProvider>
        <Navbar />
        {ids.map((id) => <section key={id} id={id} />)}
      </ModeProvider>,
    );
    ids.forEach((id, index) => {
      container.querySelector(`#${id}`)!.getBoundingClientRect = () =>
        ({ top: index * 1000 - window.scrollY }) as DOMRect;
    });
    container.querySelectorAll<HTMLElement>(".rail-word-measure").forEach((element) => {
      element.style.fontSize = "29.25px";
    });
    ScrollTrigger.refresh();
    const animation = ScrollTrigger.getById("rail-typography")!.animation!;
    const boxes = (id: string) => [...container.querySelectorAll<HTMLElement>(`[data-rail-section="${id}"] .rail-glyph`)].map((element) => {
      const width = parseFloat(element.style.width);
      const height = parseFloat(element.style.height);
      const scale = Number(gsap.getProperty(element, "scaleX"));
      const angle = Number(gsap.getProperty(element, "rotation")) * Math.PI / 180;
      const halfWidth = (Math.abs(Math.cos(angle)) * width + Math.abs(Math.sin(angle)) * height) * scale / 2;
      const halfHeight = (Math.abs(Math.sin(angle)) * width + Math.abs(Math.cos(angle)) * height) * scale / 2;
      const x = Number(gsap.getProperty(element, "x")) + width / 2;
      const y = Number(gsap.getProperty(element, "y")) + height / 2;
      return { left: x - halfWidth, right: x + halfWidth, top: y - halfHeight, bottom: y + halfHeight };
    });
    for (const scrollPosition of [3626.7, 3632.55, 3638.4, 3644.25]) {
      animation.progress(scrollPosition / 5550);
      const current = boxes("experience");
      const incoming = boxes("contributions");
      const overlaps = incoming.filter((letter) => current.some((prior) =>
        Math.min(letter.right, prior.right) - Math.max(letter.left, prior.left) > 0.35 &&
        Math.min(letter.bottom, prior.bottom) - Math.max(letter.top, prior.top) > 0.35,
      ));
      expect(overlaps).toHaveLength(0);
    }
    unmount();
  } finally {
    window.matchMedia = original;
  }
});


describe("compact navigation", () => {
  const original = window.matchMedia;
  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: query.includes("max-width: 767px"), media: query,
      addListener: jest.fn(), removeListener: jest.fn(),
      addEventListener: jest.fn(), removeEventListener: jest.fn(),
    }));
  });
  afterEach(() => { window.matchMedia = original; });

  it("groups intro and background destinations into the persistent three links", () => {
    const { container } = renderNavigation();
    const navigation = screen.getByRole("navigation", { name: "Mobile sections" });
    expect(within(navigation).getAllByRole("link")).toHaveLength(3);
    const positions = [[0, "Work"], [900, "Work"], [1800, "About"], [2000, "Contact"]] as const;
    for (const [position, name] of positions) {
      Object.defineProperty(window, "scrollY", { configurable: true, value: position });
      fireEvent.scroll(window);
      act(() => { jest.runOnlyPendingTimers(); });
      expect(within(navigation).getByRole("link", { name })).toHaveAttribute("aria-current", "location");
    }
    expect(container.querySelector(".scroll-rail")).not.toBeInTheDocument();
    expect(ScrollTrigger.getById("rail-typography")).toBeUndefined();
  });

  it("keeps every background subsection in About", () => {
    const { container } = renderNavigation();
    for (const [index, id] of ["skills", "experience", "education", "contributions"].entries()) {
      const section = document.createElement("section");
      section.id = id;
      section.getBoundingClientRect = () => ({ top: 1700 + index * 30 - window.scrollY }) as DOMRect;
      container.append(section);
    }
    for (const position of [1700, 1730, 1760, 1790]) {
      Object.defineProperty(window, "scrollY", { configurable: true, value: position });
      fireEvent.scroll(window);
      act(() => { jest.runOnlyPendingTimers(); });
      expect(within(screen.getByRole("navigation", { name: "Mobile sections" })).getByRole("link", { name: "About" })).toHaveAttribute("aria-current", "location");
    }
  });

  it("offers secondary actions and returns focus on Escape", () => {
    renderNavigation();
    const trigger = screen.getByRole("button", { name: "Open menu" });
    fireEvent.click(trigger);
    const menu = screen.getByRole("navigation", { name: "Additional navigation" });
    expect(within(menu).getByRole("link", { name: "Education & training" })).toHaveAttribute("href", "#education");
    expect(within(menu).getByRole("link", { name: "Download CV" })).toHaveAttribute("download");
    fireEvent.keyDown(window, { key: "Escape" });
    expect(menu).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("button", { name: "Résumé view" }));
    expect(screen.queryByRole("navigation", { name: "Mobile sections" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Back to portfolio" })).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "Additional navigation" })).not.toBeInTheDocument();
  });
});
