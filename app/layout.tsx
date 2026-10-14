import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree, JetBrains_Mono } from "next/font/google";
import Nav from "@/components/Nav";
import { StoreProvider } from "@/lib/store";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["500", "700", "800"], variable: "--f-display" });
const body = Figtree({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--f-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--f-mono" });

export const metadata: Metadata = {
  title: { default: "AI Deck · Learn AI step by step", template: "%s · AI Deck" },
  description: "A free, plain-English path to learning AI: simple explanations, free courses, certificates, videos and 150+ AI tools.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <div className="mesh" aria-hidden="true" />
        <StoreProvider>
          <Nav />
          <main className="page">{children}</main>
          <footer className="foot">
            <p>AI Deck · Free resources first, paid options second. Links and prices last checked Oct 2026.</p>
          </footer>
        </StoreProvider>
      </body>
    </html>
  );
}
