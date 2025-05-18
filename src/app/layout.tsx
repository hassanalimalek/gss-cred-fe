'use client';

import { Geist, Geist_Mono, PT_Serif } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';

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
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${ptSerif.variable}`}
    >
      <body>
        <ErrorBoundary>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
