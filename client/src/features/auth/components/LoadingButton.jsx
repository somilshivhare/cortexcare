import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingButton = ({ children, isLoading, disabled, ...props }) => {
  return (
    <button
      {...props}
      disabled={isLoading || disabled}
      className={`relative flex w-full items-center justify-center rounded-md bg-neutral-900 py-2.5 text-xs font-bold text-white hover:bg-neutral-850 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 ${
        props.className || ''
      }`}
    >
      {isLoading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
      <span>{children}</span>
    </button>
  );
};

export default LoadingButton;
