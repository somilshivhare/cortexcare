import React from 'react';
import {
  Mic,
  Cpu,
  Clock,
  LayoutDashboard,
  Building,
  ShieldCheck,
  Radio,
  Sparkles,
} from 'lucide-react';
import FeatureCard from './FeatureCard.jsx';

const featuresData = [
  {
    icon: Mic,
    title: 'Voice Consultation',
    description: 'Secure, real-time ambient session capture using microphone WebRTC channels.',
    accentClass: 'border-blue-100 hover:border-blue-200 dark:border-blue-950/20 dark:hover:border-blue-900/50',
    iconClass: 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400',
  },
  {
    icon: Cpu,
    title: 'AI Clinical Context',
    description: 'Automated synthesis of patient symptoms, mood metrics, and potential risk flags.',
    accentClass: 'border-purple-100 hover:border-purple-200 dark:border-purple-950/20 dark:hover:border-purple-900/50',
    iconClass: 'bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400',
  },
  {
    icon: Clock,
    title: 'Consultation Timeline',
    description: 'A completely chronological visual record of the entire consultation event lifecycle.',
    accentClass: 'border-emerald-100 hover:border-emerald-200 dark:border-emerald-950/20 dark:hover:border-emerald-900/50',
    iconClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400',
  },
  {
    icon: LayoutDashboard,
    title: 'Doctor Dashboard',
    description: 'Interactive workstation providing claim queues, caseload metrics, and a remarks editor.',
    accentClass: 'border-indigo-100 hover:border-indigo-200 dark:border-indigo-950/20 dark:hover:border-indigo-900/50',
    iconClass: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400',
  },
  {
    icon: Building,
    title: 'Clinic Management',
    description: 'Isolate practitioner and patient memberships to designated clinics using invite codes.',
    accentClass: 'border-teal-100 hover:border-teal-200 dark:border-teal-950/20 dark:hover:border-teal-900/50',
    iconClass: 'bg-teal-50 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Authentication',
    description: 'Prevents browser-level credential leaks using enterprise HttpOnly cookie rotation.',
    accentClass: 'border-amber-100 hover:border-amber-200 dark:border-amber-950/20 dark:hover:border-amber-900/50',
    iconClass: 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400',
  },
  {
    icon: Radio,
    title: 'LiveKit Integration',
    description: 'Low-latency microphone WebRTC connections mapping audio directly to server buffers.',
    accentClass: 'border-blue-100 hover:border-blue-200 dark:border-blue-950/20 dark:hover:border-blue-900/50',
    iconClass: 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400',
  },
  {
    icon: Sparkles,
    title: 'Gemini AI Engine',
    description: 'Schema-enforced JSON extraction mapping text to structured database parameters.',
    accentClass: 'border-purple-100 hover:border-purple-200 dark:border-purple-950/20 dark:hover:border-purple-900/50',
    iconClass: 'bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400',
  },
];

const Features = () => {
  return (
    <section id="features" className="bg-white py-32 dark:bg-neutral-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center">
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 font-mono">
            Features
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
            Engineered for Modern Clinical Workflows
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-500 dark:text-neutral-450">
            A comprehensive, modular medical intake assistant that structures patient consultation summaries.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuresData.map((feature, idx) => (
            <FeatureCard
              key={idx}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              accentClass={feature.accentClass}
              iconClass={feature.iconClass}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;
