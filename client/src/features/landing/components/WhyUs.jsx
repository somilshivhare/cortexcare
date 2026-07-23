import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ShieldAlert, Heart, ClipboardCheck, Shuffle } from 'lucide-react';

const benefits = [
  {
    title: 'Drastically Reduce Documentation',
    description: 'Relieve clinician burnout. CortexCare structures clinical intakes automatically, freeing up to 2 hours of documentation time per day.',
    icon: Clock,
    color: 'text-indigo-500',
  },
  {
    title: 'Better Clinical Decisions',
    description: 'Empower clinicians with structured summaries. Spot medical histories, symptom progressions, and risk logs compiled before the patient enters the office.',
    icon: ClipboardCheck,
    color: 'text-emerald-500',
  },
  {
    title: 'Unified Patient History',
    description: 'Access clinical context records, doctor audit remarks, timelines, and lab attachments organized chronologically for every consultation.',
    icon: Heart,
    color: 'text-red-500',
  },
  {
    title: 'AI-Assisted Diagnostics Intake',
    description: 'Smart intake questionnaires adjust dynamically to patient replies, prompting for missing details to build complete datasets.',
    icon: Shuffle,
    color: 'text-amber-500',
  },
  {
    title: 'Longitudinal Electronic Medical Record',
    description: 'A single, immutable medical history that follows patients across clinics securely, enabling smooth, cross-facility patient transfers.',
    icon: ShieldAlert,
    color: 'text-blue-500',
  },
];

const WhyUs = () => {
  return (
    <section id="why-us" className="py-24 bg-white dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-450 dark:text-neutral-500 mb-3">
            Why CortexCare
          </h2>
          <h3 className="text-3xl font-extrabold text-neutral-900 dark:text-white sm:text-4xl">
            Streamlining Modern Clinical Workflows
          </h3>
          <p className="mt-4 text-sm text-neutral-550 dark:text-neutral-400">
            Delivering tangible clinical efficiency, secure data sharing, and patient-centered diagnostics.
          </p>
        </div>

        {/* Benefits Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="group flex flex-col p-6 rounded-2xl border border-neutral-150 bg-neutral-50/10 hover:bg-white dark:border-neutral-800 dark:bg-neutral-950/20 dark:hover:bg-neutral-900/40 hover:shadow-xs transition-all duration-200 text-left"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-850 group-hover:scale-105 transition-transform duration-200">
                  <Icon className={`h-5 w-5 ${benefit.color}`} />
                </div>
                <h4 className="mt-6 text-sm font-bold text-neutral-900 dark:text-white group-hover:text-indigo-650 dark:group-hover:text-indigo-400 transition-colors">
                  {benefit.title}
                </h4>
                <p className="mt-2.5 text-xs leading-relaxed text-neutral-550 dark:text-neutral-400">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default WhyUs;
