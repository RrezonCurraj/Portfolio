import type { Metadata } from "next";
import { Archivo, Space_Grotesk } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { ModeProvider } from "@/components/Providers";
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

export const metadata: Metadata = {
  title: "Rrezon Curraj | Frontend Developer & UI Designer",
  description: "Portfolio of Rrezon Curraj, a creative Frontend Developer specializing in React, Next.js, and modern UI design. I build digital experiences.",
  keywords: ["Rrezon", "Rrezon Curraj", "Frontend Developer", "Next.js", "React", "Portfolio", "Web Developer", "UI Designer", "Freelance Developer"],
  authors: [{ name: "Rrezon Curraj" }],
  creator: "Rrezon Curraj",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rrezon.dev",
    title: "Rrezon Curraj | Frontend Developer & UI Designer",
    description: "Portfolio of Rrezon Curraj, a creative Frontend Developer specializing in React, Next.js, and modern UI design.",
    siteName: "Rrezon Curraj Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rrezon Curraj | Frontend Developer",
    description: "I build modern, responsive, and performant digital experiences.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${archivo.variable} ${spaceGrotesk.variable} antialiased bg-[#0f172a] text-[#f8fafc] relative`}
      >
        <ModeProvider>
          <SmoothScroll>
            <NoiseOverlay />
            {children}
          </SmoothScroll>
        </ModeProvider>
      </body>
    </html>
  );
}
