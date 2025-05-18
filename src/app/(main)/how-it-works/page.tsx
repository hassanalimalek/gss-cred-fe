'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { SectionLoading } from '@/components/common/SectionLoading';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { useHashNavigation } from '@/hooks/useHashNavigation';

const HowItWorksHero = dynamic(
  () => import('@/components/sections/HowItWorksHero').then(mod => mod.default || mod),
  { ssr: false }
);
const ProcessSteps = dynamic(
  () => import('@/components/sections/ProcessSteps').then(mod => ({ default: mod.ProcessSteps })),
  { ssr: false }
);

export default function HowItWorks() {
  useHashNavigation();

  return (
    <main className="min-h-screen bg-white">
      <ErrorBoundary>
        <Suspense fallback={<SectionLoading height="500px" message="Loading hero section..." />}>
          <HowItWorksHero />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<SectionLoading height="400px" message="Loading process steps..." />}>
          <ProcessSteps />
        </Suspense>
      </ErrorBoundary>

   
    </main>
  );
}