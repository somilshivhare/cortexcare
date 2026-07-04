import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-neutral-100 bg-white py-12 dark:border-neutral-800 dark:bg-neutral-900 text-neutral-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Logo and info */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 rounded bg-neutral-900 dark:bg-neutral-50" />
              <span className="font-bold tracking-tight text-neutral-900 dark:text-white">CortexCare</span>
            </div>
            <p className="text-xs max-w-xs leading-relaxed">
              Premium AI-powered clinical assistant automating patient intake summaries through ambient WebRTC voice streams.
            </p>
          </div>

          {/* Links Column 1: Product */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-300">Product</h4>
            <ul className="mt-4 space-y-2 text-xs">
              <li><a href="#features" className="hover:text-neutral-950 dark:hover:text-white transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-neutral-950 dark:hover:text-white transition-colors">Process</a></li>
              <li><a href="#security" className="hover:text-neutral-950 dark:hover:text-white transition-colors">Security</a></li>
            </ul>
          </div>

          {/* Links Column 2: Developers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-300">Developers</h4>
            <ul className="mt-4 space-y-2 text-xs">
              <li><a href="#" className="hover:text-neutral-950 dark:hover:text-white transition-colors">GitHub</a></li>
              <li><a href="#" className="hover:text-neutral-950 dark:hover:text-white transition-colors">API Docs</a></li>
              <li><a href="#" className="hover:text-neutral-950 dark:hover:text-white transition-colors">System Status</a></li>
            </ul>
          </div>

          {/* Links Column 3: Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-300">Resources</h4>
            <ul className="mt-4 space-y-2 text-xs">
              <li><a href="#" className="hover:text-neutral-950 dark:hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-neutral-950 dark:hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-neutral-950 dark:hover:text-white transition-colors">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-100 dark:border-neutral-800 pt-6 flex flex-col md:flex-row justify-between items-center text-xs">
          <span>&copy; {new Date().getFullYear()} CortexCare. All rights reserved.</span>
          <span className="mt-2 md:mt-0">Ambient Clinical Assistant Engine</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
