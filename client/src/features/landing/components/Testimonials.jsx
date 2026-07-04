import React from 'react';
import { BadgeAlert, ClipboardList, ShieldAlert } from 'lucide-react';

const Testimonials = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
      
      {/* Title */}
      <div className="text-center">
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 font-mono">
          Workflows
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
          Designed Around Modern Clinical Demands
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-500 dark:text-neutral-450">
          CortexCare reduces administrative charting fatigue so doctors can spend their time with patients.
        </p>
      </div>

      {/* Grid of design principles */}
      <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
        
        <div className="rounded-xl border border-neutral-200/80 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
            <ClipboardList className="h-5 w-5" />
          </div>
          <h3 className="mt-6 text-sm font-bold text-neutral-900 dark:text-white">Structured Intakes</h3>
          <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            Patients describe symptoms in conversational language before entering the clinic. The system parses audio, mapping key complaints to structured files automatically.
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200/80 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
            <BadgeAlert className="h-5 w-5" />
          </div>
          <h3 className="mt-6 text-sm font-bold text-neutral-900 dark:text-white">Human-in-the-Loop AI</h3>
          <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-450">
            Clinical context models synthesize symptoms, mood patterns, and orthostatic safety flags. The doctor retains final authority to review, update, and lock records.
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200/80 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <h3 className="mt-6 text-sm font-bold text-neutral-900 dark:text-white">Clinic Onboarding Boundaries</h3>
          <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            Clinics establish private alphanumeric codes for doctor and patient enrollment, ensuring strict isolation and preventing unauthorized database reads.
          </p>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
