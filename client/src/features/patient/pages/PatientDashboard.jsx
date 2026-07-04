import React from 'react';
import { usePatientDashboard } from '../hooks/usePatientDashboard.js';
import WelcomeHeader from '../components/WelcomeHeader.jsx';
import QuickActions from '../components/QuickActions.jsx';
import DashboardStats from '../components/DashboardStats.jsx';
import RecentConsultations from '../components/RecentConsultations.jsx';
import RecentActivity from '../components/RecentActivity.jsx';
import Notifications from '../components/Notifications.jsx';
import UpcomingFeatures from '../components/UpcomingFeatures.jsx';
import { RefreshCw, AlertCircle } from 'lucide-react';

const PatientDashboard = () => {
  const { profile, clinicalContexts, isLoading, isError, error, refetch } = usePatientDashboard();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <RefreshCw className="h-8 w-8 animate-spin text-neutral-500 dark:text-neutral-400" />
        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Loading patient workspace...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-rose-200 bg-rose-50/50 p-6 text-center dark:border-rose-950/50 dark:bg-rose-950/10">
        <AlertCircle className="mx-auto h-10 w-10 text-rose-500" />
        <h3 className="mt-4 text-sm font-bold text-neutral-900 dark:text-white">Workspace Load Error</h3>
        <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
          {error?.message || 'Failed to authenticate and retrieve patient workspace metadata.'}
        </p>
        <button
          onClick={refetch}
          className="mt-4 rounded-lg bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100"
        >
          Retry Fetch
        </button>
      </div>
    );
  }

  const patientName = profile ? `${profile.firstName} ${profile.lastName}` : '';

  return (
    <div className="space-y-8">
      <WelcomeHeader patientName={patientName} />

      <QuickActions />

      <DashboardStats clinicalContexts={clinicalContexts} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <RecentConsultations clinicalContexts={clinicalContexts} />
          <RecentActivity />
        </div>
        <div>
          <Notifications />
        </div>
      </div>

      <UpcomingFeatures />
    </div>
  );
};

export default PatientDashboard;
