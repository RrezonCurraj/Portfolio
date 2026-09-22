import type { Metadata } from "next";
import { Archivo, Space_Grotesk } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { ModeProvider } from "@/components/Providers";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const BASE_URL = "https://rrezon.dev";

export const metadata: Metadata = {
  title: "Rrezon Curraj | Creative Frontend Developer",
  description: "Creative Frontend Developer building motion-rich, accessible web experiences with React, Next.js, TypeScript, and modern interaction design.",
  keywords: ["Rrezon", "Rrezon Curraj", "Creative Frontend Developer", "Frontend Developer", "Next.js", "React", "TypeScript", "GSAP", "Interactive Web Design"],
  authors: [{ name: "Rrezon Curraj" }],
  creator: "Rrezon Curraj",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    title: "Rrezon Curraj | Creative Frontend Developer",
    description: "Motion-rich, accessible web experiences built with React, Next.js, and thoughtful interaction design.",
    siteName: "Rrezon Curraj Portfolio",
    images: [
      {
        url: `${BASE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Rrezon Curraj | Creative Frontend Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rrezon Curraj | Creative Frontend Developer",
    description: "I build motion-rich, accessible web experiences with React and Next.js.",
    images: [`${BASE_URL}/opengraph-image`],
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Rrezon Curraj",
  url: "https://rrezon.dev",
  jobTitle: "Creative Frontend Developer",
  email: "rrezoncurraj10@gmail.com",
  sameAs: [
    "https://github.com/RrezonCurraj",
    "https://www.linkedin.com/in/rrezon/",
  ],
  knowsAbout: ["React", "Next.js", "TypeScript", "Tailwind CSS", "GSAP", "Three.js", "Accessible Web Design"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("portfolio-theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}var r=document.documentElement;r.dataset.theme=t;r.classList.toggle("dark",t==="dark");r.style.colorScheme=t}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body
        className={`${archivo.variable} ${spaceGrotesk.variable} relative bg-background text-foreground antialiased`}
      >
        <ModeProvider>
          <SmoothScroll>
            <NoiseOverlay />
            {children}
          </SmoothScroll>
          <ThemeToggle />
        </ModeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
