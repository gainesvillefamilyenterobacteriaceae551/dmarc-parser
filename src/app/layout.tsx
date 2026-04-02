import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DMARC Report Analyser',
  description: 'Analyse DMARC aggregate XML reports in the browser',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#0d1117] text-[#e6edf3] flex flex-col">
        <header className="border-b border-[#30363d] bg-[#161b22] px-6 py-4 flex items-center gap-3 shrink-0">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="1" y="1" width="18" height="18" rx="3" stroke="#58a6ff" strokeWidth="1.5" />
            <path d="M4 7l6 4 6-4" stroke="#58a6ff" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M4 11h12M4 14h8" stroke="#58a6ff" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          </svg>
          <span className="text-sm font-semibold tracking-tight">DMARC Report Analyser</span>
          <span className="text-sm text-neutral-500">— aggregate report inspector</span>
        </header>
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
