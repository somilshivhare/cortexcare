import React from 'react';

const StatusBadge = ({ status, className = '' }) => {
  const normalizedStatus = (status || '').toUpperCase();

  const statusConfigs = {
    PENDING: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-450 border border-neutral-200/50 dark:border-neutral-750',
    SETUP: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-450 border border-neutral-200/50 dark:border-neutral-750',
    IN_REVIEW: 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/50',
    ACTIVE: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-900/50',
    CLAIMED: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-900/50',
    COMPLETED: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/50',
    REVIEWED: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/50',
    CANCELLED: 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/50',
    ARCHIVED: 'bg-neutral-100 text-neutral-500 dark:bg-neutral-850 dark:text-neutral-450 border border-neutral-200/40 dark:border-neutral-800/40',
  };

  const currentStyle = statusConfigs[normalizedStatus] || 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400';

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase select-none ${currentStyle} ${className}`}>
      {status || 'Unknown'}
    </span>
  );
};

export default StatusBadge;
