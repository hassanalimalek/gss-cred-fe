import { featureCards } from '../data/features';
import { footerLinks } from '../data/footer';
import { stats } from '../data/stats';
import { faqs } from '../data/faqs';
import { packages } from '../data/packages';

export const COMPANY_NAME = "Mulligan Credit Repair";
export const CONTACT = {
  phone: "1-214-444-9837",
  email: "cred@gznite.com",
};

export const NAVIGATION = footerLinks.navigation.map(link => ({
  label: link.text,
  href: link.href,
  active: link.href === "/"
}));

export const SOCIAL_LINKS = footerLinks.social.map(link => ({
  icon: `/icons/${link.text.toLowerCase()}.svg`,
  href: link.href,
  label: link.text
}));

export const FEATURES = featureCards.map(card => ({
  image: card.imagePath,
  title: card.title,
  description: card.description
}));

export const STATS = stats;
export const FAQS = faqs;
export const PACKAGES = packages;
