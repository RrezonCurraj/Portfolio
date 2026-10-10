import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ModeProvider } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { PageContent } from "@/components/PageContent";

it("returns focus and scrolling to the new page heading when switching views", async () => {
  window.scrollTo = jest.fn();
  render(
    <ModeProvider>
      <Navbar />
      <PageContent />
    </ModeProvider>,
  );
  jest.mocked(window.scrollTo).mockClear();
  fireEvent.click(screen.getByRole("button", { name: "Résumé view" }));
  const resumeHeading = await screen.findByRole("heading", {
    level: 1,
    name: "Rrezon Curraj",
  });
  await waitFor(() => expect(resumeHeading).toHaveFocus());
  expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "instant" });
  expect(document.getElementById("home")).toContainElement(resumeHeading);
  jest.mocked(window.scrollTo).mockClear();
  fireEvent.click(screen.getByRole("button", { name: "Back to portfolio" }));
  await waitFor(() =>
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Creative Frontend Developer",
      }),
    ).toHaveFocus(),
  );
  expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "instant" });
});
