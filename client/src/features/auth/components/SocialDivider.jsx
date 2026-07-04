import React from 'react';

const SocialDivider = () => {
  return (
    <div className="mt-6 space-y-4">
      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-100 dark:border-neutral-800" />
        </div>
        <span className="relative bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:bg-neutral-900">
          Or
        </span>
      </div>

      {/* Placeholder Google Button */}
      <button
        type="button"
        disabled
        className="flex w-full items-center justify-center space-x-2 rounded-md border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs font-semibold text-neutral-400 cursor-not-allowed dark:border-neutral-800 dark:bg-neutral-950"
      >
        {/* Simple Google SVG Icon */}
        <svg className="h-4 w-4 shrink-0 fill-current opacity-50" viewBox="0 0 24 24">
          <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.529-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 5.922 1 1 5.92 1 12s4.922 11 11.24 11c6.59 0 11.01-4.63 11.01-11 0-.745-.08-1.32-.18-1.715H12.24z" />
        </svg>
        <span>Continue with Google</span>
        <span className="rounded bg-neutral-200 px-1.5 py-0.5 text-[9px] font-bold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
          Coming Soon
        </span>
      </button>
    </div>
  );
};

export default SocialDivider;
