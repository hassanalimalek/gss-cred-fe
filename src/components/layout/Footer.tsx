"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { footerLinks } from "@/data/footer";
import { Phone, Mail, FileText, Home, Globe, MessageSquare } from "lucide-react";

interface FooterLinkProps {
  icon: React.ReactNode;
  text: string;
  href: string;
}



const FooterLink = ({ icon, text, href }: FooterLinkProps) => {
  // Check if this is the disclosure document link that should open in a new tab
  const isDisclosureLink = href.includes('Disclosure.pdf');

  return (
    <a
      href={href}
      className="flex gap-2.5 mt-5 leading-none hover:text-yellow-600 transition-colors"
      target={isDisclosureLink ? "_blank" : undefined}
      rel={isDisclosureLink ? "noopener noreferrer" : undefined}
    >
      <span className="w-4 h-4 text-current">{icon}</span>
      <span className="my-auto">{text}</span>
    </a>
  );
};

export const Footer = () => {
  const links = {
    contact: footerLinks.contact.map(link => ({
      ...link,
      icon: link.text.includes('214') ? <Phone className="w-full h-full" /> :
            link.text.includes('@') ? <Mail className="w-full h-full" /> :
            <FileText className="w-full h-full" />
    })),
    navigation: footerLinks.navigation.map(link => ({
      ...link,
      icon: link.text.includes('Home') ? <Home className="w-full h-full" /> :
            link.text.includes('About') ? <Globe className="w-full h-full" /> :
            <MessageSquare className="w-full h-full" />
    })),
  };

  return (
    <footer className="px-5 pt-16 pb-8 mt-auto bg-sky-950 text-sky-100">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="pr-8">
            <div className="inline-block p-2 bg-white rounded">
              <Image src="/images/logo.webp" alt="Mulligan Credit Repair" width={240} height={48} className="h-12" />
            </div>
            <p className="mt-6 text-sm leading-relaxed">
              Mulligan Credit Repair Is Dedicated To Helping Individuals And Businesses Improve Their Credit Scores. Our Personalized Plans And Comprehensive Services Make Us A Trusted Partner In Credit Health. Whether You're Dealing With Unexpected Financial Setbacks Or Looking To Enhance Your Financial Future, We're Here To Help.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold font-['PT_Serif']">Contact Info</h3>
            {links.contact.map((link) => (
              <FooterLink key={link.text} {...link} />
            ))}
          </div>

          <div>
            <h3 className="text-lg font-bold font-['PT_Serif']">Quick Links</h3>
            {links.navigation.map((link) => (
              <FooterLink key={link.text} {...link} />
            ))}
          </div>
        </div>

        <div className="pt-8 mt-16 text-sm text-center border-t border-sky-900">
          <p>© {new Date().getFullYear()} Mulligan Credit Repair. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
