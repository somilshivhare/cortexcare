import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext.jsx';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Security', href: '#security' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-neutral-200/80 bg-white/70 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-900/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <div className="h-5 w-5 rounded bg-neutral-900 dark:bg-neutral-50" />
            <span className="font-bold tracking-tight text-neutral-900 dark:text-neutral-50">CortexCare</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden space-x-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop CTA Actions */}
          <div className="hidden items-center space-x-4 md:flex">
            <button
              onClick={toggleTheme}
              className="rounded-md p-2 text-neutral-450 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
            </button>
            <Link
              to="/auth/login"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/auth/register"
              className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition-all active:scale-[0.98] dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center rounded-md p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-500 focus:outline-none dark:hover:bg-neutral-800"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="border-b border-neutral-200 bg-white px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900 md:hidden">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-col space-y-3">
              <button
                onClick={() => {
                  toggleTheme();
                  setIsOpen(false);
                }}
                className="flex items-center justify-center space-x-2 rounded-md border border-neutral-200 dark:border-neutral-805 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="h-4 w-4" />
                    <span>Dark Theme</span>
                  </>
                ) : (
                  <>
                    <Sun className="h-4 w-4" />
                    <span>Light Theme</span>
                  </>
                )}
              </button>
              <Link
                to="/auth/login"
                onClick={() => setIsOpen(false)}
                className="text-center text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/auth/register"
                onClick={() => setIsOpen(false)}
                className="rounded-md bg-neutral-900 py-2.5 text-center text-sm font-medium text-white hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
