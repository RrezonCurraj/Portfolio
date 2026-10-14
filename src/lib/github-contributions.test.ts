import { parseGitHubContributions } from "@/lib/github-contributions";

it("joins calendar dates to exact tooltip counts and sorts the year", () => {
  const html = `
    <td data-date="2026-10-14" id="day-b" data-level="4"></td>
    <td id="day-a" data-date="2026-10-13" data-level="0"></td>
    <tool-tip for="day-b">1,234 contributions on October 14th.</tool-tip>
    <tool-tip for="day-a">No contributions on October 13th.</tool-tip>`;
  expect(parseGitHubContributions(html)).toEqual([
    { date: "2026-10-13", count: 0 },
    { date: "2026-10-14", count: 1234 },
  ]);
});

it("rejects missing or changed counts rather than inventing activity", () => {
  expect(parseGitHubContributions('<td data-date="2026-10-14" id="day"></td>')).toBeNull();
  expect(parseGitHubContributions("<html>Rate limited</html>")).toBeNull();
});
