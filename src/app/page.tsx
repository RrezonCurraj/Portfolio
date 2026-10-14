import { Navbar } from "@/components/Navbar";
import { PageContent } from "@/components/PageContent";
import { CommandPalette } from "@/components/CommandPalette";
import { GitHubActivity } from "@/components/GitHubActivity";
import { Suspense } from "react";
import { portfolioCopy } from "@/data/portfolio";

export default function Home() {
  return (
    <main className="portfolio-shell min-h-screen bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
      <Navbar />
      <PageContent githubActivity={
        <Suspense fallback={<p className="github-activity-status" role="status">{portfolioCopy.contributions.activity.loading}</p>}>
          <GitHubActivity />
        </Suspense>
      } />
      <CommandPalette />
    </main>
  );
}
