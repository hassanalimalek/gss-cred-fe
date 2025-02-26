"use client";
import React from "react";

interface NavItemProps {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export const NavigationItem = React.memo(({ 
  href, 
  isActive, 
  children,
  onClick 
}: NavItemProps) => (
  <li>
    <a 
      href={href} 
      onClick={onClick}
      className={`font-medium font-montserrat text-lg capitalize transition-colors duration-200 ${
        isActive ? 'text-yellow-600 hover:text-yellow-700' : 'text-gray-700 hover:text-yellow-600'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </a>
  </li>
));

NavigationItem.displayName = 'NavigationItem';
