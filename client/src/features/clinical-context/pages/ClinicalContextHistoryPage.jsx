import React, { useState } from 'react';
import { usePatientContexts } from '../hooks/useClinicalContext.js';
import ClinicalContextDetail from '../../../components/ClinicalContextDetail.jsx';
import PageHeader from '../../../components/PageHeader.jsx';
import PageContainer from '../../../components/PageContainer.jsx';
import EmptyState from '../../../components/EmptyState.jsx';
import ErrorState from '../../../components/ErrorState.jsx';
import { SkeletonCard, SkeletonLine } from '../../../components/Skeleton.jsx';
import { Activity, Brain, Calendar, ShieldAlert } from 'lucide-react';

const ClinicalContextHistoryPage = () => {
  const { data, isLoading, isError, error, refetch } = usePatientContexts();
  const [selectedContextId, setSelectedContextId] = useState(null);

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title="Medical Records" breadcrumbs={[{ name: 'Workspace', path: '/patient/dashboard' }, { name: 'Health History' }]} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <SkeletonCard className="h-20" />
            <SkeletonCard className="h-20" />
            <SkeletonCard className="h-20" />
          </div>
          <div className="lg:col-span-2">
            <SkeletonCard className="h-96" />
          </div>
        </div>
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer>
        <PageHeader title="Medical Records" breadcrumbs={[{ name: 'Workspace', path: '/patient/dashboard' }, { name: 'Health History' }]} />
        <ErrorState title="Failed to Load History" message={error?.message} onRetry={refetch} />
      </PageContainer>
    );
  }

  const list = data?.clinicalContexts || [];
  const selectedContext = list.find((c) => c.id === selectedContextId) || list[0];

  const getRiskColor = (flags) => {
    const list = Array.isArray(flags) ? flags : Object.values(flags || {});
    if (list.length > 2) return 'bg-rose-500';
    if (list.length > 0) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <PageContainer>
      <PageHeader 
        title="Medical Records" 
        breadcrumbs={[
          { name: 'Workspace', path: '/patient/dashboard' }, 
          { name: 'Health History' }
        ]} 
      />

      {list.length === 0 ? (
        <EmptyState
          title="No Clinical Contexts Available"
          description="Your medical histories and transcripts will display here once you complete a consultation."
          icon={Brain}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Column: Intake Logs List */}
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1 scrollbar-none">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider pl-1">
              Consultation Logs
            </span>
            
            {list.map((context) => {
              const session = context.consultation;
              const isSelected = selectedContext?.id === context.id;
              const dateObj = session?.startedAt ? new Date(session.startedAt) : new Date(context.createdAt);
              const formattedDate = dateObj.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={context.id}
                  onClick={() => setSelectedContextId(context.id)}
                  className={`relative p-4 rounded-xl border cursor-pointer select-none transition-all duration-200 ${
                    isSelected
                      ? 'bg-neutral-900 border-neutral-950 text-white shadow-xs dark:bg-white dark:border-white dark:text-neutral-950'
                      : 'bg-white border-neutral-200/80 hover:border-neutral-350 dark:bg-neutral-900 dark:border-neutral-850 dark:hover:border-neutral-700'
                  }`}
                >
                  {/* Indicator Dot for Risk */}
                  <span className={`absolute top-4 right-4 h-2 w-2 rounded-full ${getRiskColor(context.riskFlags)}`} />

                  <div className="flex items-center gap-2">
                    <Calendar className={`h-4 w-4 ${isSelected ? 'text-current' : 'text-neutral-400'}`} />
                    <span className="text-xs font-bold">{formattedDate}</span>
                  </div>

                  <p className={`mt-1.5 text-xs truncate max-w-[220px] ${
                    isSelected ? 'text-neutral-200 dark:text-neutral-600' : 'text-neutral-500 dark:text-neutral-450'
                  }`}>
                    {context.summary}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[9px] font-semibold uppercase tracking-wider">
                    <span className={isSelected ? 'text-neutral-300 dark:text-neutral-500' : 'text-neutral-400'}>
                      Status: {session?.status}
                    </span>
                    <span className={isSelected ? 'text-neutral-300 dark:text-neutral-500' : 'text-neutral-400'}>
                      {session?.reviewStatus}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Active Summary Details Panel */}
          <div className="lg:col-span-2">
            {selectedContext ? (
              <ClinicalContextDetail
                clinicalContext={selectedContext}
                consultation={selectedContext.consultation}
              />
            ) : (
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-8 text-center dark:border-neutral-800/80 dark:bg-neutral-900">
                <p className="text-xs text-neutral-500">Select an intake session from the list to view clinical summaries.</p>
              </div>
            )}
          </div>

        </div>
      )}
    </PageContainer>
  );
};

export default ClinicalContextHistoryPage;
