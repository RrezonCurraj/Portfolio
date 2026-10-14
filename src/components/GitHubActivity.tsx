import { portfolioCopy, portfolioData } from "@/data/portfolio";
import { parseGitHubContributions } from "@/lib/github-contributions";
import { ContributionSkyline, type ContributionDay } from "@/components/ui/contribution-skyline";

export async function GitHubActivity() {
  const copy = portfolioCopy.contributions.activity;
  const username = new URL(portfolioData.personal.github).pathname.split("/").filter(Boolean)[0];
  let data: ContributionDay[] | null = null;
  try {
    const response = await fetch(`https://github.com/users/${encodeURIComponent(username)}/contributions`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });
    if (response.ok) data = parseGitHubContributions(await response.text());
  } catch {
    // The rest of the portfolio remains available when GitHub is unreachable.
  }

  return (
    <div className="github-activity">
      {data ? (
        <ContributionSkyline data={data} palette={{ light: [...copy.palette.light], dark: [...copy.palette.dark] }} />
      ) : (
        <p className="github-activity-status" role="status">{copy.unavailable}</p>
      )}
      <a href={portfolioData.personal.github} target="_blank" rel="noopener noreferrer" className="text-link muted-link">
        {copy.profile} <span aria-hidden="true">↗</span>
      </a>
    </div>
  );
}
