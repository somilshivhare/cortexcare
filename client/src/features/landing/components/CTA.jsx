import React from 'react';
import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl bg-neutral-900 px-8 py-20 text-center text-white shadow-xl dark:bg-neutral-900">
        
        {/* Glow Blobs */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-neutral-800 blur-3xl opacity-40" />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-neutral-800 blur-3xl opacity-40" />

        <div className="relative z-10 mx-auto max-w-3xl">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Spend Less Time Charting. <br className="hidden sm:block" />
            <span className="text-neutral-400">More Time Caring for Patients.</span>
          </h2>
          <p className="mt-4 text-xs text-neutral-400 leading-relaxed max-w-lg mx-auto">
            Set up your secure, clinic-restricted medical workspace. Authenticate statelessly and reduce your charting load today.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link
              to="/auth/register"
              className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-neutral-950 hover:bg-neutral-100 transition-all active:scale-[0.98]"
            >
              Create Free Account
            </Link>
            <a
              href="#product-demo"
              className="rounded-md border border-neutral-700 bg-neutral-850 px-6 py-3 text-sm font-semibold hover:bg-neutral-800 transition-colors"
            >
              Explore Live Demo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
