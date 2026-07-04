import React from 'react';
import { Sparkles } from 'lucide-react';

const WelcomeHeader = ({ patientName }) => {
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-linear-to-r from-neutral-900 via-neutral-800 to-neutral-950 p-6 md:p-8 text-white shadow-xs dark:border-neutral-800/80">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent)] pointer-events-none" />

      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
            <Sparkles className="h-4.5 w-4.5 text-amber-400 animate-pulse" />
            <span>Workspace</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
            Welcome back, {patientName || 'Guest'}
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Monitor and review your real-time AI clinical context summaries.
          </p>
        </div>

        <div className="flex flex-col text-left md:text-right gap-0.5">
          <span className="text-xs text-neutral-400 font-medium">Current Date</span>
          <span className="text-sm font-semibold text-neutral-200">{formattedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;
