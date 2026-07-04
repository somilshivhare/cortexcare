import React from 'react';
import Spinner from './Spinner.jsx';

const LoadingOverlay = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-xs transition-colors dark:bg-neutral-950/70">
      <div className="flex flex-col items-center gap-3.5 p-6 rounded-2xl border border-neutral-100 bg-white/90 shadow-lg dark:border-neutral-800 dark:bg-neutral-900/90 max-w-xs text-center">
        <Spinner />
        <p className="text-xs font-bold text-neutral-600 dark:text-neutral-350">{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
