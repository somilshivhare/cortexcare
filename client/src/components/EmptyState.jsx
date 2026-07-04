import React from 'react';
import { Database } from 'lucide-react';

const EmptyState = ({ title, description, icon: Icon = Database, actionLabel, onAction, className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-neutral-200/80 bg-white dark:border-neutral-800/80 dark:bg-neutral-900 rounded-2xl shadow-2xs ${className}`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-base font-bold text-neutral-900 dark:text-white">
        {title || 'No data available'}
      </h3>
      <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 max-w-xs leading-relaxed">
        {description || 'There are no active records in this database category at the moment.'}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-6 rounded-lg bg-neutral-900 px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition-colors dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
