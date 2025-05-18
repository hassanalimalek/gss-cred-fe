'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const LoginNavbar: React.FC = () => {
  return (
    <header className="w-full bg-white shadow-sm py-4">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center md:justify-start">
          <Link href="/" className="flex items-center">
            <Image 
              src="/images/logo.webp" 
              alt="Mulligan Credit Repair" 
              width={320}
              height={220}
              className="h-10 w-auto" 
              priority
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default LoginNavbar;
