import React from 'react';
import { Layers, CheckCircle2, Flame } from 'lucide-react';

const DashboardStats = ({ clinicalContexts }) => {
  const total = clinicalContexts?.length || 0;
  const completed = clinicalContexts?.filter(
    (c) => c.consultation?.status === 'COMPLETED'
  ).length || 0;
  const processing = clinicalContexts?.filter(
    (c) => ['PROCESSING', 'ACTIVE'].includes(c.consultation?.status)
  ).length || 0;

  const stats = [
    {
      name: 'Total Consultations',
      value: total,
      description: 'Historical AI intake sessions',
      icon: Layers,
      color: 'text-neutral-900 dark:text-neutral-50 bg-neutral-100 dark:bg-neutral-800',
    },
    {
      name: 'Completed Audits',
      value: completed,
      description: 'Summarized and reviewed',
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30',
    },
    {
      name: 'Processing Intakes',
      value: processing,
      description: 'Pending AI synthesis',
      icon: Flame,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="flex items-center justify-between rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs transition-colors duration-300 dark:border-neutral-800/80 dark:bg-neutral-900"
          >
            <div>
              <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500">
                {stat.name}
              </span>
              <h4 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                {stat.value}
              </h4>
              <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                {stat.description}
              </p>
            </div>

            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
