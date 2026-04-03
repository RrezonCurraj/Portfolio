import { Navbar } from "@/components/Navbar";
import { PageContent } from "@/components/PageContent";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f172a] text-white selection:bg-[var(--color-primary)] selection:text-[#0f172a]">
      <Navbar />
      <PageContent />
    </main>
  );
}
