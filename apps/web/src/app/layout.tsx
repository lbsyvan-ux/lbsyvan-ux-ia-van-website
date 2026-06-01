import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kapex Wealth Management | CRM",
  description: "Système de gestion patrimoniale automatisé",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full flex bg-stone-50/50 dark:bg-stone-950`}
      >
        <Sidebar />
        <main className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Header / Top bar (Search, Notifications, etc.) */}
          <header className="h-16 border-b border-stone-100 bg-white dark:border-stone-900 dark:bg-stone-950 px-8 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400">
              Interface Conseiller
            </h2>
            <div className="flex items-center gap-4">
               {/* Placeholders for header actions */}
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 overflow-y-auto p-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
