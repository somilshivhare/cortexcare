import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle2, AlertTriangle, Play, HelpCircle } from 'lucide-react';

const RecentConsultations = ({ clinicalContexts }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 animate-pulse">
            <AlertTriangle className="h-3 w-3 animate-bounce" />
            Processing
          </span>
        );
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400">
            <Play className="h-3 w-3" />
            Active
          </span>
        );
      case 'SETUP':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
            <HelpCircle className="h-3 w-3" />
            Setup
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
            {status}
          </span>
        );
    }
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return 'No context summary available.';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  if (!clinicalContexts || clinicalContexts.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-8 text-center dark:border-neutral-800/80 dark:bg-neutral-900">
        <Calendar className="mx-auto h-10 w-10 text-neutral-300 dark:text-neutral-700" />
        <h3 className="mt-4 text-sm font-semibold text-neutral-900 dark:text-white">
          No consultations recorded
        </h3>
        <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          Your historical intakes will display here once you start a session.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white dark:border-neutral-800/80 dark:bg-neutral-900 shadow-xs">
      <div className="border-b border-neutral-200/80 px-6 py-4 dark:border-neutral-800/80">
        <h3 className="text-base font-bold text-neutral-900 dark:text-white">Recent Consultations</h3>
        <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
          Summary of voice-intake assessments and AI analysis.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm text-neutral-500 dark:text-neutral-400">
          <thead className="bg-neutral-50 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:bg-neutral-800/40">
            <tr>
              <th scope="col" className="px-6 py-3">Date</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Summary Preview</th>
              <th scope="col" className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200/80 dark:divide-neutral-800/80">
            {clinicalContexts.slice(0, 5).map((context) => {
              const session = context.consultation;
              const dateObj = session?.startedAt ? new Date(session.startedAt) : new Date(context.createdAt);
              const formattedTime = dateObj.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <tr
                  key={context.id}
                  className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors"
                >
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-neutral-950 dark:text-white">
                    {formattedTime}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(session?.status)}
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate text-xs">
                    {truncateText(context.summary)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-xs font-bold">
                    <button
                      onClick={() => navigate(`/patient/timeline/${session?.id || context.consultationId}`)}
                      className="text-neutral-900 dark:text-white hover:underline transition-colors"
                    >
                      View Timeline
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentConsultations;
