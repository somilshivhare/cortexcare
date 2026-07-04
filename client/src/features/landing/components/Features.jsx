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
    description: 'Captures patients describing symptoms ambiently. No transcribing notes manually.',
  },
  {
    icon: Cpu,
    title: 'AI Clinical Context',
    description: 'Automatically structures summaries, symptoms, confidence score estimates, and risk flags.',
  },
  {
    icon: Clock,
    title: 'Consultation Timeline',
    description: 'Compiles transcripts, system changes, and reviews into a sorted chronological record.',
  },
  {
    icon: LayoutDashboard,
    title: 'Doctor Dashboard',
    description: 'Provides quick claim queues, unassigned session counts, and detailed remark note editors.',
  },
  {
    icon: Building,
    title: 'Clinic Management',
    description: 'Secure clinic groups using alphanumeric codes to block unauthorized cross-patient reads.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Authentication',
    description: 'XSS session protection via HttpOnly cookie verification and stateless rotation.',
  },
  {
    icon: Radio,
    title: 'LiveKit Integration',
    description: 'High-performance WebRTC connection logic for clean microphone audio capture.',
  },
  {
    icon: Sparkles,
    title: 'Gemini AI Engine',
    description: 'Schema-enforced JSON extraction mapping text to database attributes safely.',
  },
];

const Features = () => {
  return (
    <section id="features" className="bg-neutral-50/50 py-24 dark:bg-neutral-950/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center">
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100">
            Features
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
            Engineered for Modern Clinical Workflows
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-500 dark:text-neutral-400">
            A comprehensive ambient medical assistant that structures patient intakes automatically.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuresData.map((feature, idx) => (
            <FeatureCard
              key={idx}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;
