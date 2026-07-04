import React from 'react';
import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl bg-neutral-900 px-8 py-16 text-center text-white shadow-xl dark:bg-neutral-900">
        
        {/* Glow */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-neutral-800 blur-3xl opacity-50" />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-neutral-800 blur-3xl opacity-50" />

        <div className="relative z-10 mx-auto max-w-2xl">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Empower Your Clinical Workflow Today
          </h2>
          <p className="mt-4 text-xs text-neutral-400 leading-relaxed">
            Register your clinic, configure custom invite keys, and automate clinical summary compilations in seconds.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link
              to="/auth/register"
              className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-neutral-950 hover:bg-neutral-100 transition-all active:scale-[0.98]"
            >
              Create Free Account
            </Link>
            <Link
              to="/auth/login"
              className="rounded-md border border-neutral-700 bg-neutral-850 px-6 py-3 text-sm font-semibold hover:bg-neutral-800 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
