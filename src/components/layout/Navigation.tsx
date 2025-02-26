"use client";
import React, { useState, useEffect } from "react";

interface NavLink {
  name: string;
  href: string;
}

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const links: NavLink[] = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "FAQ", href: "#faq" },
    { name: "Contact", href: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = links.map(link => document.querySelector(link.href));
      const scrollPosition = window.scrollY + 100;

      sections.forEach((section, index) => {
        if (section) {
          const sectionTop = (section as HTMLElement).offsetTop;
          const sectionBottom = sectionTop + (section as HTMLElement).clientHeight;

          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            setActiveSection(links[index].name.toLowerCase());
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [links]);

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center px-20 py-7 w-full bg-white text-sky-950 max-md:px-5">
      <div className="flex items-center gap-10 text-base font-medium leading-none max-md:hidden">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className={`${activeSection === link.name.toLowerCase() ? "text-yellow-600" : "hover:text-yellow-600"} transition-colors`}
            onClick={(e) => {
              e.preventDefault();
              const element = document.querySelector(link.href);
              element?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {link.name}
          </a>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <button
        className="hidden max-md:block"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 hidden max-md:block bg-white border-t border-gray-200">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`block px-5 py-3 ${activeSection === link.name.toLowerCase() ? "text-yellow-600" : "hover:text-yellow-600"} transition-colors`}
              onClick={(e) => {
                e.preventDefault();
                const element = document.querySelector(link.href);
                element?.scrollIntoView({ behavior: "smooth" });
                setIsOpen(false);
              }}
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};
