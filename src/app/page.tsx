'use client';

import { Suspense } from 'react';
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { SectionLoading } from '@/components/common/SectionLoading';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import dynamic from 'next/dynamic';
import { useHashNavigation } from '@/hooks/useHashNavigation';

// Dynamically import non-critical components with ssr: false to prevent hydration errors
const UnlockPotential = dynamic(
  () => import('@/components/sections/UnlockPotential').then(mod => ({ default: mod.UnlockPotential })),
  { ssr: false }
);
const Features = dynamic(
  () => import('@/components/sections/Features').then(mod => ({ default: mod.Features })),
  { ssr: false }
);
const FAQ = dynamic(
  () => import('@/components/sections/FAQ').then(mod => ({ default: mod.FAQ })),
  { ssr: false }
);
const OnboardingForm = dynamic(
  () => import('@/components/sections/OnboardingForm'),
  { ssr: false }
);
const Testimonials = dynamic(
  () => import('@/components/sections/Testimonials').then(mod => ({ default: mod.Testimonials })),
  { ssr: false }
);
const LatestInsights = dynamic(
  () => import('@/components/sections/LatestInsights').then(mod => ({ default: mod.LatestInsights })),
  { ssr: false }
);

export default function Home() {
  useHashNavigation();

  return (
    <main>
      <ErrorBoundary>
        <Suspense fallback={<SectionLoading height="500px" message="Loading hero section..." />}>
          <Hero />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<SectionLoading height="200px" message="Loading stats..." />}>
          <Stats />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<SectionLoading height="400px" />}>
          <UnlockPotential />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<SectionLoading height="500px" />}>
          <Features />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<SectionLoading height="300px" />}>
          <Testimonials />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<SectionLoading height="400px" />}>
          <LatestInsights />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<SectionLoading height="500px" />}>
          <FAQ />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<SectionLoading height="600px" />}>
          <OnboardingForm />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}
