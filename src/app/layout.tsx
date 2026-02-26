import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BowlingBanen Nederland | Vind de beste bowlingbaan",
  description: "Vind 250+ bowlingbanen in Nederland. Bekijk foto's, prijzen, openingstijden en reserveer vandaag nog jouw baan!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className="dark">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        {/* Navigation Bar */}
        <nav className="w-full border-b border-color-border bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">🎳</span>
              <span className="font-extrabold text-xl tracking-tight text-white">Bowlo<span className="text-color-brand-neon">NL</span></span>
            </Link>
            <div className="hidden md:flex items-center gap-8 font-medium">
              <Link href="/zoeken" className="text-white hover:text-color-brand-neon transition-colors">Zoeken & Filteren</Link>
              <Link href="/steden" className="text-gray-400 hover:text-white transition-colors">Steden</Link>
              <Link href="/tarieven" className="text-gray-400 hover:text-white transition-colors">Tarieven</Link>
              <Link href="/tips" className="text-color-brand-neon font-bold hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.8)] transition-all">Deals & Tips</Link>
            </div>
          </div>
        </nav>

        {children}

        {/* Footer */}
        <footer className="w-full border-t border-color-border mt-auto bg-[#0a0a0a] text-center p-8">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} BowloNL. Alle rechten voorbehouden.</p>
        </footer>
      </body>
    </html>
  );
}
