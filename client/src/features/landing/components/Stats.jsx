import React from 'react';
import { Cpu, Mic, Database, ShieldCheck } from 'lucide-react';

const statsData = [
  {
    icon: Mic,
    label: 'Voice-Powered Intakes',
    description: 'Captures ambient consultation streams using low-latency WebRTC connections.',
  },
  {
    icon: Cpu,
    label: 'Real-time AI Processing',
    description: 'Offloads structured summarization to background queue workers instantly.',
  },
  {
    icon: Database,
    label: 'Structured Clinical Context',
    description: 'Generates Gemini AI summary sheets mapped directly to database schemas.',
  },
  {
    icon: ShieldCheck,
    label: 'Secure Session Isolation',
    description: 'Enforces clinic grouping rules and HttpOnly cookie security on logins.',
  },
];

const Stats = () => {
  return (
    <section className="bg-neutral-50/50 py-20 dark:bg-neutral-950/20 border-t border-b border-neutral-200/80 dark:border-neutral-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {statsData.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-start space-x-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm border border-neutral-200/60 text-neutral-900 dark:bg-neutral-900 dark:border-neutral-800 dark:text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white">{item.label}</h4>
                  <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-450 leading-relaxed">
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
