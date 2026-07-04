import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Check, ChevronRight, User, Cpu, ShieldAlert, BadgeCheck } from 'lucide-react';

const demoSteps = [
  {
    id: 'step1',
    title: '1. Patient Intake',
    subtitle: 'Real-time transcript capture',
    badge: 'ACTIVE',
    badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800',
    description: 'The patient joins the consultation room and begins describing their symptoms. Audio is captured via WebRTC, and chronological segments are saved.',
    content: (
      <div className="space-y-4">
        <div className="flex items-center space-x-3 rounded-lg border border-neutral-100 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <User className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-400">PATIENT INTENSITY WAVEFORM</p>
            <div className="mt-1 flex items-center space-x-0.5">
              {[12, 24, 8, 32, 16, 44, 28, 12, 36, 16, 20].map((h, i) => (
                <div key={i} style={{ height: `${h}px` }} className="w-1 bg-emerald-500 rounded-sm" />
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-neutral-100 p-4 dark:border-neutral-800">
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">TRANSCRIPT STREAM</p>
          <div className="mt-2 space-y-2 text-xs">
            <p className="text-neutral-500"><strong className="text-neutral-700 dark:text-neutral-300">Intake Bot:</strong> How can I help you today?</p>
            <p className="italic text-neutral-600 dark:text-neutral-300">
              "I have been feeling dizzy since yesterday. When I stand up, everything feels like it is spinning and I have a sharp pain in my temples."
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'step2',
    title: '2. AI Synthesis',
    subtitle: 'Gemini structures clinical context',
    badge: 'COMPLETED',
    badgeColor: 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-800',
    description: 'When the intake session ends, BullMQ queues the job. The Gemini model parses the transcript and outputs schema-locked clinical logs.',
    content: (
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Gemini Extraction</p>
              <p className="text-xs text-neutral-400">Accuracy Score: 96.8%</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded border border-neutral-100 p-3 dark:border-neutral-800">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Symptoms</span>
            <p className="mt-1 text-xs font-semibold text-neutral-700 dark:text-neutral-200">Vestibular Dizziness, Temples Pain</p>
          </div>
          <div className="rounded border border-neutral-100 p-3 dark:border-neutral-800">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Risk Level</span>
            <p className="mt-1 text-xs font-semibold text-amber-600">Moderate Flag</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'step3',
    title: '3. Doctor Review',
    subtitle: 'Clinician dashboard verification',
    badge: 'IN_REVIEW',
    badgeColor: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800',
    description: 'The dashboard lists the unassigned patient intake. The clinician claims the case, reviews the extracted symptoms, and submits clinical notes.',
    content: (
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
          <div>
            <h4 className="text-xs font-bold text-neutral-400">ASSIGNED CLINICIAN</h4>
            <p className="text-xs font-medium text-neutral-600 dark:text-neutral-300">Dr. Sarah Jenkins (Neurology)</p>
          </div>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-600 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400">
            Notes Locked
          </span>
        </div>
        <div>
          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Clinician Notes Editor</label>
          <div className="mt-1.5 min-h-[80px] rounded border border-neutral-100 bg-neutral-50 p-3 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
            Patient complains of positional dizziness. Checked for orthostatic drop. Initiated blood pressure review logs. Hydration prescribed.
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'step4',
    title: '4. Timeline Saved',
    subtitle: 'Chronological event aggregate',
    badge: 'REVIEWED',
    badgeColor: 'bg-neutral-100 text-neutral-800 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700',
    description: 'Once reviewed, the consultation is finalized. CortexCare compiles all transcripts, AI summaries, and clinician notes into a chronological record.',
    content: (
      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950">
          <div className="flex items-center space-x-2 text-xs font-bold text-neutral-600 dark:text-neutral-300">
            <BadgeCheck className="h-4 w-4 text-emerald-500" />
            <span>Consultation Lifecycle Finalized</span>
          </div>
          <span className="text-[10px] text-neutral-400 font-semibold">180s Total</span>
        </div>
        <div className="space-y-1.5 text-[11px] text-neutral-500">
          <div className="flex justify-between">
            <span>Intake Audio session started</span>
            <span className="font-semibold text-neutral-600 dark:text-neutral-400">14:02:00</span>
          </div>
          <div className="flex justify-between">
            <span>Gemini Summary generated</span>
            <span className="font-semibold text-neutral-600 dark:text-neutral-400">14:05:12</span>
          </div>
          <div className="flex justify-between">
            <span>Dr. Jenkins notes claimed & reviewed</span>
            <span className="font-semibold text-neutral-600 dark:text-neutral-400">14:15:30</span>
          </div>
        </div>
      </div>
    ),
  },
];

const ProductDemo = () => {
  const [activeStep, setActiveStep] = useState(0);

  const nextStep = () => {
    setActiveStep((prev) => (prev + 1) % demoSteps.length);
  };

  return (
    <section id="product-demo" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100">
          Walkthrough
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
          CortexCare in Action
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-500 dark:text-neutral-400">
          Follow the step-by-step clinical flow from the patient intake call to the doctor note submission.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
        {/* Left Side: Step Selectors */}
        <div className="lg:col-span-5 space-y-4">
          {demoSteps.map((step, idx) => {
            const isActive = idx === activeStep;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={`w-full rounded-xl border p-5 text-left transition-all ${
                  isActive
                    ? 'border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900'
                    : 'border-transparent hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-wider text-neutral-400">{step.title}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${step.badgeColor}`}>
                    {step.badge}
                  </span>
                </div>
                <h3 className="mt-2 text-base font-bold text-neutral-900 dark:text-white">{step.subtitle}</h3>
                <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">{step.description}</p>
              </button>
            );
          })}
        </div>

        {/* Right Side: Interactive Mock Screen */}
        <div className="lg:col-span-7">
          <div className="rounded-xl border border-neutral-200/80 bg-white shadow-lg overflow-hidden dark:border-neutral-800 dark:bg-neutral-900">
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50/50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900/50">
              <div className="flex space-x-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                <div className="h-2.5 w-2.5 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                <div className="h-2.5 w-2.5 rounded-full bg-neutral-200 dark:bg-neutral-700" />
              </div>
              <span className="text-[10px] font-medium text-neutral-400">cortexcare.app/intake-engine</span>
              <div className="w-10" />
            </div>

            {/* Content with transition animations */}
            <div className="min-h-[260px] p-6 bg-white dark:bg-neutral-900">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="h-full"
                >
                  {demoSteps[activeStep].content}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Mock Bottom Actions */}
            <div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50/50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900/50">
              <span className="text-xs font-semibold text-neutral-400">Step {activeStep + 1} of 4</span>
              <button
                onClick={nextStep}
                className="flex items-center space-x-1.5 rounded bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors dark:bg-white dark:text-neutral-950"
              >
                <span>{activeStep === 3 ? 'Restart Flow' : 'Next Step'}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDemo;
