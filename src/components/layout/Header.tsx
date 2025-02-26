'use client'
import React, { useState, useCallback } from 'react';
import { PhoneIcon, EnvelopeIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { Linkedin, Facebook, Twitter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { NavigationItem } from './NavigationItem';
import { fadeIn } from '@/utils/animations';

interface HeaderProps {
  phone: string;
  email: string;
}

const navigationItems = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/updates', label: 'Updates' },
  { path: '/contact', label: 'Contact' },
];

const Header = React.memo(({ phone, email }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prevState => !prevState);
  }, []);

  const isActive = useCallback((path: string) => pathname === path, [pathname]);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <header className="w-full relative z-50">
      {/* Top bar with contact info and social icons */}
      <div className="bg-gray-200 py-3 px-4">
        <div className="w-full md:w-[90%] mx-auto flex justify-between items-center">
          <div className="flex space-x-6">
            {/* Phone number */}
            <a href={`tel:${phone}`} className="flex items-center min-h-[44px] min-w-[44px]">
              <PhoneIcon className="w-5 h-5 mr-2 text-gray-600" />
              <span className="text-gray-600 font-medium text-base">{phone}</span>
            </a>
            
            {/* Email */}
            <a href={`mailto:${email}`} className="flex items-center hidden sm:flex min-h-[44px] min-w-[44px]">
              <EnvelopeIcon className="w-5 h-5 mr-2 text-gray-600" />
              <span className="text-gray-600 font-medium text-base">{email}</span>
            </a>
          </div>
          
          {/* Social media icons */}
          <div className="flex space-x-5">
            <a href="#" aria-label="LinkedIn" className="text-gray-600 hover:text-blue-600 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
              <Linkedin className="w-5 h-5 fill-current" />
            </a>
            <a href="#" aria-label="Facebook" className="text-gray-600 hover:text-blue-600 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
              <Facebook className="w-5 h-5 fill-current" />
            </a>
            <a href="#" aria-label="Twitter" className="text-gray-600 hover:text-blue-600 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
              <Twitter className="w-5 h-5 fill-current" />
            </a>
          </div>
        </div>
      </div>
      
      {/* Main navigation bar */}
      <div className="bg-white py-5 px-2 shadow-sm">
        <div className="w-full md:w-[90%] mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <Image 
                src="/images/logo.webp" 
                alt="Mulligan Credit Repair" 
                width={120}
                height={40}
                className="h-10 w-auto" 
                priority
              />
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex">
            <ul className="flex space-x-10">
              {navigationItems.map((item) => (
                <NavigationItem 
                  key={item.path}
                  href={item.path} 
                  isActive={isActive(item.path)}
                >
                  {item.label}
                </NavigationItem>
              ))}
            </ul>
          </nav>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 min-h-[44px] min-w-[44px]"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            id="mobile-menu"
            className="md:hidden bg-white shadow-md"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="px-4 pb-4 overflow-hidden max-h-[calc(100vh-120px)] overflow-y-auto">
              <ul className="space-y-4">
                {navigationItems.map((item) => (
                  <NavigationItem 
                    key={item.path}
                    href={item.path} 
                    isActive={isActive(item.path)}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </NavigationItem>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;