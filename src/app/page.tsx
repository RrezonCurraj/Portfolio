import { Navbar } from "@/components/Navbar";
import { PageContent } from "@/components/PageContent";
import { CommandPalette } from "@/components/CommandPalette";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
      <Navbar />
      <PageContent />
      <CommandPalette />
    </main>
  );
}
