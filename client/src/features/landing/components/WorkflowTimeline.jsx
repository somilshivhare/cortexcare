import React from 'react';
import { motion } from 'framer-motion';
import { User, Cpu, Sparkles, FileText, Activity, ShieldCheck } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Patient Portal Intake',
    description: 'Patient initiates a consultation, selecting symptoms, chief complaint, and providing essential health details.',
    icon: User,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/20',
  },
  {
    id: 2,
    title: 'AI Intake Session',
    description: 'Our system guides the patient through a smart diagnostic intake dialogue, gathering contextual history.',
    icon: Cpu,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50 dark:bg-indigo-950/20',
  },
  {
    id: 3,
    title: 'Gemini Context Analysis',
    description: 'Google Gemini analyzes raw dialogue inputs, mapping symptoms, risk logs, and timeline parameters into structured schemas.',
    icon: Sparkles,
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-950/20',
  },
  {
    id: 4,
    title: 'Clinician Audit & Review',
    description: 'Doctors retrieve unassigned cases, review the clinical synthesis, add personalized remarks, and sign off.',
    icon: FileText,
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/20',
  },
  {
    id: 5,
    title: 'Structured Clinical Summary',
    description: 'An Electronic Medical Record (EMR) is compiled, locking the notes, prescriptions, and diagnosis in the repository.',
    icon: Activity,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/20',
  },
  {
    id: 6,
    title: 'Longitudinal Portability',
    description: 'When patients switch clinics, their unified medical record follows them instantly, ensuring continuity of care.',
    icon: ShieldCheck,
    color: 'text-rose-500',
    bg: 'bg-rose-50 dark:bg-rose-950/20',
  },
];

const WorkflowTimeline = () => {
  return (
    <section id="workflow" className="relative py-24 bg-white dark:bg-neutral-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-450 dark:text-neutral-500 mb-3">
            Workflow Timeline
          </h2>
          <h3 className="text-3xl font-extrabold text-neutral-900 dark:text-white sm:text-4xl">
            From Patient Intake to Longitudinal EMR
          </h3>
          <p className="mt-4 text-sm text-neutral-550 dark:text-neutral-400">
            A secure, automated healthcare pipeline coordinating AI synthesis and physician reviews.
          </p>
        </div>

        {/* Timeline Path */}
        <div className="relative">
          {/* Central Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-neutral-100 dark:bg-neutral-800 -translate-x-1/2 hidden md:block" />

          <div className="space-y-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <div key={step.id} className="relative flex flex-col md:flex-row md:items-center">
                  
                  {/* Icon Node */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-neutral-900 border-2 border-neutral-150 dark:border-neutral-800 shadow-xs">
                    <Icon className={`h-4.5 w-4.5 ${step.color}`} />
                  </div>

                  {/* Left Side Content (Even steps) */}
                  <div className={`pl-14 md:pl-0 md:w-1/2 md:pr-12 flex ${isEven ? 'md:justify-end' : 'md:hidden'}`}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-100px' }}
                      transition={{ duration: 0.5 }}
                      className="max-w-md rounded-2xl border border-neutral-200/80 bg-neutral-50/20 p-6 dark:border-neutral-800/80 dark:bg-neutral-900/40"
                    >
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">
                        Step 0{step.id}
                      </span>
                      <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                        {step.title}
                      </h4>
                      <p className="mt-2 text-xs leading-relaxed text-neutral-550 dark:text-neutral-400">
                        {step.description}
                      </p>
                    </motion.div>
                  </div>

                  {/* Spacer for MD screens */}
                  <div className="hidden md:block md:w-1/2" />

                  {/* Right Side Content (Odd steps) */}
                  <div className={`pl-14 md:pl-12 md:w-1/2 flex ${!isEven ? 'md:justify-start' : 'hidden md:flex'}`}>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-100px' }}
                      transition={{ duration: 0.5 }}
                      className="max-w-md rounded-2xl border border-neutral-200/80 bg-neutral-50/20 p-6 dark:border-neutral-800/80 dark:bg-neutral-900/40"
                    >
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">
                        Step 0{step.id}
                      </span>
                      <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                        {step.title}
                      </h4>
                      <p className="mt-2 text-xs leading-relaxed text-neutral-550 dark:text-neutral-400">
                        {step.description}
                      </p>
                    </motion.div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default WorkflowTimeline;
