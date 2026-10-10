import { act, render, screen } from "@testing-library/react";
import { useCompactLayout } from "@/lib/useCompactLayout";

it("updates compact presentation after rotation and removes its subscription", () => {
  const original = window.matchMedia;
  let matches = true;
  const listeners = new Set<() => void>();
  window.matchMedia = jest.fn().mockImplementation(query => ({
    get matches() { return matches; }, media: query,
    addEventListener: (_: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
  }));
  function Fixture() { return <p>{useCompactLayout() ? "Compact" : "Desktop"}</p>; }
  try {
    const { unmount } = render(<Fixture />);
    expect(screen.getByText("Compact")).toBeInTheDocument();
    act(() => { matches = false; listeners.forEach(listener => listener()); });
    expect(screen.getByText("Desktop")).toBeInTheDocument();
    unmount();
    expect(listeners.size).toBe(0);
  } finally { window.matchMedia = original; }
});
