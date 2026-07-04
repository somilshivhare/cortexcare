import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Cpu, ShieldCheck, Clock } from 'lucide-react';

const mockScreens = [
  {
    id: 'voice',
    title: 'Voice Intake',
    icon: Mic,
    content: (
      <div className="flex h-full flex-col justify-between p-6 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
        <div>
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <span className="text-sm font-bold tracking-tight text-neutral-500">SESSION: #98A7D</span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:bg-emerald-950/30">ACTIVE</span>
          </div>
          <div className="mt-6 flex flex-col items-center">
            {/* Audio Waveform Animation */}
            <div className="flex h-12 items-center justify-center space-x-1">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-neutral-900 dark:bg-white rounded"
                  animate={{
                    height: [16, 44, 20, 36, 12, 48, 16][(i + 2) % 7],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
            <p className="mt-4 text-xs font-medium text-neutral-400 animate-pulse">Ambient AI is listening...</p>
          </div>
        </div>
        <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950">
          <p className="text-xs font-semibold text-neutral-400">REAL-TIME TRANSCRIPT</p>
          <p className="mt-1 text-sm italic text-neutral-600 dark:text-neutral-300">
            "I've had a dull headache behind my eyes for three days, and my vision gets slightly blurry when I stand up."
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'context',
    title: 'Clinical Context',
    icon: Cpu,
    content: (
      <div className="h-full p-6 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white overflow-y-auto">
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
          <span className="text-sm font-bold text-neutral-500">GEMINI INTELLIGENCE</span>
          <span className="text-xs text-neutral-400 font-medium">Confidence: 94.2%</span>
        </div>
        <div className="mt-4 space-y-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Extracted Symptoms</h4>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {['Dull Headache', 'Blurry Vision', 'Orthostatic Irregularity'].map((s) => (
                <span key={s} className="rounded bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Clinical Risk Flags</h4>
            <div className="mt-1.5 space-y-1">
              <div className="flex items-center space-x-2 text-xs font-medium text-amber-600">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                <span>Risk of orthostatic hypotension triggered on postural transition.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'dashboard',
    title: 'Doctor Notes',
    icon: ShieldCheck,
    content: (
      <div className="flex h-full flex-col justify-between p-6 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
        <div>
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <span className="text-sm font-bold text-neutral-500">CLINICAL REMARKS</span>
            <span className="rounded bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-600 dark:bg-indigo-950/30">IN_REVIEW</span>
          </div>
          <div className="mt-4">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Doctor Note Editor</label>
            <div className="mt-1.5 min-h-[90px] rounded border border-neutral-100 bg-neutral-50 p-2 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
              Patient exhibits mild vestibular headache. Recommend blood pressure tracking on stand-up, hydration, and review in one week if symptoms persist.
            </div>
          </div>
        </div>
        <button className="w-full rounded bg-neutral-900 py-2 text-xs font-bold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900">
          Mark Consultation as Reviewed
        </button>
      </div>
    ),
  },
  {
    id: 'timeline',
    title: 'Timeline Log',
    icon: Clock,
    content: (
      <div className="h-full p-6 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white overflow-y-auto">
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
          <span className="text-sm font-bold text-neutral-500">SESSION TIMELINE</span>
          <span className="text-xs text-neutral-400">Duration: 180s</span>
        </div>
        <div className="mt-4 space-y-3">
          <div className="flex items-start space-x-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <div>
              <p className="text-xs font-semibold text-neutral-400">14:02 - SESSION CREATED</p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">Patient intake session initialized</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
            <div>
              <p className="text-xs font-semibold text-neutral-400">14:03 - CHUNK ACCUMULATOR ACTIVE</p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">Microphone stream established and voice tokens cached</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
            <div>
              <p className="text-xs font-semibold text-neutral-400">14:05 - AI SYNTHESIS COMPLETED</p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">Clinical Context symptoms parsed by Gemini API</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

const Hero = () => {
  const [activeTab, setActiveTab] = useState(0);

  // Auto-play loop for product mockup tabs
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % mockScreens.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-neutral-50/30 px-4 py-20 dark:bg-neutral-950/20 sm:px-6 lg:px-8">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-neutral-100 blur-[120px] dark:bg-neutral-900/30" />
      <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] translate-x-1/2 rounded-full bg-neutral-100 blur-[120px] dark:bg-neutral-900/30" />

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Left Text Block */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-5xl md:text-6xl"
            >
              Clinical summaries from ambient voice.<br />
              <span className="text-neutral-500 dark:text-neutral-400">Built for modern doctors.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-6 max-w-lg text-lg leading-relaxed text-neutral-500 dark:text-neutral-400"
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
                className="rounded-md bg-neutral-900 px-6 py-3 text-base font-semibold text-white hover:bg-neutral-800 transition-all active:scale-[0.98] dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200"
              >
                Create Account
              </Link>
              <a
                href="#product-demo"
                className="rounded-md border border-neutral-200 bg-white px-6 py-3 text-base font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                Explore Live Demo
              </a>
            </motion.div>
          </div>

          {/* Right Product Mockup */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="w-full rounded-xl border border-neutral-200/80 bg-white shadow-lg overflow-hidden dark:border-neutral-800 dark:bg-neutral-900"
            >
              {/* Browser Header Tab Indicators */}
              <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50/50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900/50">
                <div className="flex space-x-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
                </div>
                <div className="text-[11px] font-medium text-neutral-400 select-none">
                  cortexcare.app/console
                </div>
                <div className="w-10" />
              </div>

              {/* Product Screens Nav bar */}
              <div className="flex border-b border-neutral-100 bg-white px-2 py-1.5 dark:border-neutral-800 dark:bg-neutral-900">
                {mockScreens.map((screen, idx) => {
                  const Icon = screen.icon;
                  const isActive = idx === activeTab;
                  return (
                    <button
                      key={screen.id}
                      onClick={() => setActiveTab(idx)}
                      className={`flex items-center space-x-1.5 rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white'
                          : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{screen.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Display Container with transitions */}
              <div className="relative h-64 bg-white dark:bg-neutral-900">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full w-full"
                  >
                    {mockScreens[activeTab].content}
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
