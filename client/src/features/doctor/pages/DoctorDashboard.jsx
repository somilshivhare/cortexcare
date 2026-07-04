import React, { useState } from 'react';
import { useDoctorStats, useDoctorConsultations, useClaimConsultation } from '../hooks/useDoctorDashboard.js';
import { useToast } from '../../../contexts/ToastContext.jsx';
import PageHeader from '../../../components/PageHeader.jsx';
import PageContainer from '../../../components/PageContainer.jsx';
import EmptyState from '../../../components/EmptyState.jsx';
import ErrorState from '../../../components/ErrorState.jsx';
import StatCard from '../../../components/StatCard.jsx';
import StatusBadge from '../../../components/StatusBadge.jsx';
import { SkeletonCard, SkeletonTable } from '../../../components/Skeleton.jsx';
import { useNavigate } from 'react-router-dom';
import { Users, FileHeart, Calendar, ArrowRight, Play, CheckCircle } from 'lucide-react';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const statsQuery = useDoctorStats();
  const pendingQuery = useDoctorConsultations('pending');
  const claimedQuery = useDoctorConsultations('claimed');
  const claimMutation = useClaimConsultation();

  const [activeTab, setActiveTab] = useState('pending'); // pending, claimed, reviewed, archived

  const isLoading = statsQuery.isLoading || pendingQuery.isLoading || claimedQuery.isLoading;
  const isError = statsQuery.isError || pendingQuery.isError || claimedQuery.isError;

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title="Clinician Workspace" breadcrumbs={[{ name: 'Doctor' }, { name: 'Dashboard' }]} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonCard className="h-28" />
          <SkeletonCard className="h-28" />
        </div>
        <div className="mt-8">
          <SkeletonTable rows={4} cols={4} />
        </div>
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer>
        <PageHeader title="Clinician Workspace" breadcrumbs={[{ name: 'Doctor' }, { name: 'Dashboard' }]} />
        <ErrorState
          title="Workspace Load Failed"
          message="Could not load unassigned or claimed case queues from the Neon PostgreSQL database."
          onRetry={() => {
            statsQuery.refetch();
            pendingQuery.refetch();
            claimedQuery.refetch();
          }}
        />
      </PageContainer>
    );
  }

  const stats = statsQuery.data?.stats || { pendingUnassignedCount: 0, claimedActiveCount: 0 };
  const pendingList = pendingQuery.data?.consultations || [];
  const claimedRaw = claimedQuery.data?.consultations || [];

  // Filter claimed lists
  const claimedActiveList = claimedRaw.filter((c) => c.reviewStatus !== 'REVIEWED');
  const reviewedList = claimedRaw.filter((c) => c.reviewStatus === 'REVIEWED');
  // For demo purposes, we will treat cancelled or completed sessions over 7 days old as archived
  const archivedList = claimedRaw.filter(
    (c) => c.status === 'CANCELLED' || (c.reviewStatus === 'REVIEWED' && new Date(c.updatedAt) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
  );

  const handleClaim = async (id) => {
    try {
      await claimMutation.mutateAsync(id);
      addToast('Patient consultation claimed successfully!', 'success');
      setActiveTab('claimed');
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to claim consultation.', 'error');
    }
  };

  const getActiveList = () => {
    switch (activeTab) {
      case 'pending':
        return pendingList;
      case 'claimed':
        return claimedActiveList;
      case 'reviewed':
        return reviewedList;
      case 'archived':
        return archivedList;
      default:
        return pendingList;
    }
  };

  const currentList = getActiveList();

  const tabs = [
    { id: 'pending', name: 'Pending Unassigned', count: pendingList.length },
    { id: 'claimed', name: 'My Claimed Patients', count: claimedActiveList.length },
    { id: 'reviewed', name: 'Completed Reviews', count: reviewedList.length },
    { id: 'archived', name: 'Archived Cases', count: archivedList.length },
  ];

  return (
    <PageContainer>
      <PageHeader 
        title="Clinician Workspace" 
        breadcrumbs={[
          { name: 'Doctor' }, 
          { name: 'Dashboard' }
        ]} 
      />

      {/* Analytics stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Awaiting Clinician Claims"
          value={stats.pendingUnassignedCount}
          description="Consultation transcripts ready for review"
          icon={Users}
          color="text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400"
        />
        <StatCard
          title="My Active Claims"
          value={stats.claimedActiveCount}
          description="Consultations currently in progress"
          icon={FileHeart}
          color="text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 dark:text-indigo-400"
        />
      </div>

      {/* Queue Tabs */}
      <div className="mt-8 border-b border-neutral-200/80 dark:border-neutral-800/80">
        <div className="flex gap-6 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-xs font-bold uppercase tracking-wider transition-all duration-200 relative whitespace-nowrap ${
                  isActive
                    ? 'text-neutral-950 dark:text-white'
                    : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
                }`}
              >
                <span>{tab.name}</span>
                <span className={`ml-2 px-1.5 py-0.5 rounded text-[9px] ${
                  isActive ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950' : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'
                }`}>
                  {tab.count}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950 dark:bg-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Queue Table */}
      {currentList.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="Queue is Empty"
            description={`No consultation records match the "${tabs.find((t) => t.id === activeTab)?.name}" category.`}
            icon={Calendar}
          />
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200/80 bg-white dark:border-neutral-800/80 dark:bg-neutral-900 shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-neutral-500 dark:text-neutral-400">
              <thead className="bg-neutral-50 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:bg-neutral-800/40">
                <tr>
                  <th scope="col" className="px-6 py-3">Patient Name</th>
                  <th scope="col" className="px-6 py-3">Intake Date</th>
                  <th scope="col" className="px-6 py-3">Workflow State</th>
                  <th scope="col" className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/80 dark:divide-neutral-800/80">
                {currentList.map((consult) => {
                  const patientName = consult.patient ? `${consult.patient.firstName} ${consult.patient.lastName}` : 'Anonymous Patient';
                  const dateObj = consult.startedAt ? new Date(consult.startedAt) : new Date(consult.createdAt);
                  const formattedDate = dateObj.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <tr key={consult.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors">
                      <td className="whitespace-nowrap px-6 py-4 font-bold text-neutral-950 dark:text-white">
                        {patientName}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-xs">
                        {formattedDate}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={consult.status} />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        {activeTab === 'pending' ? (
                          <button
                            onClick={() => handleClaim(consult.id)}
                            disabled={claimMutation.isPending}
                            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 disabled:opacity-50"
                          >
                            <Play className="h-3.5 w-3.5" />
                            <span>Claim Case</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => navigate(`/doctor/consultation/${consult.id}`)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-neutral-900 hover:text-neutral-950 dark:text-white dark:hover:text-neutral-200"
                          >
                            <span>Open Details</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default DoctorDashboard;
