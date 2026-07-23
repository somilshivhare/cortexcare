import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-neutral-100 bg-white py-16 dark:border-neutral-800 dark:bg-neutral-900 text-neutral-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand Info */}
          <div className="col-span-3 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 rounded bg-neutral-900 dark:bg-neutral-50" />
              <span className="font-bold tracking-tight text-neutral-900 dark:text-white">CortexCare</span>
            </div>
            <p className="text-xs max-w-xs leading-relaxed">
              AI-powered Clinical Intake & Patient Management Platform coordinating smart diagnostics and secure EMR portability.
            </p>
          </div>

          {/* Developers & Product */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-300">Product</h4>
            <ul className="mt-4 space-y-2 text-xs">
              <li><a href="#workflow" className="hover:text-neutral-950 dark:hover:text-white transition-colors font-medium">Workflow</a></li>
              <li><a href="#features" className="hover:text-neutral-950 dark:hover:text-white transition-colors font-medium">Features</a></li>
              <li><a href="#showcase" className="hover:text-neutral-950 dark:hover:text-white transition-colors font-medium">Showcase</a></li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-300">Links</h4>
            <ul className="mt-4 space-y-2 text-xs">
              <li><a href="https://github.com/somilshivhare/cortexcare" className="hover:text-neutral-950 dark:hover:text-white transition-colors font-medium">GitHub</a></li>
              <li><a href="#" className="hover:text-neutral-950 dark:hover:text-white transition-colors font-medium">Documentation</a></li>
              <li><a href="#" className="hover:text-neutral-950 dark:hover:text-white transition-colors font-medium">Privacy</a></li>
              <li><a href="#" className="hover:text-neutral-950 dark:hover:text-white transition-colors font-medium">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 border-t border-neutral-100 dark:border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <span>&copy; {new Date().getFullYear()} CortexCare. All rights reserved.</span>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-neutral-950 dark:hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-neutral-950 dark:hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
