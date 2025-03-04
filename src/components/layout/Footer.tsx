"use client";
import { motion } from "framer-motion";
import { Phone, Mail, FileText, Home, Globe, MessageSquare, Facebook, Twitter, Instagram } from "lucide-react";
import Image from "next/image";
import { footerLinks } from "@/data/footer";

interface FooterLinkProps {
  icon: React.ReactNode;
  text: string;
  href: string;
}

const fadeIn = (direction: "up" | "down" = "up", delay: number = 0) => ({
  initial: { y: direction === "up" ? 40 : -40, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: {
    duration: 0.8,
    ease: [0.43, 0.13, 0.23, 0.96],
    delay,
  },
});

const FooterLink = ({ icon, text, href }: FooterLinkProps) => (
  <a
    href={href}
    className="flex gap-2.5 mt-5 leading-none hover:text-yellow-600 transition-colors"
  >
    <span className="w-4 h-4 text-current">{icon}</span>
    <span className="my-auto">{text}</span>
  </a>
);

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
    social: footerLinks.social.map(link => ({
      ...link,
      icon: link.text.includes('Facebook') ? <Facebook className="w-full h-full" /> :
            link.text.includes('Twitter') ? <Twitter className="w-full h-full" /> :
            <Instagram className="w-full h-full" />
    })),
  };

  return (
    <motion.footer 
      {...fadeIn("up", 0)}
      className="px-5 pt-16 pb-8 mt-auto bg-sky-950 text-sky-100"
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="pr-8">
            <div className="inline-block p-2 bg-white rounded">
              <Image src="/images/logo.webp" alt="Mulligan Credit Repair" width={240} height={48} className="h-12" />
            </div>
            <p className="mt-6 text-sm leading-relaxed">
              Mulligan Credit Repair Is Dedicated To Helping Individuals And Businesses Improve Their Credit Scores. Our Personalized Plans And Comprehensive Services Make Us A Trusted Partner In Credit Health. Whether You&apos;re Dealing With Unexpected Financial Setbacks Or Looking To Enhance Your Financial Future, We&apos;re Here To Help.
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

          <div>
            <h3 className="text-lg font-bold font-['PT_Serif']">Follow Us</h3>
            {links.social.map((link) => (
              <FooterLink key={link.text} {...link} />
            ))}
          </div>
        </div>

        <div className="pt-8 mt-16 text-sm text-center border-t border-sky-900">
          <p>© {new Date().getFullYear()} Mulligan Credit Repair. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  );
};
