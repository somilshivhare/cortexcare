import React from 'react';

const StatCard = ({ title, value, description, icon: Icon, className = '', color = 'text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800' }) => {
  return (
    <div className={`flex items-center justify-between rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-2xs transition-colors duration-300 dark:border-neutral-800/80 dark:bg-neutral-900 ${className}`}>
      <div>
        <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500">
          {title}
        </span>
        <h4 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          {value}
        </h4>
        {description && (
          <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
            {description}
          </p>
        )}
      </div>

      {Icon && (
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-5.5 w-5.5" />
        </div>
      )}
    </div>
  );
};

export default StatCard;
