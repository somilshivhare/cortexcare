import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const ComparisonSection = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
      
      {/* Title */}
      <div className="text-center">
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 font-mono">
          Efficiency
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
          Designed to Reduce Documentation Load
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-500 dark:text-neutral-450">
          Compare the documentation overhead of traditional charting against CortexCare\'s ambient pipeline.
        </p>
      </div>

      {/* Grid */}
      <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2">
        
        {/* Traditional card (Red, muted border) */}
        <div className="rounded-xl border border-red-200/60 bg-red-50/5 p-8 dark:border-red-950/20 dark:bg-red-950/5">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <h3 className="text-base font-bold">Traditional Clinical Charting</h3>
          </div>
          <ul className="mt-6 space-y-4 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            <li className="flex items-start">
              <span className="mr-2 text-red-500 font-bold">•</span>
              <span>15+ minutes spent manually transcribing patient symptoms after each consultation.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-red-500 font-bold">•</span>
              <span>Higher risk of missing secondary patient-reported symptoms due to admin backlog.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-red-500 font-bold">•</span>
              <span>Administrative fatigue from manual data entry instead of patient care.</span>
            </li>
          </ul>
        </div>

        {/* CortexCare card (Green, premium border) */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-50/5 p-8 dark:border-emerald-550/20 dark:bg-emerald-950/5 shadow-sm">
          <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
            <h3 className="text-base font-bold">The CortexCare Pipeline</h3>
          </div>
          <ul className="mt-6 space-y-4 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            <li className="flex items-start">
              <span className="mr-2 text-emerald-500 font-bold">•</span>
              <span>100% ambient capture: Audio streams securely via WebRTC during the call.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-emerald-500 font-bold">•</span>
              <span>Google Gemini automatically compiles clinical context upon session completion.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-emerald-500 font-bold">•</span>
              <span>Clinicians spend seconds reviewing and finalising automatically generated notes.</span>
            </li>
          </ul>
        </div>

      </div>
    </section>
  );
};

export default ComparisonSection;
