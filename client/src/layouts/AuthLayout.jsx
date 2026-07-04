import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * Centered card container for Guest login/register routes.
 */
const AuthLayout = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-neutral-50 px-4 py-12 dark:bg-neutral-950">
      {/* SaaS branding element */}
      <div className="mb-8 flex items-center space-x-2">
        <div className="h-6 w-6 rounded-md bg-neutral-900 dark:bg-neutral-50" />
        <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          CortexCare
        </span>
      </div>

      {/* Main card */}
      <div className="w-full max-w-md rounded-xl border border-neutral-200/80 bg-white p-8 shadow-sm dark:border-neutral-800/80 dark:bg-neutral-900">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
