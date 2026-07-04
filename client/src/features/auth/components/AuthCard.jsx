import React from 'react';

const AuthCard = ({ children, title, subtitle }) => {
  return (
    <div className="w-full rounded-xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-850 dark:bg-neutral-900 transition-colors duration-300">
      <div className="text-center mb-6">
        <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">{title}</h2>
        {subtitle && <p className="mt-1 text-xs text-neutral-400 leading-relaxed">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
};

export default AuthCard;
