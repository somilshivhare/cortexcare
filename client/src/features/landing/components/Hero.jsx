import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Cpu, FileText, CheckCircle2, Loader2 } from 'lucide-react';

const workflowStates = [
  {
    id: 'voice',
    label: '1. Voice Active',
    icon: Mic,
    content: (
      <div className="flex h-full flex-col justify-between p-6 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
        <div>
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <span className="text-xs font-bold text-neutral-400">SESSION ID: #INTAKE-2026</span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-950/30">LISTENING</span>
          </div>
          <div className="mt-6 flex flex-col items-center">
            {/* Live Audio Visualizer Wave */}
            <div className="flex h-10 items-center justify-center space-x-1">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-neutral-900 dark:bg-neutral-100 rounded-full"
                  animate={{
                    height: [12, 36, 16, 28, 8, 42, 12][(i + 2) % 7],
                  }}
                  transition={{
                    duration: 1.1,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.08,
                  }}
                />
              ))}
            </div>
            <p className="mt-4 text-[10px] font-semibold tracking-wider uppercase text-neutral-400">Capturing Ambient Consult</p>
          </div>
        </div>
        <div className="rounded-lg border border-neutral-150 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-950/50">
          <p className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Live Transcript Stream</p>
          <p className="mt-1.5 text-xs italic text-neutral-600 dark:text-neutral-300">
            "I have been having orthostatic drops, a dull headache behind my temples, and some minor nausea when sitting up quickly."
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'processing',
    label: '2. AI Synthesizing',
    icon: Loader2,
    content: (
      <div className="flex h-full flex-col items-center justify-center p-6 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-neutral-400"
        >
          <Loader2 className="h-10 w-10 text-neutral-900 dark:text-white" />
        </motion.div>
        <h4 className="mt-4 text-sm font-bold">Processing Clinical Summary</h4>
        <p className="mt-1 text-xs text-neutral-400">BullMQ worker executing Gemini JSON schema extraction...</p>
      </div>
    ),
  },
  {
    id: 'context',
    label: '3. Context Generated',
    icon: Cpu,
    content: (
      <div className="h-full p-6 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white overflow-y-auto">
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
          <span className="text-xs font-bold text-neutral-400">GEMINI CLINICAL CONTEXT</span>
          <span className="rounded bg-indigo-50 border border-indigo-100 px-2 py-0.5 text-[9px] font-bold text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-800">
            COMPLETED
          </span>
        </div>
        <div className="mt-4 space-y-4">
          <div>
            <h5 className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Extracted Symptoms</h5>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {['Orthostatic Irregularity', 'Vestibular Headache', 'Dizziness'].map((tag) => (
                <span key={tag} className="rounded bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h5 className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Risk Evaluation</h5>
            <div className="mt-1.5 flex items-center space-x-2 text-xs font-semibold text-amber-600">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-pulse" />
              <span>Potential vestibular drop on rapid postural change. Recommended check.</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'review',
    label: '4. Doctor Review',
    icon: FileText,
    content: (
      <div className="flex h-full flex-col justify-between p-6 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
        <div>
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <span className="text-xs font-bold text-neutral-400">CLINICAL REMARKS</span>
            <span className="text-xs text-neutral-500 font-medium">Dr. Sarah Jenkins</span>
          </div>
          <div className="mt-4">
            <label className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Clinician Remarks</label>
            <div className="mt-1.5 min-h-[90px] rounded border border-neutral-150 bg-neutral-50/50 p-3 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-350 leading-relaxed">
              Patient presents with postural headache. Checked blood pressure logs. Recommend hydration increases, orthostatic stand-up checks, and return to clinic in 1 week if dizziness persists.
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-2 rounded bg-neutral-900 py-2.5 text-xs font-bold text-white dark:bg-white dark:text-neutral-900">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <span>Consultation Reviewed</span>
        </div>
      </div>
    ),
  },
  {
    id: 'timeline',
    label: '5. Timeline Finalized',
    icon: CheckCircle2,
    content: (
      <div className="h-full p-6 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white overflow-y-auto">
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
          <span className="text-xs font-bold text-neutral-400">CHRONOLOGICAL AUDIT</span>
          <span className="text-[10px] text-neutral-400">Duration: 180 seconds</span>
        </div>
        <div className="mt-4 space-y-4">
          <div className="flex items-start space-x-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <div>
              <p className="text-[10px] font-bold text-neutral-400">14:02 - SESSION INITIALIZED</p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">Patient intake voice connection started.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
            <div>
              <p className="text-[10px] font-bold text-neutral-400">14:05 - AI SUMMARY COMPILED</p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">Google Gemini symptoms JSON written.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
            <div>
              <p className="text-[10px] font-bold text-neutral-400">14:12 - PHYSICIAN NOTES SAVED</p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">Dr. Sarah Jenkins approved notes. Session locked.</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

const Hero = () => {
  const [activeState, setActiveState] = useState(0);

  // Smooth automatic workflow transitions every 4.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveState((prev) => (prev + 1) % workflowStates.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-white px-4 py-24 dark:bg-neutral-900 sm:px-6 lg:px-8">
      {/* Background ambient blobs (No neon) */}
      <div className="absolute top-0 left-1/4 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-neutral-100/40 blur-[130px] dark:bg-neutral-800/10" />
      <div className="absolute bottom-0 right-1/4 h-[350px] w-[350px] translate-x-1/2 rounded-full bg-neutral-100/40 blur-[130px] dark:bg-neutral-800/10" />

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:items-center">
          
          {/* Left Hero copy (40% width) */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-5xl md:text-6xl"
            >
              Clinical summaries from ambient voice.
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-2 text-2xl font-bold text-neutral-400 dark:text-neutral-500 sm:text-3xl"
            >
              Built for modern healthcare.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-base leading-relaxed text-neutral-500 dark:text-neutral-450"
            >
              CortexCare ambient intelligence listens to patient consultations, automatically extracts symptoms, structures clinical context, and reduces documentation load.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link
                to="/auth/register"
                className="rounded-md bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-850 transition-all active:scale-[0.98] dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100"
              >
                Create Free Account
              </Link>
              <a
                href="#product-demo"
                className="rounded-md border border-neutral-200 bg-white px-6 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Explore Live Demo
              </a>
            </motion.div>
          </div>

          {/* Right Product Mockup (60% width - Primary focus) */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="w-full rounded-xl border border-neutral-200 bg-white shadow-xl overflow-hidden dark:border-neutral-800 dark:bg-neutral-900"
            >
              {/* Browser Header Bar */}
              <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50/50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900/50">
                <div className="flex space-x-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                </div>
                <div className="text-[10px] font-medium text-neutral-400 select-none">
                  cortexcare.app/console
                </div>
                <div className="w-10" />
              </div>

              {/* Looping status tracker nav */}
              <div className="flex border-b border-neutral-100 bg-white px-2 py-1.5 dark:border-neutral-800 dark:bg-neutral-900 overflow-x-auto scrollbar-none">
                {workflowStates.map((state, idx) => {
                  const Icon = state.icon;
                  const isActive = idx === activeState;
                  return (
                    <button
                      key={state.id}
                      onClick={() => setActiveState(idx)}
                      className={`flex items-center space-x-1.5 rounded px-3 py-1.5 text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white'
                          : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                      }`}
                    >
                      <Icon className={`h-3.5 w-3.5 ${isActive && state.id === 'processing' ? 'animate-spin' : ''}`} />
                      <span className="whitespace-nowrap">{state.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Display Viewport */}
              <div className="relative h-72 bg-white dark:bg-neutral-900">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeState}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25 }}
                    className="h-full w-full"
                  >
                    {workflowStates[activeState].content}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
