'use client';

import { useHashNavigation } from '@/hooks/useHashNavigation';
import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useHashNavigation();

  return (
    <>
      <Header phone='1-214-444-9837' email='cred@gznite.com'/>
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
}
