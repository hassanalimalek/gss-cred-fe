import type { Metadata } from "next";
import { Geist, Geist_Mono, PT_Serif } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

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

export const metadata: Metadata = {
  title: 'Mulligan Credit Repair - Restore Your Credit Score',
  description: 'Expert credit repair services helping you remove negative items and improve your credit score. Get personalized solutions for a better financial future.',
  keywords: ['credit repair', 'credit score improvement', 'remove negative items', 'financial freedom'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${ptSerif.variable} antialiased`}
      >
        <ErrorBoundary>
          <div className="flex flex-col bg-white min-h-screen">
            <Header phone='1-214-444-9837' email='cred@gznite.com'/>
            {children}
            <Footer />
          </div>
        </ErrorBoundary>
      </body>
    </html>
  );
}
