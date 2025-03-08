'use client';

import { Geist, Geist_Mono, PT_Serif } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Toaster } from 'react-hot-toast';
import { useHashNavigation } from '@/hooks/useHashNavigation';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ptSerif = PT_Serif({
  weight: ["400", "700"],
  variable: "--font-pt-serif",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useHashNavigation();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${ptSerif.variable}`}
    >
      <body>
        <ErrorBoundary>
          <Header phone='1-214-444-9837' email='cred@gznite.com'/>
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <Toaster />
        </ErrorBoundary>
      </body>
    </html>
  );
}
