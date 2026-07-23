import React from 'react';
import {
  Cpu,
  Clock,
  LayoutDashboard,
  Building,
  ShieldCheck,
  Sparkles,
  User,
  Bell,
} from 'lucide-react';
import FeatureCard from './FeatureCard.jsx';

const featuresData = [
  {
    icon: Cpu,
    title: 'AI Intake Sessions',
    description: 'Structured diagnostic dialogues prompt patients contextually to collect detailed symptom descriptions.',
    accentClass: 'border-blue-150 hover:border-blue-300 dark:border-blue-950/20 dark:hover:border-blue-900/50',
    iconClass: 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400',
  },
  {
    icon: Sparkles,
    title: 'Clinical Contexts',
    description: 'Automatic synthesis of chief complaints, present illness timelines, risk logs, and medication histories.',
    accentClass: 'border-purple-150 hover:border-purple-300 dark:border-purple-950/20 dark:hover:border-purple-900/50',
    iconClass: 'bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400',
  },
  {
    icon: Clock,
    title: 'Longitudinal Records',
    description: 'Unified, immutable Electronic Medical Records (EMR) follow the patient across clinic switches instantly.',
    accentClass: 'border-emerald-150 hover:border-emerald-300 dark:border-emerald-950/20 dark:hover:border-emerald-900/50',
    iconClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400',
  },
  {
    icon: LayoutDashboard,
    title: 'Doctor Dashboards',
    description: 'Case queues, caseload statistics, patient lists, and clinical notes review editors for practitioners.',
    accentClass: 'border-indigo-150 hover:border-indigo-300 dark:border-indigo-950/20 dark:hover:border-indigo-900/50',
    iconClass: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400',
  },
  {
    icon: User,
    title: 'Patient Workspaces',
    description: 'A consumer-grade portal for patients to view health synthesis histories, quick actions, and clinic statuses.',
    accentClass: 'border-teal-150 hover:border-teal-300 dark:border-teal-950/20 dark:hover:border-teal-900/50',
    iconClass: 'bg-teal-50 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400',
  },
  {
    icon: Building,
    title: 'Multi-Clinic Affiliations',
    description: 'Practitioners and patients join clinics dynamically using unique facility invite codes.',
    accentClass: 'border-rose-150 hover:border-rose-300 dark:border-rose-950/20 dark:hover:border-rose-900/50',
    iconClass: 'bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Authentication',
    description: 'Prevents session leaks using HttpOnly access and refresh token cookie rotations.',
    accentClass: 'border-amber-150 hover:border-amber-300 dark:border-amber-950/20 dark:hover:border-amber-900/50',
    iconClass: 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400',
  },
  {
    icon: Bell,
    title: 'Real-Time Alerting',
    description: 'WebSockets alert patients when evaluations are finalized, and doctors when new intakes register.',
    accentClass: 'border-sky-150 hover:border-sky-300 dark:border-sky-950/20 dark:hover:border-sky-900/50',
    iconClass: 'bg-sky-50 text-sky-600 dark:bg-sky-950/30 dark:text-sky-400',
  },
];

const Features = () => {
  return (
    <section id="features" className="bg-white py-24 dark:bg-neutral-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-450 dark:text-neutral-500 mb-3">
            Core Features
          </h2>
          <h3 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
            Engineered for Modern Clinical Workflows
          </h3>
          <p className="mt-4 text-sm text-neutral-550 dark:text-neutral-400">
            A comprehensive clinical workspace providing automated diagnostics intake and physician audit lanes.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
