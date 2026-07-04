import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Mic, Play, Database, FileText, CheckCircle2 } from 'lucide-react';

const workflowSteps = [
  {
    icon: UserPlus,
    title: 'Patient Intake',
    description: 'Patient registers and joins the secure room.',
  },
  {
    icon: Mic,
    title: 'Voice Session',
    description: 'Ambient consultation captured via WebRTC.',
  },
  {
    icon: Play,
    title: 'AI Processing',
    description: 'BullMQ queues the job; Gemini extracts summaries.',
  },
  {
    icon: Database,
    title: 'Clinical Context',
    description: 'Symptoms, mood indicators, and risk flags are saved.',
  },
  {
    icon: FileText,
    title: 'Doctor Review',
    description: 'Clinician claims the session and appends notes.',
  },
  {
    icon: CheckCircle2,
    title: 'Timeline Finalized',
    description: 'Data is aggregated chronologically and locked.',
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
      
      {/* Title */}
      <div className="text-center">
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 font-mono">
          Workflow
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
          How CortexCare Works
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-500 dark:text-neutral-450">
          A seamless flow orchestrating front-end voice streaming and back-end background worker tasks.
        </p>
      </div>

      {/* Visual Workflow Row */}
      <div className="mt-24 relative">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-12 right-12 hidden h-[1px] -translate-y-1/2 bg-neutral-200 dark:bg-neutral-800 lg:block" />

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-6 lg:gap-8">
          {workflowSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative flex flex-col items-center text-center">
                
                {/* Node circle */}
                <motion.div
                  whileInView={{ scale: [0.95, 1], opacity: [0, 1] }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="z-10 flex h-14 w-14 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-white"
                >
                  <Icon className="h-5 w-5" />
                </motion.div>

                {/* Content */}
                <h3 className="mt-6 text-sm font-bold text-neutral-900 dark:text-white">{step.title}</h3>
                <p className="mt-2 text-[11px] leading-relaxed text-neutral-450 max-w-[160px]">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};

export default HowItWorks;
