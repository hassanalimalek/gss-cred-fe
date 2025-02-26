'use client';

import { AboutHero } from '@/components/sections/AboutHero';
import {OurCommitment}  from '@/components/sections/OurCommitment';
import { TakeFirstStep } from '@/components/sections/TakeFirstStep';

export default function About() {
  return (
    <main className="min-h-screen bg-white">
     <AboutHero />
     <OurCommitment/>
     <TakeFirstStep />
    </main>
  );
}