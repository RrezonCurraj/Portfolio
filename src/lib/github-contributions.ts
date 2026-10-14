import type { ContributionDay } from "@/components/ui/contribution-skyline";

// GitHub's public calendar links each date cell to a tooltip with its exact count.
export function parseGitHubContributions(html: string): ContributionDay[] | null {
  const counts = new Map<string, number>();
  for (const match of html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g)) {
    const id = /\bfor="([^"]+)"/.exec(match[1])?.[1];
    const count = /^\s*(No|[\d,]+) contributions? on\b/.exec(match[2]);
    if (id && count) counts.set(id, count[1] === "No" ? 0 : Number(count[1].replaceAll(",", "")));
  }

  const days: ContributionDay[] = [];
  for (const match of html.matchAll(/<td\b([^>]*)>/g)) {
    const date = /\bdata-date="(\d{4}-\d{2}-\d{2})"/.exec(match[1])?.[1];
    const id = /\bid="([^"]+)"/.exec(match[1])?.[1];
    if (!date) continue;
    const count = id ? counts.get(id) : undefined;
    if (count === undefined || !Number.isFinite(count)) return null;
    days.push({ date, count });
  }
  return days.length ? days.sort((a, b) => a.date.localeCompare(b.date)) : null;
}
