import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Mic, Cpu, FileText, CheckCircle2, Loader2 } from 'lucide-react';

const ProductDemo = () => {
  const [activeStep, setActiveStep] = useState(0);

  const demoSteps = [
    {
      title: '1. Ambient Capture',
      desc: 'The patient describes symptoms via WebRTC microphone streaming. Chunks are cached.',
      icon: Mic,
    },
    {
      title: '2. Gemini Synthesis',
      desc: 'BullMQ triggers background processing. Gemini extracts structured clinical context.',
      icon: Cpu,
    },
    {
      title: '3. Doctor Review',
      desc: 'The physician reviews findings, claims the session, and writes notes.',
      icon: FileText,
    },
    {
      title: '4. Timeline Saved',
      desc: 'All transcripts, AI logs, and notes are aggregated chronologically and locked.',
      icon: CheckCircle2,
    },
  ];

  // Auto-advance loop for demonstration
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % demoSteps.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 rounded-lg border border-neutral-100 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
              >
                <Mic className="h-5 w-5" />
              </motion.div>
              <div>
                <p className="text-[10px] font-bold text-neutral-400">AMBER CAPTURE ENGINE</p>
                <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">Listening to consult...</p>
              </div>
            </div>
            <div className="rounded-lg border border-neutral-100 p-4 dark:border-neutral-800">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Live Transcript Chunk</p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="mt-1 text-xs italic text-neutral-600 dark:text-neutral-300"
              >
                "I feel a throbbing pain in my temples when standing up, and my vision blurred slightly for about two seconds."
              </motion.p>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-neutral-400">GEMINI PROCESSING</p>
                  <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">Compiling context...</p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 className="h-4 w-4 text-purple-600" />
              </motion.div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded border border-neutral-100 p-3 dark:border-neutral-800"
              >
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Symptoms</span>
                <p className="mt-1 text-xs font-semibold text-neutral-700 dark:text-neutral-200">Vestibular Pain, Blurry Vision</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="rounded border border-neutral-100 p-3 dark:border-neutral-800"
              >
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Evaluation</span>
                <p className="mt-1 text-xs font-semibold text-amber-600">Moderate Flag</p>
              </motion.div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
              <div>
                <h4 className="text-[10px] font-bold text-neutral-400">CLAIMED CLINICIAN</h4>
                <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">Dr. Sarah Jenkins</p>
              </div>
              <span className="rounded bg-indigo-50 px-2 py-0.5 text-[9px] font-bold text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400">
                IN_REVIEW
              </span>
            </div>
            <div>
              <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Clinician Note Editor</label>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="mt-1 min-h-[80px] rounded border border-neutral-150 bg-neutral-50 p-2.5 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-350 leading-relaxed"
              >
                Patient displays dizziness on standing. Normal cardiac profile. Recommend hydration increase and postural check in 1 week.
              </motion.div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-neutral-100 bg-emerald-50/10 px-4 py-3 dark:border-neutral-900">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>Consultation Finalized & Locked</span>
              </div>
              <span className="text-[9px] text-neutral-400 font-semibold">180s Total</span>
            </div>
            <div className="space-y-2 text-[11px] text-neutral-500">
              <div className="flex justify-between">
                <span>Intake consultation created</span>
                <span className="font-semibold">14:02:00</span>
              </div>
              <div className="flex justify-between">
                <span>AI Clinical context extracted</span>
                <span className="font-semibold">14:05:12</span>
              </div>
              <div className="flex justify-between">
                <span>Clinician review notes saved</span>
                <span className="font-semibold">14:15:30</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section id="product-demo" className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 font-mono">
          Walkthrough
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
          CortexCare in Action
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-500 dark:text-neutral-450">
          Observe how CortexCare coordinates frontend audio capture and backend AI worker tasks into a finalized clinician timeline.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
        {/* Left selector steps */}
        <div className="lg:col-span-5 space-y-3">
          {demoSteps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = idx === activeStep;
            return (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`w-full rounded-xl border p-5 text-left transition-all ${
                  isActive
                    ? 'border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900'
                    : 'border-transparent hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-md border ${
                    isActive ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : 'bg-neutral-50 text-neutral-400 dark:bg-neutral-950'
                  }`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{step.title}</h3>
                </div>
                <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {step.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right mockup window */}
        <div className="lg:col-span-7">
          <div className="rounded-xl border border-neutral-200/80 bg-white shadow-lg overflow-hidden dark:border-neutral-800 dark:bg-neutral-900">
            {/* Header bar */}
            <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50/50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900/50">
              <div className="flex space-x-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
              </div>
              <span className="text-[10px] font-medium text-neutral-400">cortexcare.app/demo-walkthrough</span>
              <div className="w-10" />
            </div>

            {/* Display panel */}
            <div className="min-h-[240px] p-6 bg-white dark:bg-neutral-900">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Step indicators */}
            <div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50/50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900/50">
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Step {activeStep + 1} of 4</span>
              <button
                onClick={() => setActiveStep((activeStep + 1) % demoSteps.length)}
                className="flex items-center space-x-1.5 rounded bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-850 transition-colors dark:bg-white dark:text-neutral-950"
              >
                <span>{activeStep === 3 ? 'Restart Demo' : 'Next Step'}</span>
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
