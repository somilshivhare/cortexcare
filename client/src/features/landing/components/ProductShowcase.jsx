import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, User, FileText, History, MessageSquare, Bell, Calendar, Plus, CheckCircle, ExternalLink, Activity } from 'lucide-react';

const tabs = [
  {
    id: 'doctor',
    name: 'Doctor Dashboard',
    icon: Layout,
    title: 'Clinician Workspace & Queue Management',
    description: 'A centralized portal for healthcare practitioners to review patient consults, claim unassigned cases, and manage case statuses.',
    content: (
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 shadow-sm overflow-hidden text-left">
        {/* Mock workspace header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4 mb-6 gap-2">
          <div>
            <h4 className="text-base font-bold text-neutral-900 dark:text-white">Clinician Workspace</h4>
            <p className="text-[10px] text-neutral-400">Clinic Code: CC-828887 • Mercy Hospital</p>
          </div>
          <div className="flex gap-2">
            <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded">2 Cases Pending</span>
            <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 px-2.5 py-1 rounded">1 Claimed Active</span>
          </div>
        </div>
        
        {/* Table of cases */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-neutral-100 dark:border-neutral-800 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2 text-left">Patient</th>
                <th className="py-2 text-left">Intake Date</th>
                <th className="py-2 text-left">Status</th>
                <th className="py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              <tr>
                <td className="py-3 font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-bold text-[10px]">SS</div>
                  Somil Shivhare
                </td>
                <td className="py-3 text-neutral-550 dark:text-neutral-400">Jul 20, 2026, 11:20 PM</td>
                <td className="py-3">
                  <span className="rounded bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-600 dark:bg-amber-950/20">PENDING</span>
                </td>
                <td className="py-3 text-right">
                  <button className="rounded bg-neutral-900 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950">
                    Claim Case
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-bold text-[10px]">JD</div>
                  John Doe
                </td>
                <td className="py-3 text-neutral-550 dark:text-neutral-400">Jul 19, 2026, 04:15 PM</td>
                <td className="py-3">
                  <span className="rounded bg-indigo-50 px-2 py-0.5 text-[9px] font-bold text-indigo-600 dark:bg-indigo-950/20">CLAIMED</span>
                </td>
                <td className="py-3 text-right">
                  <button className="rounded bg-indigo-650 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-indigo-755 flex items-center gap-1 inline-flex">
                    <span>Audit Case</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
  {
    id: 'patient',
    name: 'Patient Dashboard',
    icon: User,
    title: 'Patient Workspace & Quick Actions',
    description: 'A consumer-grade portal for patients to view health statuses, trigger new consultations, and explore active clinic information.',
    content: (
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 shadow-sm overflow-hidden text-left space-y-6">
        {/* Welcome Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-neutral-900 dark:text-white">Welcome back, Somil</h4>
            <p className="text-xs text-neutral-450">Review your clinical context summary or start a new intake evaluation below.</p>
          </div>
          <button className="rounded-lg bg-neutral-900 px-3.5 py-2 text-xs font-bold text-white dark:bg-white dark:text-neutral-950 flex items-center gap-1.5 self-start">
            <Plus className="h-4 w-4" />
            <span>New Intake Consultation</span>
          </button>
        </div>

        {/* Quick info cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-neutral-100 dark:border-neutral-805 bg-neutral-50/30 space-y-2">
            <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Current Facility</span>
            <h5 className="text-xs font-bold text-neutral-900 dark:text-white">Mercy Hospital</h5>
            <p className="text-[10px] text-neutral-500">Affiliated Practitioner: Dr. Sarah Jenkins</p>
          </div>
          <div className="p-4 rounded-xl border border-neutral-100 dark:border-neutral-805 bg-neutral-50/30 space-y-2">
            <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Longitudinal Record Summary</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-950 dark:text-white">4 Total Evaluations</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-[10px] text-neutral-500">Last synthesis: Stomach Pain (Reviewed)</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'context',
    name: 'Clinical Context',
    icon: FileText,
    title: 'Gemini AI Synthesis Context Details',
    description: 'Structured clinical results generated automatically from patient dialogue, outputting schemas containing chief complaints, present illness, and risks.',
    content: (
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 shadow-sm overflow-hidden text-left space-y-4 max-h-[350px] overflow-y-auto scrollbar-none">
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
          <span className="text-xs font-bold text-neutral-400">AI CLINICAL SYNTHESIS</span>
          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded">LOW RISK</span>
        </div>
        
        <div className="space-y-4 text-xs">
          <div>
            <h5 className="font-bold text-neutral-900 dark:text-white">Chief Complaint</h5>
            <p className="text-neutral-600 dark:text-neutral-350 mt-1">Patient reports cramping stomach pain for the past two days.</p>
          </div>
          
          <div>
            <h5 className="font-bold text-neutral-900 dark:text-white">History of Present Illness (HPI)</h5>
            <p className="text-neutral-600 dark:text-neutral-350 leading-relaxed mt-1">
              Somil Shivhare experiencing cramping pain, rated 4/10, localized to the mid-abdomen. Onset occurred after lifting heavy weights on an empty stomach. Pain worsens upon standing up.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-neutral-900 dark:text-white">Symptoms Extracted</h5>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {['Stomach pain', 'Cramping pain', 'Intermittent pain', 'Worse with standing'].map((s) => (
                <span key={s} className="bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-[10px] font-medium text-neutral-700 dark:text-neutral-300">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'history',
    name: 'Medical History',
    icon: History,
    title: 'Longitudinal Medical Records Timeline',
    description: 'Historical patient records that remain read-only, transferring automatically across clinics so new doctors gain immediate diagnostic visibility.',
    content: (
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 shadow-sm overflow-hidden text-left space-y-4">
        <h4 className="text-xs font-bold text-neutral-450 uppercase tracking-wider">Longitudinal Evaluation History</h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-100 dark:border-neutral-805 bg-neutral-50/20">
            <div>
              <span className="text-[10px] text-neutral-400 block font-medium">Jul 7, 2026, 11:14 PM</span>
              <span className="text-xs font-bold text-neutral-900 dark:text-white">General Wellness Intake</span>
            </div>
            <span className="rounded bg-neutral-100 px-2 py-0.5 text-[9px] font-bold text-neutral-550 dark:bg-neutral-800">SETUP</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-100 dark:border-neutral-805 bg-neutral-50/20">
            <div>
              <span className="text-[10px] text-neutral-400 block font-medium">Jul 6, 2026, 11:15 PM</span>
              <span className="text-xs font-bold text-neutral-900 dark:text-white">Post-Workout Stomach Pain</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="rounded bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600 dark:bg-emerald-950/20">COMPLETED</span>
              <span className="text-[9px] font-bold text-emerald-700">Reviewed</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'consultation',
    name: 'Consultation',
    icon: MessageSquare,
    title: 'Interactive Diagnostics intake',
    description: 'Step-by-step smart clinical dialogue prompts that ask context-aware questions to fill gaps in symptom logs.',
    content: (
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 shadow-sm overflow-hidden text-left space-y-4">
        {/* Chat bubbles */}
        <div className="space-y-3 text-xs max-h-[220px] overflow-y-auto scrollbar-none">
          <div className="flex items-start gap-2.5">
            <div className="h-6 w-6 rounded bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center font-bold text-[10px] text-white dark:text-neutral-950">AI</div>
            <div className="bg-neutral-100 dark:bg-neutral-805 p-3 rounded-2xl rounded-tl-none max-w-[80%] leading-relaxed text-neutral-800 dark:text-neutral-250">
              Hi, I understand you've been having stomach pain. Can you tell me when it started and what it feels like?
            </div>
          </div>
          
          <div className="flex items-start gap-2.5 justify-end">
            <div className="bg-indigo-650 text-white p-3 rounded-2xl rounded-tr-none max-w-[80%] leading-relaxed">
              It started two days ago. It feels like cramping, right in the middle of my stomach.
            </div>
            <div className="h-6 w-6 rounded bg-indigo-500 flex items-center justify-center font-bold text-[10px] text-white">SS</div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="h-6 w-6 rounded bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center font-bold text-[10px] text-white dark:text-neutral-950">AI</div>
            <div className="bg-neutral-100 dark:bg-neutral-805 p-3 rounded-2xl rounded-tl-none max-w-[80%] leading-relaxed text-neutral-800 dark:text-neutral-250">
              Does anything make the pain better or worse? Have you done any strenuous activity recently?
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'notifications',
    name: 'Notifications',
    icon: Bell,
    title: 'Real-Time Alert Dispatching',
    description: 'Instant WebSocket alerts notifying patients when consultations are audited and clinicians when cases are submitted.',
    content: (
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 shadow-sm overflow-hidden text-left space-y-4">
        <h4 className="text-xs font-bold text-neutral-450 uppercase tracking-wider">Recent Activity alerts</h4>
        
        <div className="space-y-3 text-xs">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50/30 dark:bg-neutral-900/30 border border-neutral-100 dark:border-neutral-805">
            <Bell className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold text-neutral-900 dark:text-white">Consultation Audited</p>
              <p className="text-neutral-550 dark:text-neutral-400 mt-0.5">Dr. Sarah Jenkins finalized and signed off your Post-Workout Stomach Pain consult.</p>
              <span className="text-[9px] text-neutral-400 block mt-1">2 hours ago</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50/30 dark:bg-neutral-900/30 border border-neutral-100 dark:border-neutral-805">
            <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold text-neutral-900 dark:text-white">Clinic Enrollment Verified</p>
              <p className="text-neutral-550 dark:text-neutral-400 mt-0.5">You joined Mercy Hospital using invite code CC-828887.</p>
              <span className="text-[9px] text-neutral-400 block mt-1">Jul 20, 2026</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

const ProductShowcase = () => {
  const [activeTab, setActiveTab] = useState('doctor');
  const currentTab = tabs.find((t) => t.id === activeTab);

  return (
    <section id="showcase" className="py-24 bg-neutral-50/40 dark:bg-neutral-950/20 border-y border-neutral-100 dark:border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title block */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-450 dark:text-neutral-500 mb-3">
            Product Showcase
          </h2>
          <h3 className="text-3xl font-extrabold text-neutral-900 dark:text-white sm:text-4xl">
            Experience the Workspace Portals
          </h3>
          <p className="mt-4 text-sm text-neutral-550 dark:text-neutral-400">
            Interactive visual previews matching the actual look and feel of the CortexCare application.
          </p>
        </div>

        {/* Tab content wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Tab selection links (col-span-4) */}
          <div className="lg:col-span-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs text-neutral-950 dark:text-white'
                      : 'border border-transparent text-neutral-450 hover:text-neutral-700 dark:hover:text-neutral-300'
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-indigo-500' : 'text-neutral-400'}`} />
                  <span className="text-xs font-bold">{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Tab content display (col-span-8) */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="text-left space-y-2">
                  <h4 className="text-lg font-bold text-neutral-900 dark:text-white">
                    {currentTab.title}
                  </h4>
                  <p className="text-xs text-neutral-550 dark:text-neutral-400 leading-relaxed">
                    {currentTab.description}
                  </p>
                </div>

                {/* Styled Browser Frame */}
                <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-2.5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50">
                  {/* Browser dots header */}
                  <div className="flex space-x-1.5 pb-2.5 pl-1.5">
                    <div className="h-2 w-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    <div className="h-2 w-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    <div className="h-2 w-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                  </div>
                  {currentTab.content}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ProductShowcase;
