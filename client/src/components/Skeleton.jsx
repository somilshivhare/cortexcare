import React from 'react';

export const SkeletonLine = ({ className = 'h-4 w-full' }) => {
  return (
    <div className={`animate-pulse rounded bg-neutral-200/80 dark:bg-neutral-800/80 ${className}`} />
  );
};

export const SkeletonCard = ({ className = 'h-32' }) => {
  return (
    <div className={`animate-pulse rounded-2xl border border-neutral-200/60 bg-neutral-100/50 dark:border-neutral-800/60 dark:bg-neutral-900/50 ${className}`} />
  );
};

export const SkeletonTable = ({ rows = 3, cols = 4 }) => {
  return (
    <div className="w-full space-y-4 animate-pulse">
      <div className="flex gap-4 pb-2 border-b border-neutral-200/80 dark:border-neutral-800/80">
        {Array.from({ length: cols }).map((_, idx) => (
          <div key={idx} className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div key={rIdx} className="flex gap-4 py-2">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <div key={cIdx} className="h-3 bg-neutral-100 dark:bg-neutral-900 rounded w-1/4" />
          ))}
        </div>
      ))}
    </div>
  );
};
