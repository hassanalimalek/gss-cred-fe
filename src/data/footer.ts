export interface FooterLink {
  icon?: React.ReactNode;
  text: string;
  href: string;
}

export interface FooterLinks {
  contact: FooterLink[];
  navigation: FooterLink[];
  social: FooterLink[];
}

export const footerLinks = {
  contact: [
    { text: "1-214-444-9837", href: "tel:12144449837" },
    { text: "Cred@Gznite.Com", href: "mailto:Cred@Gznite.Com" },
    { text: "Disclosure Document", href: "/disclosure" },
  ],
  navigation: [
    { text: "Home", href: "/" },
    { text: "About Us", href: "/about" },
    { text: "Contact Us", href: "/contact" },
    { text: "Testimonials", href: "/testimonials" },
  ],
  social: [
    { text: "Facebook", href: "https://facebook.com" },
    { text: "Twitter", href: "https://twitter.com" },
    { text: "Instagram", href: "https://instagram.com" },
  ],
};