'use client';

import { AboutHero } from '@/components/sections/AboutHero';
import { OurCommitment } from '@/components/sections/OurCommitment';
import { TakeFirstStep } from '@/components/sections/TakeFirstStep';
import { CourseMapSection } from '@/components/sections/CourseMapSection';

export default function About() {
  return (
    <main className="bg-white min-h-screen">
      <AboutHero />
      <CourseMapSection />
      <OurCommitment />
      <TakeFirstStep />
    </main>
  );
}