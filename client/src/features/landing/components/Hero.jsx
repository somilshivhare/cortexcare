import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ClipboardCheck, ArrowRight, Layout, Users, FileText, CheckCircle, BrainCircuit } from 'lucide-react';

const mockCases = [
  { id: '1', name: 'Somil Shivhare', complaint: 'Cramping stomach pain', time: '10 mins ago', status: 'PENDING', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  { id: '2', name: 'John Doe', complaint: 'Orthostatic drops & dizziness', time: '2 hours ago', status: 'CLAIMED', bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
  { id: '3', name: 'Jane Smith', complaint: 'Chronic dry cough & mild fever', time: '1 day ago', status: 'COMPLETED', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
];

const Hero = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-white px-4 py-24 dark:bg-neutral-900 sm:px-6 lg:px-8">
      {/* Subtle ambient light effects */}
      <div className="absolute top-0 left-1/4 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-neutral-100/30 blur-[120px] dark:bg-neutral-800/10" />
      <div className="absolute bottom-0 right-1/4 h-[350px] w-[350px] translate-x-1/2 rounded-full bg-neutral-100/30 blur-[120px] dark:bg-neutral-800/10" />

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:items-center">
          
          {/* Left Hero copy */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50/65 px-3 py-1 text-[10px] font-bold text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400 border border-indigo-150/40 w-fit mb-6"
            >
              <BrainCircuit className="h-3.5 w-3.5" />
              <span>Next-Gen EMR Workspaces</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-5xl md:text-6xl leading-[1.05]"
            >
              Clinical Intake <br />
              <span className="text-neutral-400 dark:text-neutral-500">
                Powered by Gemini.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-6 text-sm leading-relaxed text-neutral-550 dark:text-neutral-400 max-w-md"
            >
              CortexCare coordinates smart diagnostic intakes, synthesizes rich clinical context summaries, and syncs longitudinal medical records securely across clinics.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link
                to="/auth/register"
                className="rounded-xl bg-neutral-900 px-6 py-3.5 text-xs font-bold text-white hover:bg-neutral-800 transition-all active:scale-[0.98] dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 flex items-center gap-1.5 shadow-sm"
              >
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#showcase"
                className="rounded-xl border border-neutral-200 bg-white px-6 py-3.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                View Demo
              </a>
            </motion.div>
          </div>

          {/* Right Product Mockup (Interactive Browser) */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="w-full rounded-xl border border-neutral-200/80 bg-neutral-50 shadow-md overflow-hidden dark:border-neutral-800 dark:bg-neutral-950"
            >
              {/* Browser Header Bar */}
              <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50/50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900/50">
                <div className="flex space-x-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                </div>
                <div className="text-[10px] font-bold text-neutral-450 select-none tracking-tight">
                  cortexcare.app/doctor/dashboard
                </div>
                <div className="w-10" />
              </div>

              {/* Application Layout Mockup */}
              <div className="flex bg-white dark:bg-neutral-900 h-[340px] text-left">
                {/* Simulated Sidebar */}
                <div className="w-40 border-r border-neutral-100 dark:border-neutral-805 bg-neutral-50/20 dark:bg-neutral-950/20 p-3 hidden sm:flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="h-4.5 w-20 bg-neutral-200 dark:bg-neutral-800 rounded mb-4" />
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] font-bold text-neutral-900 dark:text-white">
                      <Layout className="h-3.5 w-3.5" />
                      <span>Dashboard</span>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 text-[10px] font-bold text-neutral-450">
                      <Users className="h-3.5 w-3.5" />
                      <span>Patients</span>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 text-[10px] font-bold text-neutral-450">
                      <FileText className="h-3.5 w-3.5" />
                      <span>Clinic</span>
                    </div>
                  </div>
                  <div className="h-6 w-24 bg-neutral-150 dark:bg-neutral-850 rounded" />
                </div>

                {/* Dashboard Main Content */}
                <div className="flex-1 p-5 space-y-5 overflow-hidden flex flex-col justify-between">
                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-3">
                      <div>
                        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">Clinician Queue</span>
                        <h4 className="text-xs font-bold text-neutral-900 dark:text-white mt-0.5">Mercy Hospital</h4>
                      </div>
                      <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/25 px-2 py-0.5 rounded">
                        Active Workspace
                      </span>
                    </div>

                    {/* Interactive case details preview */}
                    <div className="mt-4 space-y-2">
                      <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider pl-0.5">Unassigned Cases</span>
                      
                      <div className="space-y-2">
                        {mockCases.map((c, idx) => {
                          const isActive = idx === activeStep;
                          return (
                            <motion.div
                              key={c.id}
                              animate={{
                                borderColor: isActive ? 'var(--color-indigo-500)' : 'rgba(0,0,0,0)',
                                scale: isActive ? 1.01 : 1,
                              }}
                              className={`flex items-center justify-between p-3 rounded-xl border border-neutral-150 dark:border-neutral-800 bg-neutral-50/20 transition-all duration-200`}
                            >
                              <div className="min-w-0 pr-2">
                                <p className="text-[11px] font-bold text-neutral-900 dark:text-white truncate">{c.name}</p>
                                <p className="text-[9px] text-neutral-455 truncate mt-0.5">{c.complaint}</p>
                              </div>
                              
                              <div className="flex items-center gap-2 shrink-0">
                                <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded ${c.bg}`}>
                                  {c.status}
                                </span>
                                {isActive && (
                                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-ping" />
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Micro-interaction highlight */}
                  <div className="rounded-lg border border-indigo-150/40 bg-indigo-50/20 p-2.5 dark:border-indigo-900/30 dark:bg-indigo-950/10 flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-350">
                      <ClipboardCheck className="h-4 w-4 text-indigo-500" />
                      <span>Gemini Auto-Synthesis: <strong>Low risk cardiac indicators</strong></span>
                    </div>
                    <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 select-none">98% Accuracy</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
