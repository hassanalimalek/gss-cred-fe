"use client";
import { ContactHero } from "@/components/sections/ContactHero";
import {ContactSectionSimple}  from "@/components/sections/ContactSectionSimple";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <ContactHero />
      <ContactSectionSimple />
    </main>
  );
}