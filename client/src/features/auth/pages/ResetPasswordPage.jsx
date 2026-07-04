import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import AuthCard from '../components/AuthCard.jsx';

const ResetPasswordPage = () => {
  return (
    <div className="space-y-4">
      <AuthCard title="Update Credentials">
        <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-50 text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400">
            <HelpCircle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Feature Under Development</h3>
            <p className="mt-2 text-xs text-neutral-450 leading-relaxed max-w-xs mx-auto">
              Secure reset verification tokens are currently under construction on the API server.
            </p>
          </div>
          <Link
            to="/auth/login"
            className="mt-4 rounded-md bg-neutral-900 px-6 py-2 text-xs font-bold text-white hover:bg-neutral-850 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 transition-colors"
          >
            Back to Sign In
          </Link>
        </div>
      </AuthCard>
    </div>
  );
};

export default ResetPasswordPage;
