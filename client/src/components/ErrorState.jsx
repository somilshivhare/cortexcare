import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorState = ({ title = 'Something went wrong', message, onRetry, className = '' }) => {
  return (
    <div className={`mx-auto max-w-md rounded-2xl border border-rose-200 bg-rose-50/50 p-6 text-center dark:border-rose-950/50 dark:bg-rose-950/10 ${className}`}>
      <AlertCircle className="mx-auto h-10 w-10 text-rose-500" />
      <h3 className="mt-4 text-sm font-bold text-neutral-900 dark:text-white">
        {title}
      </h3>
      {message && (
        <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-450 leading-relaxed">
          {message}
        </p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-lg bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100"
        >
          Retry Request
        </button>
      )}
    </div>
  );
};

export default ErrorState;
