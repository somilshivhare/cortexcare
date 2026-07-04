import React from 'react';
import { UserCheck, ShieldAlert, FileSearch, Sparkles } from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    {
      title: 'Session Profile Synchronized',
      description: 'Patient demographics loaded from CortexCare cloud secure servers.',
      time: 'Just now',
      icon: UserCheck,
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400',
    },
    {
      title: 'Clinical Summary Processed',
      description: 'Gemini medical summary pipeline successfully validated the latest transcript.',
      time: '2 hours ago',
      icon: Sparkles,
      color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400',
    },
    {
      title: 'Consultation Finalized',
      description: 'Consultation session finalized and locked for medical verification audits.',
      time: '1 day ago',
      icon: FileSearch,
      color: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
    },
  ];

  return (
    <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 dark:border-neutral-800/80 dark:bg-neutral-900 shadow-xs">
      <h3 className="text-base font-bold text-neutral-900 dark:text-white">Recent Activity</h3>
      <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
        Chronological audit log of your patient dashboard actions.
      </p>

      <div className="mt-6 flow-root">
        <ul className="-mb-8">
          {activities.map((act, index) => {
            const Icon = act.icon;
            return (
              <li key={index}>
                <div className="relative pb-8">
                  {index !== activities.length - 1 && (
                    <span
                      className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-neutral-200 dark:bg-neutral-800"
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative flex space-x-3">
                    <div>
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ring-8 ring-white dark:ring-neutral-900 ${act.color}`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-sm font-bold text-neutral-900 dark:text-white">
                          {act.title}
                        </p>
                        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                          {act.description}
                        </p>
                      </div>
                      <div className="whitespace-nowrap text-right text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">
                        <time>{act.time}</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default RecentActivity;
