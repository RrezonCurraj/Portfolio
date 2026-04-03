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
  title: "Rrezon - Creative Developer",
  description: "Portfolio of a creative full-stack developer.",
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
