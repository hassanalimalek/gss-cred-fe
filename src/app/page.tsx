'use client';

import { Suspense, lazy } from 'react';
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { SectionLoading } from '@/components/common/SectionLoading';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

// Dynamically import non-critical components
const UnlockPotential = lazy(() => import('@/components/sections/UnlockPotential').then(mod => ({ default: mod.UnlockPotential })));
const Features = lazy(() => import('@/components/sections/Features').then(mod => ({ default: mod.Features })));
const FAQ = lazy(() => import('@/components/sections/FAQ').then(mod => ({ default: mod.FAQ })));
const ContactForm = lazy(() => import('@/components/sections/ContactForm'));
const Testimonials = lazy(() => import('@/components/sections/Testimonials').then(mod => ({ default: mod.Testimonials })));
const LatestInsights = lazy(() => import('@/components/sections/LatestInsights').then(mod => ({ default: mod.LatestInsights })));

export default function Home() {
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
          <FAQ />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<SectionLoading height="600px" message="Loading contact form..." />}>
          <ContactForm />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<SectionLoading height="400px" />}>
          <LatestInsights />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}
