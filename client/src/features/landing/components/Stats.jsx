import React from 'react';
import { Cpu, Mic, Database, Shield } from 'lucide-react';

const statsData = [
  {
    icon: Mic,
    label: 'Voice-Powered Intakes',
    description: 'Captures and stores segments of consultations via WebRTC room channels.',
  },
  {
    icon: Cpu,
    label: 'Real-time AI Processing',
    description: 'Offloads LLM prompts to background worker nodes using BullMQ queues.',
  },
  {
    icon: Database,
    label: 'Structured Contexts',
    description: 'Generates Gemini summaries mapped strictly to clinical database tables.',
  },
  {
    icon: Shield,
    label: 'Secure by Design',
    description: 'Prevents token theft in the browser using HttpOnly cookie authentication.',
  },
];

const Stats = () => {
  return (
    <section className="bg-neutral-50/50 py-16 dark:bg-neutral-950/20 border-t border-b border-neutral-100 dark:border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {statsData.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-start space-x-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white">{item.label}</h4>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;
