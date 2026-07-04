import React from 'react';
import { Cpu, Video, UserPlus, Info } from 'lucide-react';

const UpcomingFeatures = () => {
  const items = [
    {
      title: 'Ambient Voice Live Scribe',
      description: 'Stream audio directly into CortexCare AI from the web client for live transcriptions.',
      icon: Cpu,
    },
    {
      title: 'Telehealth Video Consults',
      description: 'Consult with clinical specialists via HD WebRTC video and screen share integrations.',
      icon: Video,
    },
    {
      title: 'Clinic Matching Engine',
      description: 'Intelligent matchmaking matching symptom profiles to nearby verified clinical departments.',
      icon: UserPlus,
    },
  ];

  return (
    <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-6 dark:border-neutral-800/80 dark:bg-neutral-900/50">
      <div className="flex items-center gap-2">
        <Info className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
        <h3 className="text-base font-bold text-neutral-900 dark:text-white">Upcoming Features</h3>
      </div>
      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
        New functionalities currently in development for patient care.
      </p>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="rounded-xl border border-neutral-200/60 bg-white p-5 dark:border-neutral-800/60 dark:bg-neutral-900 shadow-2xs"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                <Icon className="h-4.5 w-4.5" />
              </div>
              <h4 className="mt-3 text-sm font-bold text-neutral-900 dark:text-white">
                {item.title}
              </h4>
              <p className="mt-1.5 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingFeatures;
